from rest_framework import serializers

from apps.exercises.models import Exercise


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
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
