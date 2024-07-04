from django.contrib.auth import get_user_model
from django.utils.timezone import now

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.progress.models import Progress

User = get_user_model()


class ProgressSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    week_avg_energy_burnt = serializers.ReadOnlyField()
    week_avg_weight = serializers.ReadOnlyField()

    class Meta:
        model = Progress
        fields = (
            "id",
            "user",
            "username",
            "date",
            "energy_burnt",
            "week_avg_energy_burnt",
            "weight",
            "week_avg_weight",
            "site",
            "notes",
            "image",
            "created_at",
            "updated_at",
            "url",
        )
        read_only_fields = ("user__username", "user")
        extra_kwargs = {
            "date": {"initial": now().strftime("%Y-%m-%d")},
        }

    def validate_date(self, value):
        if value > now().date():
            raise serializers.ValidationError(
                "You cannot log progress for a future date."
            )
        return value

    def validate(self, data):
        user = self.context["request"].user
        date = data["date"]
        progress = Progress.objects.filter(user=user, date=date)
        if self.instance and progress.exclude(date=self.instance.date).exists():
            raise serializers.ValidationError(
                {"date": "You have already logged progress for this date."}
            )
        if not self.instance and progress.exists():
            raise serializers.ValidationError(
                {"date": "You have already logged progress for this date."}
            )

        return data


class ProgressBulkDeleteSerializer(serializers.Serializer):
    progress_id_list = serializers.ListField(child=serializers.IntegerField())

    def validate(self, data):
        user = self.context["request"].user
        progress_id_list = data["progress_id_list"]
        progress_list = Progress.objects.filter(
            id__in=progress_id_list, user=user
        ).values_list("id", flat=True)
        if not progress_list:
            raise serializers.ValidationError(
                {"progress_id_list": "Invalid progress objects."}
            )
        return data


class ProgressMonthSerializer(serializers.Serializer):
    id = serializers.IntegerField(default=None)
    user = serializers.ReadOnlyField(default=None)
    date = serializers.DateField(default=None)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, default=None)
    week_avg_weight = serializers.DecimalField(
        max_digits=5, decimal_places=2, default=None
    )
    energy_burnt = serializers.IntegerField(default=None)
    week_total_energy_burnt = serializers.IntegerField(default=None)
    week_avg_energy_burnt = serializers.IntegerField(default=None)
    week_avg_half_energy_burnt = serializers.IntegerField(default=None)
    notes = serializers.CharField(default=None)
    site = serializers.CharField(default=None)
    created_at = serializers.ReadOnlyField(default=None)
    updated_at = serializers.ReadOnlyField(default=None)
    month = serializers.ReadOnlyField(default=None)
    month_avg_weight = serializers.ReadOnlyField(default=None)


class ProgressCreateUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(default=None)
    month_avg_weight = serializers.ReadOnlyField(default=None)

    class Meta:
        model = Progress
        fields = [
            "username",
            "date",
            "weight",
            "site",
            "notes",
            "energy_burnt",
            "month_avg_weight",
        ]

    def validate(self, data):
        if data["date"] > now().date():
            raise serializers.ValidationError(
                "You cannot log progress for a future date."
            )
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("user does not exist.")
        data["user"] = user
        data.pop("username")
        return data
