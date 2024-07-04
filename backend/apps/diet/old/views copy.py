import calendar
import datetime
from collections import defaultdict
from itertools import chain, groupby
from operator import itemgetter

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db.models import OuterRef, Subquery
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.diet.models import Diet
from apps.diet.serializers import (
    CopyAllFromDateAndMealSerializer,
    CopyAllFromDateSerializer,
    DeleteFromWeekSerializer,
    DeleteSelectedSerializer,
    DiaryCreateFromMealSerializer,
    DiaryDayTotalSerializer,
    DiaryMealSerializer,
    DiarySerializer,
    DietDeleteFromDateListSerializer,
    DietSerializer,
    SaveSelectedSerializer,
)
from apps.progress.models import Progress

User = get_user_model()

regex = r"(?P<username>[\w.@+-]+)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})"


class DietViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer

    def get_queryset(self):
        return (
            Diet.objects.select_related("user").order_by("updated_at").get_food_total()
        )

    def get_serializer_class(self):
        if self.action in ["month"]:
            return DiaryDayTotalSerializer
        if self.action in ["delete_from_date_list"]:
            return DietDeleteFromDateListSerializer
        return DietSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(
        detail=False,
        url_path=r"meal/(?P<username>[\w.@+-]+)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<meal>[1-6]{1})",
    )
    def meal(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        meal = kwargs.get("meal")
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        queryset = (
            Diet.objects.filter(user=user, date=date, meal=meal)
            .select_related("user")
            .get_meal_total()
        )
        serializer = DiaryMealSerializer(queryset, many=True)
        return Response({"results": serializer.data})

    @action(detail=False, url_path=f"date/{regex}")
    def date(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        queryset = self.get_queryset().filter(user=user, date=date).get_day_total()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"results": serializer.data})

    @action(detail=False, url_path=f"week/{regex}")
    def week(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        start = date - datetime.timedelta(days=date.weekday())
        end = start + datetime.timedelta(days=6)

        queryset = (
            self.get_queryset()
            .filter(user=user, date__range=[start, end])
            .get_week_total()
            .get_last_updated_at()
            .order_by("date")
            .distinct("date")
        )

        serializer = DiaryDayTotalSerializer(queryset, many=True)
        return Response({"results": serializer.data})

    @action(detail=False, url_path=f"month/{regex}")
    def month(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
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
            Diet.objects.filter(user=user, date__range=[first_monday, last_sunday])
            .order_by("date")
            .get_last_updated_at()
            .get_week_total()
            .values()
        )

        d = defaultdict(dict)
        for elem in chain(date_list, queryset):
            d[elem["date"]].update(elem)
        obj_list = sorted(d.values(), key=itemgetter("date"))
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                "date": date,
                "month_start": month_start,
                "month_start_day_of_week": month_start_weekday,
                "first_monday": first_monday,
                "last_sunday": last_sunday,
                "results": serializer.data,
            }
        )

    @action(detail=False, url_path=f"year/{regex}")
    def year(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs.get("username"))
        try:
            date = datetime.date.fromisoformat(kwargs.get("date"))
        except ValueError:
            raise Http404

        start = datetime.date(date.year, 1, 1)
        start_weekday = start.weekday() % 7
        first_monday = start - datetime.timedelta(start_weekday)

        end = datetime.date(date.year, 12, 31)
        end_weekday = (end.weekday() - 6) % 7
        last_sunday = end - datetime.timedelta(end_weekday)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "date": date,
                "start": start,
                "start_weekday": start_weekday,
                "first_monday": first_monday,
                "end": end,
                "end_weekday": end_weekday,
                "last_sunday": last_sunday,
                "results": serializer.data,
            }
        )

    @action(detail=False, methods=["post"], url_path="create-from-diet-meal")
    def create_from_diet_meal(self, request):
        """Copy all diet entries from a previous date and meal to a chosen
        date and meal."""
        # username
        # from_date
        # from_meal
        # to_date
        # to_meal
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="create-from-diet-date")
    def create_from_diet_date(self, request):
        """Copy all diet entries from a previous date to a chosen date."""
        # username
        # from_date
        # to_date
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="create-from-saved-meal")
    def create_from_saved_meal(self, request):
        """Copy all diet entries from a saved meal to a chosen meal."""
        # username
        # meal_id
        # to_meal
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="save-as-meal")
    def save_as_meal(self, request):
        """Save selected diet entries as a meal."""
        # username
        # meal_name
        # diet_id_list
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="delete-selected")
    def delete_selected(self, request):
        """Delete selected diet entries."""
        # username
        # meal_name
        # diet_id_list
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"], url_path="delete-meal")
    def delete_meal(self, request):
        """Delete diet entries from the given date and meal."""
        # username
        # date
        # meal
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"], url_path="delete-from-date-list")
    def delete_from_date_list(self, request):
        """Delete diet entries from the given list of dates."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.delete_from_date_list()
            return Response(status=status.HTTP_204_NO_CONTENT)


"""::END OF NEW::"""


class DiaryViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["date", "meal", "user__username"]

    def get_queryset(self):
        return Diet.objects.all().summary().order_by("updated_at")

    def get_serializer_class(self):
        if self.action == "copy_all_diet_entries_from_date":
            return CopyAllFromDateSerializer
        if self.action == "copy_all_diet_entries_from_date_and_meal":
            return CopyAllFromDateAndMealSerializer
        if self.action == "save_selected":
            return SaveSelectedSerializer
        if self.action == "delete_selected":
            return DeleteSelectedSerializer
        if self.action == "create_from_meal":
            return DiaryCreateFromMealSerializer
        if self.action == "week":
            return DiaryDayTotalSerializer
        if self.action == "delete_from_week":
            return DeleteFromWeekSerializer
        if self.action in ["meal", "meal_post"]:
            return DiaryMealSerializer
        return DiarySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=False, methods=["post"], url_path="copy-from-date")
    def copy_all_diet_entries_from_date(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="copy-from-date-and-meal")
    def copy_all_diet_entries_from_date_and_meal(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, methods=["post"], url_path="save-selected")
    def save_selected(self, request):
        """Accept a list of diary ids, save as meal."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, methods=["post"], url_path="delete-selected")
    def delete_selected(self, request):
        """Accept a list of diary ids, delete."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            queryset = serializer.validated_data["queryset"]
            queryset.delete()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, methods=["post"], url_path="create-from-meal")
    def create_from_meal(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=False, methods=["get"], url_path="year")
    def year(self, request):
        queryset = self.get_queryset()
        date = self.kwargs.get("date", now().date())

        start_date = datetime.date(date.year, 1, 1)
        end_date = datetime.date(date.year, 12, 31)
        delta = end_date - start_date

        date_list_asc = [
            start_date + datetime.timedelta(days=i) for i in list(delta.days + 1)
        ]
        date_list_dsc = [
            end_date - datetime.timedelta(days=i) for i in list(delta.days + 1)
        ]

        date_list = [{"date": date} for date in date_list_dsc]
        diary_list = (
            queryset.filter(date__list=[start_date, end_date])
            .summary()
            .values(
                "user",
                "date",
                "total_day_energy",
                "total_day_fat",
                "total_day_saturates",
                "total_day_carbohydrate",
                "total_day_sugars",
                "total_day_fibre",
                "total_day_protein",
                "total_day_salt",
                "total_day_energy_per_kg_bodyweight",
            )
        )
        combined_date_list_diary_list = sorted(
            chain(date_list, diary_list), key=itemgetter("date")
        )
        diary_total_list = [
            dict(chain.from_iterable(dct.items() for dct in v))
            for k, v in groupby(combined_date_list_diary_list, key=itemgetter("date"))
        ]
        serializer = DiaryDayTotalSerializer(diary_total_list, many=True)
        return Response({"results": serializer.data})

    @action(
        detail=False,
        url_path=r"week/(?P<username>[\w.@+-]+)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})",
    )
    def week(self, request, username, date):
        user = get_object_or_404(User, username=username)
        date = datetime.datetime.fromisoformat(date)
        start_of_week = date - datetime.timedelta(days=date.weekday() % 7)
        end_of_week = start_of_week + datetime.timedelta(days=6)

        date_list = [
            {"date": (start_of_week + datetime.timedelta(days=x)).date()}
            for x in range(7)
        ]

        queryset = (
            Diet.objects.filter(user=user, date__list=[start_of_week, end_of_week])
            .annotate(
                weight=Subquery(
                    Progress.objects.filter(
                        user_id=user.id, date=OuterRef("date")
                    ).values("weight")
                )
            )
            .summary()
            .values()
        )

        d = defaultdict(dict)
        for elem in chain(date_list, queryset):
            d[elem["date"]].update(elem)
        obj_list = sorted(d.values(), key=itemgetter("date"))
        for obj in obj_list:
            if not obj.get("id"):
                obj["total_day_energy"] = 0
                obj["total_day_fat"] = 0
                obj["total_day_saturates"] = 0
                obj["total_day_carbohydrate"] = 0
                obj["total_day_sugars"] = 0
                obj["total_day_fibre"] = 0
                obj["total_day_protein"] = 0
                obj["total_day_salt"] = 0
                obj["pct_protein"] = 0
                obj["pct_carbohydrate"] = 0
                obj["pct_fat"] = 0
                obj["weight"] = 0
                obj["energy_per_kg"] = 0
                obj["protein_per_kg"] = 0
                obj["carbohydrate_per_kg"] = 0
                obj["fat_per_kg"] = 0
                obj["type"] = 0

        serializer = DiaryDayTotalSerializer(obj_list, many=True)
        # totals = {
        #     "energy": 0,
        #     "fat": 0,
        #     "saturates": 0,
        #     "carbohydrate": 0,
        #     "sugars": 0,
        #     "fibre": 0,
        #     "protein": 0,
        #     "salt": 0,
        #     "pct_protein": 0,
        #     "pct_carbohydrate": 0,
        #     "pct_fat": 0,
        # }
        # for obj in obj_list:
        #     totals["energy"] += round(obj["total_day_energy"])
        #     totals["fat"] += round(obj["total_day_fat"])
        #     totals["saturates"] += round(obj["total_day_saturates"])
        #     totals["carbohydrate"] += round(obj["total_day_carbohydrate"])
        #     totals["sugars"] += round(obj["total_day_sugars"])
        #     totals["fibre"] += round(obj["total_day_fibre"])
        #     totals["protein"] += round(obj["total_day_protein"])
        #     totals["salt"] += round(obj["total_day_salt"], 1)
        # totals["pct_protein"] = round(totals["protein"] * 4 / totals["energy"] * 100, 1)
        # totals["pct_carbohydrate"] = round(
        #     totals["carbohydrate"] * 4 / totals["energy"] * 100, 1
        # )
        # totals["pct_fat"] = round(totals["fat"] * 9 / totals["energy"] * 100, 1)
        return Response(
            {
                "results": serializer.data,
                # "totals": totals,
            }
        )

    @action(
        detail=False,
        methods=["post"],
        url_path=r"week/(?P<username>[\w.@+-]+)/(?P<from_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/delete-week",
    )
    def delete_from_week(self, request, username, from_date):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            queryset = serializer.validated_data["queryset"]
            queryset.delete()
            return Response({"data": "Diet log entries deleted successfully."})

    @action(
        detail=False,
        url_path=r"month/(?P<username>[\w.@+-]+)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})",
    )
    def month(self, request, username, date):
        date = datetime.date.fromisoformat(date)
        month_start = date.replace(day=1)
        month_end = datetime.date(
            date.year, date.month, calendar.monthrange(date.year, date.month)[1]
        )
        first_monday = month_start - datetime.timedelta(days=month_start.weekday() % 7)

        last_monday = month_end - datetime.timedelta(days=month_end.weekday() % 7)
        last_sunday = last_monday + datetime.timedelta(days=6)

        date_list = [
            {"date": first_monday + datetime.timedelta(days=x)}
            for x in range((last_sunday - first_monday).days + 1)
        ]
        queryset = (
            Diet.objects.filter(
                user__username=username, date__range=[first_monday, month_end]
            )
            .order_by("date")
            .summary()
            .values()
        )
        d = defaultdict(dict)

        for elem in chain(date_list, queryset):
            d[elem["date"]].update(elem)
        obj_list = sorted(d.values(), key=itemgetter("date"))

        # for obj in obj_list:
        # if not obj.get("id"):
        #
        serializer = DiaryDayTotalSerializer(obj_list, many=True)
        return Response({"results": serializer.data})

    # @meal.mapping.post
    # def meal_post(self, request, username, date, meal):
    #     serializer = DietCopyPreviousSerializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data)


# d = defaultdict(dict)
# for elem in chain(date_list, queryset):
#     d[elem["date"]].update(elem)
# obj_list = sorted(d.values(), key=itemgetter("date"))
# for obj in obj_list:
#     if not obj.get("id"):
#         obj["total_day_energy"] = 0
#         obj["total_day_fat"] = 0
#         obj["total_day_saturates"] = 0
#         obj["total_day_carbohydrate"] = 0
#         obj["total_day_sugars"] = 0
#         obj["total_day_fibre"] = 0
#         obj["total_day_protein"] = 0
#         obj["total_day_salt"] = 0
#         obj["pct_protein"] = 0
#         obj["pct_carbohydrate"] = 0
#         obj["pct_fat"] = 0
#         obj["weight"] = 0
#         obj["energy_per_kg"] = 0
#         obj["protein_per_kg"] = 0
#         obj["carbohydrate_per_kg"] = 0
#         obj["fat_per_kg"] = 0
#         obj["type"] = 0


# totals = {
#     "energy": 0,
#     "fat": 0,
#     "saturates": 0,
#     "carbohydrate": 0,
#     "sugars": 0,
#     "fibre": 0,
#     "protein": 0,
#     "salt": 0,
#     "pct_protein": 0,
#     "pct_carbohydrate": 0,
#     "pct_fat": 0,
# }
# for obj in obj_list:
#     totals["energy"] += round(obj["total_day_energy"])
#     totals["fat"] += round(obj["total_day_fat"])
#     totals["saturates"] += round(obj["total_day_saturates"])
#     totals["carbohydrate"] += round(obj["total_day_carbohydrate"])
#     totals["sugars"] += round(obj["total_day_sugars"])
#     totals["fibre"] += round(obj["total_day_fibre"])
#     totals["protein"] += round(obj["total_day_protein"])
#     totals["salt"] += round(obj["total_day_salt"], 1)
# totals["pct_protein"] = round(totals["protein"] * 4 / totals["energy"] * 100, 1)
# totals["pct_carbohydrate"] = round(
#     totals["carbohydrate"] * 4 / totals["energy"] * 100, 1
# )
# totals["pct_fat"] = round(totals["fat"] * 9 / totals["energy"] * 100, 1)
