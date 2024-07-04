from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.meals.models import Item, Meal
from apps.meals.serializers import (GenerateMealNameSerializer, ItemSerializer,
                                    MealDeleteSelectedSerializer,
                                    MealItemCreateFromListSerializer,
                                    MealSelectSerializer, MealSerializer)


class MealPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Users must be authenticated
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. Authorized users can retrieve, update and delete their own objects:
        if request.user == obj.user:
            return True

        # 2. Authorized users can retrieve objects created by other users:
        if not request == obj.user and request.method in permissions.SAFE_METHODS:
            return True

        # 3. Superusers can retrieve, update and delete all objects:
        if request.user.is_superuser:
            return True


class ItemPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Users must be authenticated
        if not request.user.is_authenticated:
            return False

        # 2. Authorized users can create objects
        if request.user.is_authenticated and request.method == "POST":
            return True

        # 3. Authorized users cannot access list view, but can access detail
        # view:
        if request.user.is_authenticated and view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
        ]:
            return True

        # 4. Superusers can access all views:
        if request.user.is_superuser:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. Authorized users can retrieve, update and delete their own objects:
        if request.user == obj.meal.user:
            return True

        # 2. Authorized users can retrieve objects created by other users:
        if not request == obj.meal.user and request.method in permissions.SAFE_METHODS:
            return True

        # 3. Superusers can retrieve, update and delete all objects:
        if request.user.is_superuser:
            return True


class MealViewSet(ModelViewSet):
    permission_classes = [MealPermissions]
    queryset = (
        Meal.objects.select_related(
            "user",
            "created_by",
            "updated_by",
        )
        .prefetch_related(
            "items",
            "items__food",
            "items__food__brand",
            "items__created_by",
            "items__updated_by",
        )
        .totals()
    )
    serializer_class = MealSerializer
    search_fields = ["name"]
    ordering = ["name"]

    def get_serializer_class(self):
        if self.action == "delete_selected":
            return MealDeleteSelectedSerializer
        if self.action == "my_meal_list_select":
            return MealSelectSerializer
        if self.action == "items":
            return ItemSerializer
        if self.action == "generate_name":
            return GenerateMealNameSerializer

        return MealSerializer

    def perform_create(self, serializer):
        
        serializer.save(
            user=self.request.user,
            created_by=self.request.user,
            updated_by=self.request.user,
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, url_path="items")
    def items(self, request, **kwargs):
        
        queryset = (
            Meal.objects.filter(pk=kwargs.get("pk"))
            .get()
            .items.select_related("food", "food__brand", "created_by", "updated_by")
            .all()
        )
        serializer = self.get_serializer(queryset, read_only=True, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["POST"], url_path="generate-name")
    def generate_name(self, request, **kwargs):
        """
        Generate a meal name based on the food and associated quantities
        within the meal.
        """
        meal = self.get_object()
        item_list = meal.items.all()
        generated_meal_name = ", ".join(
            [
                f"{round(item.quantity_input)}{item.data_measurement} {item.food_name}"
                for item in item_list
            ]
        )
        meal.name = generated_meal_name
        meal.save()
        return Response({"detail": f"{generated_meal_name}"})

    @action(detail=False, url_path="my-meal-list-select")
    def my_meal_list_select(self, request):
        """
        Return a list meals registered to the request user.
        """
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="delete-selected")
    def delete_selected(self, request):
        """
        Delete selected meals by meal id.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            queryset = serializer.validated_data["queryset"]
            queryset.delete()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, url_path="with-food")
    def get_meals_with_food(self, request):
        """
        Return only meals that contain food items.
        """
        queryset = self.get_queryset().filter(item_count__gte=1)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ItemViewSet(ModelViewSet):
    permission_classes = [ItemPermissions]
    queryset = Item.objects.select_related(
        "food",
        "food__brand",
        "created_by",
        "updated_by",
    )
    serializer_class = ItemSerializer
    search_fields = ["food__name", "meal__name"]
    ordering = ["updated_at"]

    def get_serializer_class(self):
        if self.action == "create_from_list":
            return MealItemCreateFromListSerializer
        return ItemSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=False, methods=["post"], url_path="create-from-list")
    def create_from_list(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
