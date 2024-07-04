from django.conf import settings
from django.core.validators import MaxValueValidator
from django.db import models

from apps.utils.behaviours import Authorable, Timestampable


class DietSettings(Authorable, Timestampable):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    visible_meals = models.PositiveIntegerField(
        default=6, validators=[MaxValueValidator(6)]
    )
    meal_1_name = models.CharField(max_length=25, default="Breakfast")
    meal_2_name = models.CharField(max_length=25, default="Morning Snack")
    meal_3_name = models.CharField(max_length=25, default="Lunch")
    meal_4_name = models.CharField(max_length=25, default="Afternoon Snack")
    meal_5_name = models.CharField(max_length=25, default="Dinner")
    meal_6_name = models.CharField(max_length=25, default="Evening Snack")

    class Meta:
        verbose_name_plural = "diet settings"

    def __str__(self):
        return f"Diet settings: {self.user.username}"
