import calendar
import datetime
from collections import defaultdict
from itertools import chain
from operator import itemgetter

from django.contrib.auth import get_user_model
from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.progress.models import Progress
from apps.progress.serializers import (
    ProgressBulkDeleteSerializer,
    ProgressCreateUpdateSerializer,
    ProgressMonthSerializer,
    ProgressSerializer,
)

User = get_user_model()

regex = r"(?P<username>[\w.@+-]+)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})"


class ProgressViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ProgressSerializer
    filterset_fields = ["user__username", "date"]

    def get_queryset(self):
        return Progress.objects.all().week_avg_energy_burnt().week_avg_weight()

    def get_serializer_class(self):
        if self.action == "bulk_delete":
            return ProgressBulkDeleteSerializer
        if self.action in ["username_date_or_none_post", "username_date_or_none_put"]:
            return ProgressCreateUpdateSerializer
        return ProgressSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, url_path=f"username/{regex}")
    def username_date_or_none(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        obj = self.get_queryset().filter(user_id=user.id, date=date).first()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    @username_date_or_none.mapping.post
    def username_date_or_none_post(self, request, **kwargs):
        if request.data.get("energy_burnt") == "":
            request.data["energy_burnt"] = None
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @username_date_or_none.mapping.put
    def username_date_or_none_put(self, request, **kwargs):
        if request.data.get("energy_burnt") == "":
            request.data["energy_burnt"] = None

        user = get_object_or_404(User, username=kwargs.get("username"))
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        obj = self.get_queryset().filter(user_id=user.id, date=date).first()
        serializer = self.get_serializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, url_path=f"month/{regex}")
    def month(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        if not request.user.is_superuser and request.user != user:
            return Response({"data": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        month_start = datetime.date(date.year, date.month, 1)
        month_start_weekday = month_start.weekday() % 7
        first_monday = month_start - datetime.timedelta(month_start_weekday)

        month_end = datetime.date(
            date.year, date.month, calendar.monthrange(date.year, date.month)[1]
        )
        month_end_weekday = month_end.weekday() - 6 % 7
        last_sunday = month_end - datetime.timedelta(month_end_weekday)

        date_list = [
            {"date": first_monday + datetime.timedelta(days=x)}
            for x in range((last_sunday - first_monday).days + 1)
        ]

        queryset = (
            Progress.objects.filter(user=user, date__range=[first_monday, last_sunday])
            .week_total_energy_burnt()
            .week_avg_energy_burnt()
            .week_avg_weight()
            .month_avg_weight()
            .order_by("date")
            .values()
        )
        d = defaultdict(dict)
        for elem in chain(date_list, queryset):
            d[elem["date"]].update(elem)
        obj_list = sorted(d.values(), key=itemgetter("date"))
        serializer = ProgressMonthSerializer(obj_list, many=True)
        return Response({"results": serializer.data})

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAdminUser],
        url_path="bulk-delete",
    )
    def bulk_delete(self, request):
        queryset = self.get_queryset().filter(
            user__username=request.data.get("username"),
            date__in=request.data.get("date_list"),
        )
        queryset.delete()
        return Response(status.HTTP_204_NO_CONTENT)
