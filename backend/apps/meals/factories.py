from decimal import Decimal

import factory

from apps.food.factories import FoodFactory
from apps.users.factories import UserFactory


class MealFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "meals.Meal"

    user = factory.SubFactory(UserFactory)
    name = factory.Sequence(lambda x: f"meal {x}")

    # created_by = factory.SubFactory(UserFactory)
    # updated_by = factory.SubFactory(UserFactory)


class ItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "meals.Item"

    meal = factory.SubFactory(MealFactory)
    food = factory.SubFactory(FoodFactory)
    quantity = Decimal("2.0")

    # created_by = factory.SubFactory(UserFactory)
    # updated_by = factory.SubFactory(UserFactory)
