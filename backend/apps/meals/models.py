from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.urls.base import reverse
from django.utils.translation import gettext_lazy as _

from apps.food.models import Food
from apps.meals.managers import ItemQuerySet, MealQuerySet
from apps.utils.behaviours import Authorable, Timestampable

User = settings.AUTH_USER_MODEL


def validate_item_limit_per_meal(obj):
    item_limit = 25
    meal_item_count = obj.meal.items.count()
    if meal_item_count >= item_limit:
        raise ValidationError(
            f"You can only add {item_limit} food items to each saved meal."
        )


class Meal(Timestampable, Authorable):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")

    name = models.CharField(_("meal name"), max_length=225)
    description = models.TextField(
        _("meal description"),
        max_length=1000,
        null=True,
        blank=True,
        help_text="Optional.",
    )

    objects = MealQuerySet.as_manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"], name="unique_meal_name_per_user"
            )
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("meals:detail", kwargs={"pk": self.pk})


class Item(Timestampable, Authorable):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name="items")
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name="items")
    quantity = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.0"))],
    )

    objects = ItemQuerySet.as_manager()

    class Meta:
        ordering = ("updated_at",)

    def __str__(self):
        return self.food.name

    def get_absolute_url(self):
        return reverse("meals:detail", kwargs={"pk": self.meal.pk})

    def clean(self):
        # Does not work in api requests.
        return validate_item_limit_per_meal(self)

    @property
    def food_name(self):
        # When querying from Item, use:
        # .select_related("food")
        # When querying from Meal, use:
        # .prefetch_related("food__brand")
        return self.food.name

    @property
    def brand_id(self):
        # When querying from Item, use:
        # .select_related("food__brand")
        # When querying from Meal, use:
        # .prefetech_related("items__food__brand")
        return self.food.brand.id

    @property
    def brand_name(self):
        # When querying from Item, use:
        # .select_related("food__brand")
        # When querying from Meal, use:
        # .prefetech_related("items__food__brand")
        return self.food.brand.name

    @property
    def data_value(self):
        return self.quantity * self.food.data_value

    @property
    def data_measurement(self):
        return self.food.data_measurement

    @property
    def quantity_input(self):
        # TODO: Potentially could just use:
        # return self.quantity * self.food.data_value
        if self.food.data_measurement == "srv":
            return self.quantity
        else:
            return self.quantity * self.food.data_value

    @property
    def energy(self):
        return self.quantity * self.food.energy

    @property
    def fat(self):
        return self.quantity * self.food.fat

    @property
    def saturates(self):
        return self.quantity * self.food.saturates

    @property
    def carbohydrate(self):
        return self.quantity * self.food.carbohydrate

    @property
    def sugars(self):
        return self.quantity * self.food.sugars

    @property
    def fibre(self):
        return self.quantity * self.food.fibre

    @property
    def protein(self):
        return self.quantity * self.food.protein

    @property
    def salt(self):
        return self.quantity * self.food.salt
