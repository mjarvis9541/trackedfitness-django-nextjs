from django.db import models
from django.db.models import Count, F, Value
from django.db.models.functions import Concat


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
