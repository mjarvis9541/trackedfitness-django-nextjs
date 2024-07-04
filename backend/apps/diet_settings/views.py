from rest_framework import mixins, viewsets

from apps.diet_settings.models import DietSettings
from apps.diet_settings.serializers import DietSettingsSerializer


class DietSettingsViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = DietSettings.objects.all()
    serializer_class = DietSettingsSerializer
    filterset_fields = ["user__is_private"]
    search_fields = ["user__username"]
