from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.brands.models import Brand


class BrandSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=255,
        validators=[
            UniqueValidator(
                queryset=Brand.objects.all(),
                message="A brand with this name already exists.",
                lookup="iexact",
            )
        ],
    )
    food_count = serializers.ReadOnlyField()
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    updated_by_username = serializers.ReadOnlyField(source="updated_by.username")

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
            "slug",
            "food_count",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
            "url",
        )
        read_only_fields = ("created_by", "updated_by", "slug")
        lookup_field = "slug"
        extra_kwargs = {"url": {"lookup_field": "slug"}}

    # def validate_name(self, value):
    #     brand = Brand.objects.filter(name=value.lower())
    #     if self.instance:
    #         brand = brand.exclude(pk=self.instance.pk)
    #     if brand.exists():
    #         raise serializers.ValidationError("A brand with this name already exists.")
    #     return value


class BrandSelectSerializer(serializers.ModelSerializer):
    name_with_count = serializers.ReadOnlyField()

    class Meta:
        model = Brand
        fields = ("id", "name", "name_with_count")
