from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.targets.models import Target

User = get_user_model()


class LimitedTargetSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    class Meta:
        model = Target
        fields = [
            "username",
            "is_private",
            "created_at",
            "url",
        ]
        extra_kwargs = {"url": {"lookup_field": "username"}}


class TargetSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")
    weight = serializers.ReadOnlyField(source="user.profile.weight")

    energy_per_kg = serializers.ReadOnlyField(default=None)
    protein_per_kg = serializers.ReadOnlyField(default=None)
    carbohydrate_per_kg = serializers.ReadOnlyField(default=None)
    fat_per_kg = serializers.ReadOnlyField(default=None)
    percent_protein = serializers.ReadOnlyField(default=None)
    percent_carbohydrate = serializers.ReadOnlyField(default=None)
    percent_fat = serializers.ReadOnlyField(default=None)

    user_url = serializers.HyperlinkedIdentityField(
        view_name="user-detail", lookup_field="username"
    )
    profile_url = serializers.HyperlinkedIdentityField(
        view_name="profile-detail", lookup_field="username"
    )
    target_url = serializers.HyperlinkedIdentityField(
        view_name="target-detail", lookup_field="username"
    )

    class Meta:
        model = Target
        fields = (
            "id",
            "username",
            "is_private",
            "weight",
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
            "energy_per_kg",
            "protein_per_kg",
            "carbohydrate_per_kg",
            "fat_per_kg",
            "percent_protein",
            "percent_carbohydrate",
            "percent_fat",
            "calculation_method",
            "user_url",
            "profile_url",
            "target_url",
            "created_at",
            "updated_at",
        )


class TargetGramsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")
    weight = serializers.DecimalField(
        label="Weight kg",
        max_digits=5,
        decimal_places=2,
        source="user.profile.weight",
    )
    energy_per_kg = serializers.ReadOnlyField(default=None)
    protein_per_kg = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=None,
    )
    carbohydrate_per_kg = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=None,
    )
    fat_per_kg = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=None,
    )
    percent_protein = serializers.ReadOnlyField(default=None)
    percent_carbohydrate = serializers.ReadOnlyField(default=None)
    percent_fat = serializers.ReadOnlyField(default=None)

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
        model = Target
        fields = (
            "id",
            "is_private",
            "username",
            "weight",
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
            "energy_per_kg",
            "protein_per_kg",
            "carbohydrate_per_kg",
            "fat_per_kg",
            "percent_protein",
            "percent_carbohydrate",
            "percent_fat",
            "user_url",
            "profile_url",
            "target_url",
            # leaving in so frontend can ascertain whether daily target
            "calculation_method",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "user",
            "username",
            "energy_per_kg",
            "calculation_method",
        )

    def update(self, instance, validated_data):
        instance.update_by_grams_per_kg(**validated_data)
        # Recall the instance and annotate so the macro per ky and percent
        # values are populated:
        instance = (
            Target.objects.filter(pk=instance.pk)
            .get_username()
            .get_grams_per_kg()
            .get_percentage_of_calories()
            .get()
        )
        return instance
