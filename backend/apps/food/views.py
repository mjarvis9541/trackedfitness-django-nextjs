from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.food.models import Brand, Food
from apps.food.serializers import BrandSelectSerializer, BrandSerializer, FoodSerializer
from config.permissions import IsCreatedByOrReadOnly


class FoodViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsCreatedByOrReadOnly]
    # permission_classes = []
    search_fields = ["name"]
    filterset_fields = [
        "brand",
        "data_measurement",
        "created_by__username",
        "updated_by__username",
    ]

    def get_queryset(self):
        # return Food.objects.select_related("created_by", "updated_by", "brand")
        user = self.request.user
        return (
            Food.objects.select_related("created_by", "updated_by", "brand")
            .added_to_diary_last_quantity(user=user)
            .added_to_diary_last_date(user=user)
            .added_to_diary_count(user=user)
        )

    def get_serializer_class(self):
        return FoodSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class BrandViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsCreatedByOrReadOnly]
    # permission_classes = []
    search_fields = ["name"]
    filterset_fields = [
        "created_by",
        "updated_by",
        "created_by__username",
        "updated_by__username",
    ]

    def get_queryset(self):
        return (
            Brand.objects.select_related("created_by", "updated_by")
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

    @action(detail=False, permission_classes=[IsAuthenticated], url_path="select")
    def select(self, request):
        queryset = self.get_queryset().food_count_with_name()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
