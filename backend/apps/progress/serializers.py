from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from apps.progress.models import Progress

User = get_user_model()


class ProgressSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=30, source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")
    week_avg_energy_burnt = serializers.ReadOnlyField()
    week_avg_weight = serializers.ReadOnlyField()

    class Meta:
        model = Progress
        fields = (
            "id",
            "user",
            "username",
            "is_private",
            "date",
            "weight",
            "energy_burnt",
            "week_avg_weight",
            "week_avg_energy_burnt",
            "notes",
            "created_at",
            "updated_at",
            "url",
        )
        extra_kwargs = {
            "user": {"read_only": True},
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            data["user"] = User.objects.get(username=data["user"].pop("username"))
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if request_user != data["user"] and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You do not have permission to perform that action."
            )
        progress = Progress.objects.filter(user=data["user"], date=data["date"])
        if self.instance and progress.exclude(date=self.instance.date).exists():
            raise serializers.ValidationError(
                {"date": "You have already logged progress for this date."}
            )
        if not self.instance and progress.exists():
            raise serializers.ValidationError(
                {"date": "You have already logged progress for this date."}
            )
        return data


class ProgressDeleteFromDateListSerializer(serializers.Serializer):
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
                "You cannot delete progress logs for another user."
            )

        queryset = Progress.objects.filter(user=user, date__in=data["date_list"])
        if not queryset.exists():
            raise serializers.ValidationError("No diet targets within date range.")
        data["queryset"] = queryset
        return data
