from rest_framework import serializers

from apps.muscle_groups.models import MuscleGroup


class MuscleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
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
        extra_kwargs = {"url": {"lookup_field": "slug"}}
