from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.progress.models import Progress
from apps.progress.serializers import (
    ProgressDeleteFromDateListSerializer,
    ProgressSerializer,
)
from apps.utils.dates import get_month_range
from apps.utils.view_mixins import MultipleFieldLookupMixin

User = get_user_model()


class ProgressPermissions(permissions.BasePermission):
    """Standard list view for all users cannot be viewed."""

    def has_permission(self, request, view):
        # 1. Users must be authenticated
        if not request.user.is_authenticated:
            return False

        # 2. Authorized users can create objects
        if request.user.is_authenticated and request.method == "POST":
            return True

        # 3. Authorized users can access the following views
        if request.user.is_authenticated and view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
        ]:
            return True

        # 4. Superusers can access all views
        if request.user.is_superuser:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. Authorized users can view their own objects
        if request.user == obj.user:
            return True

        # 2. Authorized users can view other user objects if not private
        if not obj.user.is_private and request.method in permissions.SAFE_METHODS:
            return True

        # 3. Superusers can view all objects
        if request.user.is_superuser:
            return True


class ProgressDayMonthPermissions(permissions.BasePermission):
    """
    Checks object permissions against a list view.
    Retrieves the user object from the url params via get_object_or_404
    - If a user is found, sets the user to the view kwargs
    - Checks the request user is the url params user
    - Checks if the url params user is set to private
    """

    def has_permission(self, request, view):
        # 1a. Users must be authenticated
        if not request.user.is_authenticated:
            return False

        # 1b. Get user object and set to the view
        username = view.kwargs.get("username")
        user = get_object_or_404(User, username=username)
        view.kwargs["user"] = user

        # 2. Authenticated users can access their own list data
        if request.user.username == user.username:
            return True

        # 3. Authenticated users can access other user list data if not
        # private
        if not user.is_private:
            return True

        # 4. Superusers can access all list data
        if request.user.is_superuser:
            return True


class ProgressViewSet(viewsets.ModelViewSet):
    permission_classes = [ProgressPermissions]
    serializer_class = ProgressSerializer
    filterset_fields = ["user__username"]

    def get_queryset(self):
        return (
            Progress.objects.select_related("user")
            .week_avg_weight()
            .week_avg_energy_burnt()
            .order_by("date")
        )

    def create(self, request, *args, **kwargs):
        if request.data.get("energy_burnt") == "":
            request.data["energy_burnt"] = None
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.data.get("energy_burnt") == "":
            request.data["energy_burnt"] = None
        return super().update(request, *args, **kwargs)

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "delete_from_date_list":
            return ProgressDeleteFromDateListSerializer
        return ProgressSerializer

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="delete-from-date-list",
    )
    def delete_from_date_list(self, request):
        """
        Deletes progress objects for every date given in the date list.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = serializer.validated_data["queryset"]
        count = queryset.count()
        queryset.delete()
        # @TODO: FE not receiving response:
        return Response(
            {"data": f"{count} progress logs deleted."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ProgressDayDetailView(MultipleFieldLookupMixin, generics.RetrieveAPIView):
    """
    Read-only endpoint that returns user progress for a given date.
    """

    permission_classes = [ProgressDayMonthPermissions]
    serializer_class = ProgressSerializer
    lookup_fields = ["username", "date"]

    def get_queryset(self):
        # if not self.kwargs.get("date"):
        #     self.kwargs["date"] = timezone.now().date()
        queryset = (
            Progress.objects.select_related("user")
            .get_username()
            .week_avg_weight()
            .week_avg_energy_burnt()
        )
        return queryset


class ProgressMonthListView(generics.ListAPIView):
    """
    Read-only endpoint that returns user progress for a given month, derived
    from the given date.
    """

    permission_classes = [ProgressDayMonthPermissions]
    serializer_class = ProgressSerializer
    filter_backends = []
    pagination_class = None

    def get_queryset(self):
        user = self.kwargs.get("user")
        date = self.kwargs.get("date")
        # date = self.kwargs.get("date", timezone.now().date())
        month_range = get_month_range(date)
        queryset = (
            Progress.objects.select_related("user")
            .filter(user=user, date__range=month_range)
            .week_avg_weight()
            .week_avg_energy_burnt()
            .order_by("date")
        )
        return queryset
