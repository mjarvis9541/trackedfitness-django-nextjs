import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Case, ExpressionWrapper, F, When
from django.db.models.functions import Round
from django.utils.translation import gettext_lazy as _

from apps.utils.dates import get_week_range

User = get_user_model()


class DailyDietTargetQuerySet(models.QuerySet):
    def get_username(self):
        return self.annotate(username=F("user__username"))

    def get_grams_per_kg(self, **kwargs):
        """Handles division error when weight is 0."""
        return self.annotate(
            weight=F("user__profile__weight"),
            energy_per_kg=Case(
                When(weight=0, then=Decimal("0.0")),
                default=Round(F("energy") / F("weight")),
            ),
            protein_per_kg=Case(
                When(weight=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round(F("protein") / F("weight"), 2),
                    output_field=models.DecimalField(),
                ),
            ),
            carbohydrate_per_kg=Case(
                When(weight=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round(F("carbohydrate") / F("weight"), 2),
                    output_field=models.DecimalField(),
                ),
            ),
            fat_per_kg=Case(
                When(weight=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round(F("fat") / F("weight"), 2),
                    output_field=models.DecimalField(),
                ),
            ),
        )

    def get_percentage_of_calories(self, **kwargs):
        """Handles division error when calories are 0."""
        return self.annotate(
            percent_protein=Case(
                When(energy=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round((F("protein") * 4) / F("energy") * 100, 2),
                    output_field=models.DecimalField(),
                ),
            ),
            percent_carbohydrate=Case(
                When(energy=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round((F("carbohydrate") * 4) / F("energy") * 100, 2),
                    output_field=models.DecimalField(),
                ),
            ),
            percent_fat=Case(
                When(energy=0, then=Decimal("0.0")),
                default=ExpressionWrapper(
                    Round((F("fat") * 9) / F("energy") * 100, 2),
                    output_field=models.DecimalField(),
                ),
            ),
        )

    def create_by_grams_per_kg(self, **kwargs):
        user = kwargs["user"]
        date = kwargs["date"]
        weight = kwargs["weight"]

        protein_per_kg = kwargs.get("protein_per_kg")
        carbohydrate_per_kg = kwargs.get("carbohydrate_per_kg")
        fat_per_kg = kwargs.get("fat_per_kg")

        protein = round(protein_per_kg * weight, 1)
        carbohydrate = round(carbohydrate_per_kg * weight, 1)
        fat = round(fat_per_kg * weight, 1)
        energy = round((protein * 4) + (carbohydrate * 4) + (fat * 9))

        saturates = round(fat * Decimal("0.35"), 1)
        sugars = round(energy * Decimal("0.03"), 1)
        fibre = 30
        salt = 6

        # corrections
        if sugars > carbohydrate:
            sugars = carbohydrate
        if fibre > carbohydrate:
            fibre = carbohydrate

        obj = self.create(
            user=user,
            date=date,
            energy=energy,
            protein=protein,
            carbohydrate=carbohydrate,
            fat=fat,
            saturates=saturates,
            sugars=sugars,
            fibre=fibre,
            salt=salt,
        )
        return obj

    def update_create_from_date_list(self, **kwargs):
        user = kwargs["user"]
        date_list = kwargs["date_list"]
        weight = kwargs["weight"]

        protein_per_kg = kwargs.get("protein_per_kg")
        carbohydrate_per_kg = kwargs.get("carbohydrate_per_kg")
        fat_per_kg = kwargs.get("fat_per_kg")

        protein = round(protein_per_kg * weight, 1)
        carbohydrate = round(carbohydrate_per_kg * weight, 1)
        fat = round(fat_per_kg * weight, 1)
        energy = round((protein * 4) + (carbohydrate * 4) + (fat * 9))

        saturates = round(fat * Decimal("0.35"), 1)
        sugars = round(energy * Decimal("0.03"), 1)
        fibre = 30
        salt = 6

        # corrections
        if sugars > carbohydrate:
            sugars = carbohydrate
        if fibre > carbohydrate:
            fibre = carbohydrate

        obj_list = []
        for date in date_list:
            new_obj, _ = self.update_or_create(
                user_id=user.id,
                date=date,
                defaults={
                    "energy": energy,
                    "protein": protein,
                    "carbohydrate": carbohydrate,
                    "fat": fat,
                    "saturates": saturates,
                    "sugars": sugars,
                    "fibre": fibre,
                    "salt": salt,
                },
            )
            obj_list.append(new_obj)
        return obj_list

    def update_create_from_previous_week(self, **kwargs):
        obj_list = []
        for obj in kwargs["queryset"].values():
            new_obj, _ = self.update_or_create(
                user_id=obj["user_id"],
                date=obj["date"] + datetime.timedelta(days=7),
                defaults={
                    "energy": obj["energy"],
                    "protein": obj["protein"],
                    "carbohydrate": obj["carbohydrate"],
                    "fat": obj["fat"],
                    "saturates": obj["saturates"],
                    "sugars": obj["sugars"],
                    "fibre": obj["fibre"],
                    "salt": obj["salt"],
                },
            )
            obj_list.append(new_obj)
        return obj_list

    # def get_weight(self):
    #     return self.annotate(
    #         latest_weight_until_date=Subquery(
    #             Progress.objects.filter(
    #                 user_id=OuterRef("user_id"),
    #                 weight__isnull=False,
    #                 date__lte=OuterRef("date"),
    #             )
    #             .order_by("-date")
    #             .values("weight")[:1]
    #         ),
    #         latest_weight=Subquery(
    #             Progress.objects.filter(
    #                 user_id=OuterRef("user_id"),
    #                 weight__isnull=False,
    #             )
    #             .order_by("-date")
    #             .values("weight")[:1]
    #         ),
    #     )
