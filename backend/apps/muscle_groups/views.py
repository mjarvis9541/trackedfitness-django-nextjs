from rest_framework import permissions, viewsets

from apps.muscle_groups.models import MuscleGroup
from apps.muscle_groups.serializers import MuscleGroupSerializer


class MuscleGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = MuscleGroup.objects.all()
    serializer_class = MuscleGroupSerializer
    lookup_field = "slug"

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
