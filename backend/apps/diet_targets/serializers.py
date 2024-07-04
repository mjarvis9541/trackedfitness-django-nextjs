import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from apps.diet_targets.models import DailyDietTarget
from apps.utils.dates import get_week_range

User = get_user_model()


class DailyDietTargetSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    weight = serializers.DecimalField(
        label="Weight kg",
        max_digits=5,
        decimal_places=2,
        min_value=Decimal("0.01"),
        default=None,
    )

    energy_per_kg = serializers.ReadOnlyField()
    protein_per_kg = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=Decimal("0.00"), default=None
    )
    carbohydrate_per_kg = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=Decimal("0.00"), default=None
    )
    fat_per_kg = serializers.DecimalField(
        max_digits=5, decimal_places=2, min_value=Decimal("0.00"), default=None
    )

    percent_protein = serializers.ReadOnlyField()
    percent_carbohydrate = serializers.ReadOnlyField()
    percent_fat = serializers.ReadOnlyField()

    class Meta:
        model = DailyDietTarget
        fields = (
            "id",
            "username",
            "is_private",
            "date",
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
            "weight",
            "energy_per_kg",
            "protein_per_kg",
            "carbohydrate_per_kg",
            "fat_per_kg",
            "percent_protein",
            "percent_carbohydrate",
            "percent_fat",
            "created_at",
            "updated_at",
            "url",
        )
        read_only_fields = (
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
            "energy_per_kg",
        )
        extra_kwargs = {
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username
        self.fields["weight"].initial = self.context["request"].user.profile.weight

    def validate(self, data):
        try:
            user = User.objects.get(username=data["user"].pop("username"))
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")

        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet targets for another user."
            )

        target = DailyDietTarget.objects.filter(user=user, date=data["date"])
        if self.instance and target.exclude(date=self.instance.date).exists():
            raise serializers.ValidationError(
                "You have already set custom targets for this date."
            )
        if not self.instance and target.exists():
            raise serializers.ValidationError(
                "You have already set custom targets for this date."
            )
        data["user"] = user
        return data

    def create(self, validated_data):
        DailyDietTarget.objects.create_by_grams_per_kg(**validated_data)
        # Recall the instance and annotate so the macro per kg and percent
        # values are populated:
        instance = (
            DailyDietTarget.objects.filter(
                user=validated_data["user"], date=validated_data["date"]
            )
            .get_grams_per_kg()
            .get_percentage_of_calories()
            .get()
        )
        return instance

    def update(self, instance, validated_data):
        instance.update_by_grams_per_kg(**validated_data)
        # Recall the instance and annotate so the macro per kg and percent
        # values are populated:
        instance = (
            DailyDietTarget.objects.filter(pk=instance.pk)
            .get_grams_per_kg()
            .get_percentage_of_calories()
            .get()
        )
        return instance


class DietTargetUpdateCreateFromDateListSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, write_only=True)
    weight = serializers.DecimalField(
        label="Weight kg",
        max_digits=5,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )
    date_list = serializers.ListField(child=serializers.DateField(), max_length=31)

    energy_per_kg = serializers.ReadOnlyField()
    protein_per_kg = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=Decimal("0.00"), default=None
    )
    carbohydrate_per_kg = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=Decimal("0.00"), default=None
    )
    fat_per_kg = serializers.DecimalField(
        max_digits=5, decimal_places=2, min_value=Decimal("0.00"), default=None
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username
        self.fields["weight"].initial = self.context["request"].user.profile.weight

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet targets for another user."
            )

        data["user"] = user
        return data

    def save(self):
        return DailyDietTarget.objects.update_create_from_date_list(
            **self.validated_data
        )


class DietTargetCopyPreviousWeekSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, write_only=True)
    date = serializers.DateField(initial=timezone.now().strftime("%Y-%m-%d"))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet targets for another user."
            )

        date_minus_one_week = data["date"] - datetime.timedelta(days=7)
        date_range = get_week_range(date_minus_one_week)

        queryset = DailyDietTarget.objects.filter(user=user, date__range=date_range)
        if not queryset.exists():
            raise serializers.ValidationError("No diet targets within previous week.")
        data["user"] = user
        data["queryset"] = queryset
        return data

    def save(self):
        return DailyDietTarget.objects.update_create_from_previous_week(
            **self.validated_data
        )


class DietTargetDeleteFromDateListSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, max_length=30)
    date_list = serializers.ListField(
        child=serializers.DateField(), allow_empty=False, max_length=100
    )

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot delete diet targets for another user."
            )

        queryset = DailyDietTarget.objects.filter(user=user, date__in=data["date_list"])
        if not queryset.exists():
            raise serializers.ValidationError("No diet targets within date range.")
        data["queryset"] = queryset
        return data
