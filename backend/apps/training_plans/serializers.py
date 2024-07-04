from rest_framework import serializers

from .models import ExercisePlan, TrainingPlan, WorkoutPlan


class TrainingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPlan
        fields = (
            # "id",
            # "user",
            "name",
            "slug",
            "description",
            "duration",
            "created_at",
            "updated_at",
            "url",
        )
        extra_kwargs = {"url": {"lookup_field": "slug"}}


class ExercisePlanReadOnlySerializer(serializers.ModelSerializer):
    movement = serializers.StringRelatedField()

    class Meta:
        model = ExercisePlan
        fields = (
            # "id",
            # "workout_plan",
            "order",
            "movement",
            "sets",
            "reps",
            "url",
        )


class WorkoutPlanSerializer(serializers.ModelSerializer):
    day = serializers.ReadOnlyField(source="get_day_display")
    exercises = ExercisePlanReadOnlySerializer(source="exerciseplan_set", many=True)

    class Meta:
        model = WorkoutPlan
        fields = (
            # "id",
            # "training_plan",
            # "get_day_display",
            "day",
            "order",
            "exercises",
            "url",
        )


class ExercisePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExercisePlan
        fields = (
            "id",
            "workout_plan",
            "order",
            "movement",
            "sets",
            "reps",
            "url",
        )
