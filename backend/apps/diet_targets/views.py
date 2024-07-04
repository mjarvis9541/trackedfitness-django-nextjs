from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.diet_targets.models import DailyDietTarget
from apps.diet_targets.permissions import (
    DietTargetDayWeekMonthPermissions,
    DietTargetPermissions,
)
from apps.diet_targets.serializers import (
    DailyDietTargetSerializer,
    DietTargetCopyPreviousWeekSerializer,
    DietTargetDeleteFromDateListSerializer,
    DietTargetUpdateCreateFromDateListSerializer,
)
from apps.utils.dates import get_month_range, get_week_range
from apps.utils.view_mixins import MultipleFieldLookupMixin


class UserDietTargetDateViewSet(viewsets.ModelViewSet):
    """View diet target date for a specific user."""

    def get_queryset(self):
        return (
            DailyDietTarget.objects.filter(user__username=self.kwargs.get("username"))
            .select_related("user")
            .get_grams_per_kg()
            .get_percentage_of_calories()
        )


class DailyDietTargetsViewSet(viewsets.ModelViewSet):
    permission_classes = [DietTargetPermissions]

    def get_serializer_class(self):
        if self.action == "update_create_from_date_list":
            return DietTargetUpdateCreateFromDateListSerializer
        if self.action == "update_create_from_previous_week":
            return DietTargetCopyPreviousWeekSerializer
        if self.action == "delete_from_date_list":
            return DietTargetDeleteFromDateListSerializer

        return DailyDietTargetSerializer

    def get_queryset(self):
        return (
            DailyDietTarget.objects.select_related("user")
            .get_grams_per_kg()
            .get_percentage_of_calories()
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="update-create-from-date-list",
    )
    def update_create_from_date_list(self, request):
        """
        Updates or creates diet target objects for every date given in the
        date list.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="copy-previous-week",
    )
    def update_create_from_previous_week(self, request):
        """
        Copies diet targets from a previous week to the given week.
        Calculates the start and end of the previous week from the date
        provided in the request data, creates diet targets for the current
        week based on the values of the previous week.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="delete-from-date-list",
    )
    def delete_from_date_list(self, request):
        """
        Deletes diet target objects for every date given in the date list.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            queryset = serializer.validated_data["queryset"]
            count = queryset.count()
            queryset.delete()
            return Response(
                {"data": f"{count} diet targets deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )


class DietTargetDayDetailView(MultipleFieldLookupMixin, generics.RetrieveAPIView):
    """Returns user's diet targets for the given date."""

    permission_classes = [DietTargetDayWeekMonthPermissions]
    serializer_class = DailyDietTargetSerializer
    lookup_fields = ["username", "date"]

    def get_queryset(self):
        queryset = (
            DailyDietTarget.objects.select_related("user")
            .get_username()
            .get_grams_per_kg()
            .get_percentage_of_calories()
        )
        return queryset


class DietTargetWeekListView(generics.ListAPIView):
    """Returns user's diet targets for the given week."""

    permission_classes = [DietTargetDayWeekMonthPermissions]
    serializer_class = DailyDietTargetSerializer
    filter_backends = []
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date")
        week_range = get_week_range(date)
        queryset = (
            DailyDietTarget.objects.select_related("user")
            .filter(user=user, date__range=week_range)
            .get_grams_per_kg()
            .get_percentage_of_calories()
            .order_by("date")
        )
        return queryset


class DietTargetMonthListView(generics.ListAPIView):
    """Returns user's diet targets for the given month."""

    permission_classes = [DietTargetDayWeekMonthPermissions]
    serializer_class = DailyDietTargetSerializer
    filter_backends = []
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date")
        month_range = get_month_range(date)
        queryset = (
            DailyDietTarget.objects.select_related("user")
            .filter(user=user, date__range=month_range)
            .get_grams_per_kg()
            .get_percentage_of_calories()
            .order_by("date")
        )
        return queryset
