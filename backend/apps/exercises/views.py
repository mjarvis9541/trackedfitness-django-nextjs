from rest_framework import mixins, permissions, viewsets

from apps.exercises.models import Exercise
from apps.exercises.serializers import ExerciseSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    lookup_field = "slug"

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
