from rest_framework import serializers

from apps.profiles.models import Profile
from apps.targets.models import Target


class LimitedProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    class Meta:
        model = Profile
        fields = (
            "username",
            "is_private",
            "created_at",
            "url",
        )
        extra_kwargs = {"url": {"lookup_field": "username"}}


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")
    user_url = serializers.HyperlinkedIdentityField(
        view_name="user-detail", lookup_field="username"
    )
    target_url = serializers.HyperlinkedIdentityField(
        view_name="target-detail", lookup_field="username"
    )
    profile_url = serializers.HyperlinkedIdentityField(
        view_name="profile-detail", lookup_field="username"
    )

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "image",
            "is_private",
            "goal",
            "activity_level",
            "get_goal_display",
            "get_activity_level_display",
            "get_sex_display",
            "sex",
            "height",
            "weight",
            "date_of_birth",
            "bmi",
            "bmr",
            "tdee",
            "user_url",
            "target_url",
            "profile_url",
            "created_at",
            "updated_at",
        )
        # extra_kwargs = {"date_of_birth": {"write_only": True}}


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = [
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
        ]


class ProfileTargetSerializer(serializers.ModelSerializer):
    """Allow the user to update profile and target."""

    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")
    user_url = serializers.HyperlinkedIdentityField(
        view_name="user-detail", lookup_field="username"
    )
    target_url = serializers.HyperlinkedIdentityField(
        view_name="target-detail", lookup_field="username"
    )
    profile_url = serializers.HyperlinkedIdentityField(
        view_name="profile-detail", lookup_field="username"
    )
    target = TargetSerializer(read_only=True, many=False, source="user.target")

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "is_private",
            "goal",
            "activity_level",
            # "get_goal_display",
            # "get_activity_level_display",
            "sex",
            "height",
            "weight",
            "date_of_birth",
            "bmi",
            "bmr",
            "tdee",
            "target",
            "user_url",
            "target_url",
            "profile_url",
            "created_at",
            "updated_at",
        )

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.user.target.update_from_profile()
        return instance


class ProfileHeaderSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    initials = serializers.ReadOnlyField(source="user.initials")
    last_login = serializers.ReadOnlyField(source="user.last_login")
    date_joined = serializers.ReadOnlyField(source="user.date_joined")

    class Meta:
        model = Profile
        fields = (
            "username",
            "initials",
            "last_login",
            "date_joined",
        )
        extra_kwargs = {"url": {"lookup_field": "username"}}
