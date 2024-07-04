from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.diet_targets.managers import DailyDietTargetQuerySet
from apps.utils.behaviours import Timestampable

User = settings.AUTH_USER_MODEL


class DailyDietTarget(Timestampable):
    """Model to store user calorie and macronutrient targets per day."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    date = models.DateField(default=timezone.now)
    # weight = models.DecimalField(
    #     _("weight (kg)"),
    #     max_digits=5,
    #     decimal_places=2,
    #     null=True,
    #     blank=True,
    #     validators=[MinValueValidator(Decimal("0.0"))],
    #     help_text="Weight targets are based on."
    # )

    energy = models.PositiveIntegerField(_("calories (kcal)"), default=2000)
    fat = models.DecimalField(
        _("fat (g)"),
        max_digits=4,
        decimal_places=1,
        default=70,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    saturates = models.DecimalField(
        _("saturates (g)"),
        max_digits=4,
        decimal_places=1,
        default=20,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    carbohydrate = models.DecimalField(
        _("carbohydrate (g)"),
        max_digits=5,
        decimal_places=1,
        default=260,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    sugars = models.DecimalField(
        _("sugars (g)"),
        max_digits=4,
        decimal_places=1,
        default=90,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    fibre = models.DecimalField(
        _("fibre (g)"),
        max_digits=4,
        decimal_places=1,
        default=30,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    protein = models.DecimalField(
        _("protein (g)"),
        max_digits=4,
        decimal_places=1,
        default=50,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    salt = models.DecimalField(
        _("salt (g)"),
        max_digits=5,
        decimal_places=2,
        default=6,
        validators=[MinValueValidator(Decimal("0.0"))],
    )

    objects = DailyDietTargetQuerySet.as_manager()

    class Meta:
        ordering = ["date"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_target_per_user_per_date"
            )
        ]

    def __str__(self):
        return (
            f"daily diet target: {self.user.username}, {self.date}, {self.energy} kcal"
        )

    def update_by_grams_per_kg(self, **kwargs):
        weight = kwargs["weight"]

        protein_per_kg = kwargs.get("protein_per_kg")
        carbohydrate_per_kg = kwargs.get("carbohydrate_per_kg")
        fat_per_kg = kwargs.get("fat_per_kg")

        protein = round(protein_per_kg * weight, 1)
        carbohydrate = round(carbohydrate_per_kg * weight, 1)
        fat = round(fat_per_kg * weight, 1)
        energy = round((protein * 4) + (carbohydrate * 4) + (fat * 9))

        self.energy = energy
        self.protein = protein
        self.carbohydrate = carbohydrate
        self.fat = fat
        self.saturates = round(fat * Decimal("0.35"), 1)
        self.sugars = round(energy * Decimal("0.03"), 1)
        self.fibre = 30

        if self.sugars > self.carbohydrate:
            self.sugars = self.carbohydrate

        if self.fibre > self.carbohydrate:
            self.fibre = self.carbohydrate

        self.salt = 6
        # self.calculation_method = self.CalculationMethod.GRAMS
        self.user.profile.weight = weight
        self.user.profile.save()
        self.save()
