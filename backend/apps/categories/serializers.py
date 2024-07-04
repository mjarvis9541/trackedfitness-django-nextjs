from rest_framework import serializers

from apps.categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
            "url",
        )
        lookup_field = "slug"
        extra_kwargs = {"url": {"lookup_field": "slug"}}
