from decimal import Decimal

from django.db import models
from django.db.models import Case, ExpressionWrapper, F, When
from django.db.models.functions import Round
from django.utils.translation import gettext_lazy as _


class TargetQuerySet(models.QuerySet):
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
            # energy_per_kg=Round(F("energy") / F("weight")),
            # protein_per_kg=ExpressionWrapper(
            #     Round(F("protein") / F("weight"), 2),
            #     output_field=models.DecimalField(),
            # ),
            # carbohydrate_per_kg=ExpressionWrapper(
            #     Round(F("carbohydrate") / F("weight"), 2),
            #     output_field=models.DecimalField(),
            # ),
            # fat_per_kg=ExpressionWrapper(
            #     Round(F("fat") / F("weight"), 2),
            #     output_field=models.DecimalField(),
            # ),
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
            # percent_protein=ExpressionWrapper(
            #     Round((F("protein") * 4) / F("energy") * 100, 2),
            #     output_field=models.DecimalField(),
            # ),
            # percent_carbohydrate=ExpressionWrapper(
            #     Round((F("carbohydrate") * 4) / F("energy") * 100, 2),
            #     output_field=models.DecimalField(),
            # ),
            # percent_fat=ExpressionWrapper(
            #     Round((F("fat") * 9) / F("energy") * 100, 2),
            #     output_field=models.DecimalField(),
            # ),
        )

    def update_by_grams_per_kg(self, instance, **kwargs):
        weight = kwargs["user"]["profile"]["weight"]

        protein_per_kg = kwargs.get("protein_per_kg")
        carbohydrate_per_kg = kwargs.get("carbohydrate_per_kg")
        fat_per_kg = kwargs.get("fat_per_kg")

        protein = round(protein_per_kg * weight, 1)
        carbohydrate = round(carbohydrate_per_kg * weight, 1)
        fat = round(fat_per_kg * weight, 1)
        energy = round((protein * 4) + (carbohydrate * 4) + (fat * 9))

        instance.energy = energy
        instance.protein = protein
        instance.carbohydrate = carbohydrate
        instance.fat = fat
        instance.saturates = round(fat * Decimal("0.35"), 1)
        instance.sugars = round(energy * Decimal("0.03"), 1)
        instance.fibre = 30

        if instance.sugars > instance.carbohydrate:
            instance.sugars = instance.carbohydrate

        if instance.fibre > instance.carbohydrate:
            instance.fibre = instance.carbohydrate

        instance.salt = 6

        instance.user.profile.weight = weight
        instance.user.profile.save()
        instance.save()

        return instance
