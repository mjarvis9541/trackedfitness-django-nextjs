from apps.brands.models import Brand
from apps.brands.serializers import BrandSelectSerializer, BrandSerializer
from config.permissions import IsCreatedByOrReadOnly
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class BrandViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsCreatedByOrReadOnly]
    search_fields = ["name"]
    filterset_fields = [
        "created_by",
        "updated_by",
        "created_by__username",
        "updated_by__username",
    ]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Brand.objects.select_related(
                "created_by",
                "updated_by",
            )
            .food_count()
            .order_by("name")
        )

    def get_serializer_class(self):
        if self.action == "select":
            return BrandSelectSerializer
        return BrandSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=False)
    def select(self, request):
        queryset = self.get_queryset().food_count_with_name()
        serializer = self.get_serializer_class(queryset, many=True)
        return Response(serializer.data)
