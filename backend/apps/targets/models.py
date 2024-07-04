from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.targets.managers import TargetQuerySet
from apps.utils.behaviours import Timestampable

User = settings.AUTH_USER_MODEL


class Target(Timestampable):
    """
    Data model to store dietary targets for the user. These targets default to
    the NHS guidelines. Reference intake for adults.
    """

    class CalculationMethod(models.TextChoices):
        CUSTOM = "CUS", _("Custom")
        DEFAULT = "DEF", _("Default")
        GRAMS = "GRA", _("Grams per kg")
        PERCENTAGE = "PER", _("Percentage")
        RECOMMENDED = "REC", _("Recommended")

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )

    # Rename to calculation - move to settings
    calculation_method = models.CharField(
        _("calculation method"),
        max_length=3,
        choices=CalculationMethod.choices,
        default=CalculationMethod.DEFAULT,
        help_text=_(
            "Calculation method used to set your calorie and macronutrient targets."
        ),
    )

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

    objects = TargetQuerySet.as_manager()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"target: {self.user.username}, {self.energy} kcal"

    def update_by_grams_per_kg(self, **kwargs):
        weight = kwargs["user"]["profile"]["weight"]

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
        self.salt = 6

        # corrections
        if self.sugars > self.carbohydrate:
            self.sugars = self.carbohydrate

        if self.fibre > self.carbohydrate:
            self.fibre = self.carbohydrate

        self.calculation_method = self.CalculationMethod.GRAMS
        self.user.profile.weight = weight
        self.user.profile.save()
        self.save()

    def update_from_profile(self):
        goal = self.user.profile.goal
        if goal == "LW":
            calorie_modifier = 0.8
            percent_protein = 40
            percent_carbohydrate = 40
            percent_fat = 20
        if goal == "GW":
            calorie_modifier = 1.1
            percent_protein = 25
            percent_carbohydrate = 55
            percent_fat = 20
        if goal == "MW":
            calorie_modifier = 1
            percent_protein = 25
            percent_carbohydrate = 55
            percent_fat = 20

        # Calculate targets:
        recommended_calories = round(self.user.profile.tdee * calorie_modifier)
        self.energy = recommended_calories
        self.protein = round(recommended_calories * (percent_protein / 100) / 4, 1)
        self.carbohydrate = round(
            recommended_calories * (percent_carbohydrate / 100) / 4, 1
        )
        self.fat = round(recommended_calories * (percent_fat / 100) / 9, 1)
        self.saturates = round(self.fat * 0.35, 1)
        self.sugars = round(self.energy * 0.03, 1)
        # self.saturates = round(self.fat * Decimal("0.35"), 1)
        # self.sugars = round(self.energy * Decimal("0.03"), 1)
        self.fibre = 30
        self.salt = 6

        # corrections
        if self.sugars > self.carbohydrate:
            self.sugars = self.carbohydrate

        if self.fibre > self.carbohydrate:
            self.fibre = self.carbohydrate

        self.calculation_method = self.CalculationMethod.DEFAULT
        self.save()
