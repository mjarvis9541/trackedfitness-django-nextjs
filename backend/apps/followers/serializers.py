from rest_framework import serializers

from apps.followers.models import UserFollowing


class UserFollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = ("id", "user", "following", "url")
        read_only_fields = ("user",)

    def validate(self, data):
        user = self.context["request"].user
        following = data["following"]
        if user == following:
            raise serializers.ValidationError("You are unable to follow yourself.")
        if self.Meta.model.objects.filter(user=user, following=following).exists():
            raise serializers.ValidationError("You are already following this user.")
        return data


class FollowingSerializer(serializers.ModelSerializer):
    following_username = serializers.ReadOnlyField()

    class Meta:
        model = UserFollowing
        fields = (
            "id",
            "following",
            "following_username",
            "pending",
            "created_at",
            "url",
        )


class FollowersSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField()

    class Meta:
        model = UserFollowing
        fields = ("id", "user", "user_username", "pending", "created_at", "url")
