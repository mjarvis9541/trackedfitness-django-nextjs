from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from apps.diet.managers import DietQuerySet
from apps.food.models import Food
from apps.utils.behaviours import Timestampable

User = settings.AUTH_USER_MODEL


class Diet(Timestampable):
    class Meal(models.IntegerChoices):
        MEAL1 = 1, ("Breakfast")
        MEAL2 = 2, ("Morning Snack")
        MEAL3 = 3, ("Lunch")
        MEAL4 = 4, ("Afternoon Snack")
        MEAL5 = 5, ("Dinner")
        MEAL6 = 6, ("Evening Snack")

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="diet_entries",
    )
    date = models.DateField(default=timezone.now)
    meal = models.IntegerField(choices=Meal.choices, default=Meal.MEAL1)
    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE,
        related_name="diet_entries",
    )
    quantity = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.0"))],
    )

    objects = DietQuerySet.as_manager()

    class Meta:
        ordering = ("updated_at",)

    def __str__(self):
        return f"{self.user} {self.food}"

    @property
    def quantity_input(self):
        if self.food.data_measurement == "srv":
            return self.quantity
        else:
            return self.quantity * 100
