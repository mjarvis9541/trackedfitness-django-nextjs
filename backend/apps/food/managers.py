import datetime

from django.db import models
from django.db.models import (
    Case,
    Count,
    ExpressionWrapper,
    F,
    OuterRef,
    Subquery,
    Value,
    When,
)
from django.db.models.functions import Coalesce, Concat
from django.utils.timezone import make_aware


class BrandQuerySet(models.QuerySet):
    def food_count(self):
        return self.annotate(food_count=Count("food"))

    def food_count_with_name(self):
        return self.food_count().annotate(
            name_with_count=Concat(
                F("name"),
                Value(" ("),
                F("food_count"),
                Value(")"),
                output_field=models.CharField(),
            )
        )


class FoodQuerySet(models.QuerySet):
    def added_to_diary_last_quantity(self, user=None):
        """User obj must be passed in for this to work correctly."""
        from apps.diet.models import Diet

        return self.annotate(
            nullable_latest_diary_qty=Subquery(
                Diet.objects.filter(food=OuterRef("pk"), user=user)
                .order_by("-created_at")
                .values("quantity")[:1]
            ),
            latest_diary_qty=Coalesce(
                "nullable_latest_diary_qty",
                Value(0),
                output_field=models.DecimalField(),
            ),
            # will convert the latest diary_qty from eg: "1.2" to "120" for grams/ml, and leave it as is for srv
            added_to_diary_last_quantity=Case(
                When(
                    data_measurement="g",
                    then=ExpressionWrapper(
                        F("latest_diary_qty") * 100, output_field=models.IntegerField()
                    ),
                ),
                When(
                    data_measurement="ml",
                    then=ExpressionWrapper(
                        F("latest_diary_qty") * 100, output_field=models.IntegerField()
                    ),
                ),
                default=F("latest_diary_qty"),
                output_field=models.IntegerField(),
            ),
        )

    def added_to_diary_last_date(self, user=None):
        """User obj must be passed in for this to work correctly."""
        from apps.diet.models import Diet

        dummy_date = make_aware(datetime.datetime(1970, 1, 1, 0, 0))
        return self.annotate(
            added_to_diary_last_date_or_null=Subquery(
                Diet.objects.filter(food=OuterRef("pk"), user=user)
                .order_by("-created_at")
                .values("created_at")[:1]
            ),
            # this will stop null values coming before the "last added food date" when ordering by
            # last added to diary
            added_to_diary_last_date=Case(
                When(
                    added_to_diary_last_date_or_null__isnull=True,
                    then=Value(dummy_date, output_field=models.DateTimeField()),
                ),
                default=F("added_to_diary_last_date_or_null"),
            ),
        )

    def added_to_diary_count(self, user=None):
        """User obj must be passed in for this to work correctly."""
        from ..diet.models import Diet

        return self.annotate(
            nullable_added_to_diary_count=Subquery(
                Diet.objects.filter(food=OuterRef("pk"), user=user)
                .values("food")  # this can be any value
                .annotate(added_to_diary=Count(F("id")))  # this also can be any value
                .values("added_to_diary")
            ),
            added_to_diary_count=Coalesce("nullable_added_to_diary_count", Value(0)),
        )
