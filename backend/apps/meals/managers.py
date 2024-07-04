from django.db import models
from django.db.models import (
    Count,
    ExpressionWrapper,
    F,
    IntegerField,
    OuterRef,
    Subquery,
    Sum,
    Value,
    Window,
)
from django.db.models.functions import Coalesce


class MealQuerySet(models.QuerySet):
    def subquery(self):
        """Unused."""
        from .models import Item

        return self.annotate(
            item_cals=Subquery(
                Item.objects.filter(meal=OuterRef("pk"))
                .values("meal")
                .annotate(
                    item_calss=Sum(
                        F("quantity") * F("food__energy"),
                    ),
                )
                .values("item_calss")
            ),
            item_pro=Subquery(
                Item.objects.filter(meal=OuterRef("pk"))
                .values("meal")
                .annotate(
                    item_pro=Sum(F("quantity") * F("food__protein")),
                )
                .values("item_pro")
            ),
        )

    def meal_items(self):
        """Gets items for each meal"""
        return self.annotate(
            item_id=F("items__id"),
            item_food_name=F("items__food__name"),
            item_brand_name=F("items__food__brand__name"),
            item_data_value=F("items__quantity") * F("items__food__data_value"),
            item_data_measurement=F("items__food__data_measurement"),
            item_energy=ExpressionWrapper(
                F("items__food__energy") * F("items__quantity"),
                output_field=models.IntegerField(),
            ),
            item_protein=ExpressionWrapper(
                F("items__food__protein") * F("items__quantity"),
                output_field=models.DecimalField(max_digits=3, decimal_places=1),
            ),
            item_carbohydrate=ExpressionWrapper(
                F("items__food__carbohydrate") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
            item_fat=ExpressionWrapper(
                F("items__food__fat") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
            item_saturates=ExpressionWrapper(
                F("items__food__saturates") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
            item_sugars=ExpressionWrapper(
                F("items__food__sugars") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
            item_fibre=ExpressionWrapper(
                F("items__food__fibre") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
            item_salt=ExpressionWrapper(
                F("items__food__salt") * F("items__quantity"),
                output_field=models.DecimalField(),
            ),
        ).order_by("id")

    def summary(self):
        return self.annotate(
            food_count=Count(F("items")),
            energy=Sum(
                ExpressionWrapper(
                    F("items__food__energy") * F("items__quantity"),
                    output_field=models.IntegerField(),
                )
            ),
            protein=Sum(
                ExpressionWrapper(
                    F("items__food__protein") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            carbohydrate=Sum(
                ExpressionWrapper(
                    F("items__food__carbohydrate") * F("items__quantity"),
                    output_field=models.IntegerField(),
                )
            ),
            fat=Sum(
                ExpressionWrapper(
                    F("items__food__fat") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            saturates=Sum(
                ExpressionWrapper(
                    F("items__food__saturates") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
            ),
            sugars=Sum(
                ExpressionWrapper(
                    F("items__food__sugars") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            fibre=Sum(
                ExpressionWrapper(
                    F("items__food__fibre") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            salt=Sum(
                ExpressionWrapper(
                    F("items__food__salt") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
        )

    def totals(self):
        return self.annotate(
            item_count=Count(F("items")),
            food_count=Count(F("items")),
            energy=Sum(
                ExpressionWrapper(
                    F("items__food__energy") * F("items__quantity"),
                    output_field=models.IntegerField(),
                )
            ),
            protein=Sum(
                ExpressionWrapper(
                    F("items__food__protein") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            carbohydrate=Sum(
                ExpressionWrapper(
                    F("items__food__carbohydrate") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            fat=Sum(
                ExpressionWrapper(
                    F("items__food__fat") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            saturates=Sum(
                ExpressionWrapper(
                    F("items__food__saturates") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            sugars=Sum(
                ExpressionWrapper(
                    F("items__food__sugars") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            fibre=Sum(
                ExpressionWrapper(
                    F("items__food__fibre") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
            salt=Sum(
                ExpressionWrapper(
                    F("items__food__salt") * F("items__quantity"),
                    output_field=models.DecimalField(),
                )
            ),
        )

    def window(self):
        """Deprecated."""
        return (
            # self.prefetch_related("items")
            self.annotate(
                energy=ExpressionWrapper(
                    F("items__food__energy") * F("items__quantity"),
                    output_field=models.IntegerField(),
                ),
                protein=ExpressionWrapper(
                    F("items__food__protein") * F("items__quantity"),
                    output_field=models.DecimalField(max_digits=3, decimal_places=1),
                ),
                carbohydrate=ExpressionWrapper(
                    F("items__food__carbohydrate") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                fat=ExpressionWrapper(
                    F("items__food__fat") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                saturates=ExpressionWrapper(
                    F("items__food__saturates") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                sugars=ExpressionWrapper(
                    F("items__food__sugars") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                fibre=ExpressionWrapper(
                    F("items__food__fibre") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                salt=ExpressionWrapper(
                    F("items__food__salt") * F("items__quantity"),
                    output_field=models.DecimalField(),
                ),
                item_count=Window(expression=Count("items"), partition_by=[F("id")]),
                total_energy=Window(expression=Sum("energy"), partition_by=[F("id")]),
                total_protein=Window(expression=Sum("protein"), partition_by=[F("id")]),
                total_carbohydrate=Window(
                    expression=Sum("carbohydrate"), partition_by=[F("id")]
                ),
                total_fat=Window(expression=Sum("fat"), partition_by=[F("id")]),
                total_saturates=Window(
                    expression=Sum("saturates"), partition_by=[F("id")]
                ),
                total_sugars=Window(expression=Sum("sugars"), partition_by=[F("id")]),
                total_fibre=Window(expression=Sum("fibre"), partition_by=[F("id")]),
                total_salt=Window(expression=Sum("salt"), partition_by=[F("id")]),
            ).distinct("name")
        )


class ItemQuerySet(models.QuerySet):
    def summary(self):
        return self.select_related("food").annotate(
            food_name=F("food__name"),
            brand_id=F("food__brand__id"),
            brand_name=F("food__brand__name"),
            data_value=ExpressionWrapper(
                F("quantity") * F("food__data_value"),
                output_field=models.DecimalField(),
            ),
            data_measurement=F("food__data_measurement"),
            # Calculated macros
            energy=ExpressionWrapper(
                F("quantity") * F("food__energy"), output_field=models.IntegerField()
            ),
            fat=F("quantity") * F("food__fat"),
            saturates=F("quantity") * F("food__saturates"),
            carbohydrate=F("quantity") * F("food__carbohydrate"),
            sugars=F("quantity") * F("food__sugars"),
            fibre=F("quantity") * F("food__fibre"),
            protein=F("quantity") * F("food__protein"),
            salt=F("quantity") * F("food__salt"),
            # Meal total macros
            total_energy=Window(expression=Sum("energy"), partition_by=[F("meal")]),
            total_protein=Window(expression=Sum("protein"), partition_by=[F("meal")]),
            total_carbohydrate=Window(
                expression=Sum("carbohydrate"), partition_by=[F("meal")]
            ),
            total_fat=Window(expression=Sum("fat"), partition_by=[F("meal")]),
            total_saturates=Window(
                expression=Sum("saturates"), partition_by=[F("meal")]
            ),
            total_sugars=Window(expression=Sum("sugars"), partition_by=[F("meal")]),
            total_fibre=Window(expression=Sum("fibre"), partition_by=[F("meal")]),
            total_salt=Window(expression=Sum("salt"), partition_by=[F("meal")]),
        )

    def resolver_summary(self):
        return self.select_related("meal", "food", "food__brand").annotate(
            data_value=F("quantity") * F("food__data_value"),
            data_measurement=F("food__data_measurement"),
            # Calculated macros
            energy=ExpressionWrapper(
                F("quantity") * F("food__energy"), output_field=IntegerField()
            ),
            fat=ExpressionWrapper(
                F("quantity") * F("food__fat"), output_field=models.DecimalField()
            ),
            saturates=F("quantity") * F("food__saturates"),
            carbohydrate=F("quantity") * F("food__carbohydrate"),
            sugars=F("quantity") * F("food__sugars"),
            fibre=F("quantity") * F("food__fibre"),
            protein=F("quantity") * F("food__protein"),
            salt=F("quantity") * F("food__salt"),
            # Meal total macros
            total_meal_energy=Window(
                expression=Sum("energy"), partition_by=[F("meal")]
            ),
            total_meal_fat=Window(expression=Sum("fat"), partition_by=[F("meal")]),
            total_meal_saturates=Window(
                expression=Sum("saturates"), partition_by=[F("meal")]
            ),
            total_meal_carbohydrate=Window(
                expression=Sum("carbohydrate"), partition_by=[F("meal")]
            ),
            total_meal_sugars=Window(
                expression=Sum("sugars"), partition_by=[F("meal")]
            ),
            total_meal_fibre=Window(expression=Sum("fibre"), partition_by=[F("meal")]),
            total_meal_protein=Window(
                expression=Sum("protein"), partition_by=[F("meal")]
            ),
            total_meal_salt=Window(expression=Sum("salt"), partition_by=[F("meal")]),
        )

    def total(self):
        return self.summary().aggregate(
            total_energy=Coalesce(Sum("energy"), Value(0)),
            total_protein=Coalesce(Sum("protein"), Value(0)),
            total_carbohydrate=Coalesce(Sum("carbohydrate"), Value(0)),
            total_fat=Coalesce(Sum("fat"), Value(0)),
            total_saturates=Coalesce(Sum("saturates"), Value(0)),
            total_sugars=Coalesce(Sum("sugars"), Value(0)),
            total_fibre=Coalesce(Sum("fibre"), Value(0)),
            total_salt=Coalesce(Sum("salt"), Value(0)),
        )
