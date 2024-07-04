from django.contrib.auth import get_user_model
from django.db.models import F
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.diet.models import Diet
from apps.diet.permissions import DietDayWeekMonthPermissions, DietPermissions
from apps.diet.serializers import (
    DietBulkDeleteDateSerializer,
    DietBulkDeleteSerializer,
    DietCreateFromDateMealSerializer,
    DietCreateFromDateSerializer,
    DietCreateFromMealSerializer,
    DietDaySerializer,
    DietDayTotalSerializer,
    DietSerializer,
    LimitedDietSerializer,
    SaveSelectedSerializer,
)
from apps.utils.dates import get_month_range, get_week_range

User = get_user_model()


class UserDietViewSet(viewsets.ModelViewSet):
    pass


class UserDietTotalViewSet(viewsets.ModelViewSet):
    pass


class DietViewSet(viewsets.ModelViewSet):
    permission_classes = [DietPermissions]

    def get_queryset(self):
        return (
            Diet.objects.select_related("user")
            .annotate(username=F("user__username"), is_private=F("user__is_private"))
            .get_food_total()
        )

    def get_serializer_class(self):
        if self.action == "create_from_meal":
            return DietCreateFromMealSerializer
        if self.action == "create_from_date":
            return DietCreateFromDateSerializer
        if self.action == "create_from_date_meal":
            return DietCreateFromDateMealSerializer
        if self.action == "save_selected":
            return SaveSelectedSerializer
        if self.action == "delete_from_id_list":
            return DietBulkDeleteSerializer
        if self.action == "delete_from_date_list":
            return DietBulkDeleteDateSerializer
        if self.request.user.is_superuser:
            return DietSerializer
        if self.action in ["create"]:
            return DietSerializer
        if self.action in ["retrieve", "update", "partial_update"]:
            return DietSerializer
        return LimitedDietSerializer

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="create-from-meal",
    )
    def create_from_meal(self, request):
        """Accepts a username, saved meal_id, diet date and diet meal, attempts to
        create diet objects from items within a saved meal."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="create-from-date",
    )
    def create_from_date(self, request):
        """Accepts a `username`, `from_date` and `to_date`, in a post request,
        attempts to create diet objects from the given date."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="create-from-date-meal",
    )
    def create_from_date_meal(self, request):
        """Accepts a `username`, `from_date`, `to_date`, `from_meal`,
        `to_meal`, attempts to create diet objects from the given date and
        meal."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="delete-from-id-list",
    )
    def delete_from_id_list(self, request):
        """Accepts a `username` and `id_list` in a post request, deletes diet objects
        from the id range for the user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = serializer.validated_data["queryset"]
        count = queryset.count()
        queryset.delete()
        return Response(
            {"data": f"{count} diet entries deleted."},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="delete-from-date-list",
    )
    def delete_from_date_list(self, request):
        """Accepts a `username` and `date_list` in a post request, deletes diet
        objects from the date range for the user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = serializer.validated_data["queryset"]
        count = queryset.count()
        queryset.delete()
        return Response(
            {"data": f"{count} diet entries deleted."},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="save-selected",
    )
    def save_selected(self, request):
        """Accept a list of diary ids, save as meal."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class DietDayListView(generics.ListAPIView):
    """Accepts a user and date in the url params and returns diet objects for
    the user and the given day."""

    permission_classes = [DietDayWeekMonthPermissions]
    serializer_class = DietDaySerializer
    # Allow filtering by meal:
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["meal"]
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date", timezone.now().date())
        return (
            Diet.objects.select_related("user", "food")
            .filter(user=user, date=date)
            .order_by("updated_at")
            .get_day_total()
        )


class DietWeekListView(generics.ListAPIView):
    """Accepts a user and date in the url params and returns diet object
    totals for the user within the week range."""

    permission_classes = [DietDayWeekMonthPermissions]
    serializer_class = DietDayTotalSerializer
    filter_backends = []
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date", timezone.now().date())
        week_range = get_week_range(date)
        return (
            Diet.objects.filter(user=user, date__range=week_range)
            .order_by("date")
            .get_week_total()
            .get_week_average()
            .distinct("date")
        )


class DietMonthListView(generics.ListAPIView):
    """Accepts a user and date in the url params and returns diet object
    totals for the user within the month range."""

    permission_classes = [DietDayWeekMonthPermissions]
    serializer_class = DietDayTotalSerializer
    filter_backends = []
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date", timezone.now().date())
        month_range = get_month_range(date)
        return (
            Diet.objects.filter(user=user, date__range=month_range)
            .order_by("date")
            .get_week_total()
            .get_week_average()
            .distinct("date")
        )
