from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ExercisePlan, TrainingPlan, WorkoutPlan
from .serializers import (
    ExercisePlanSerializer,
    TrainingPlanSerializer,
    WorkoutPlanSerializer,
)


class TrainingPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    search_fields = ["name"]
    lookup_field = "slug"

    def get_queryset(self):
        return TrainingPlan.objects.all()

    def get_serializer_class(self):
        if self.action == "workouts":
            return WorkoutPlanSerializer
        return TrainingPlanSerializer

    @action(detail=True)
    def workouts(self, request, *args, **kwargs):
        qs = self.get_object().workoutplan_set.all()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class WorkoutPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return WorkoutPlan.objects.all()

    def get_serializer_class(self):
        return WorkoutPlanSerializer


class ExercisePlanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return ExercisePlan.objects.all()

    def get_serializer_class(self):
        return ExercisePlanSerializer
