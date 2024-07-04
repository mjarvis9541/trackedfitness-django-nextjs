from decimal import Decimal

import factory
from django.utils import timezone

from apps.food.factories import FoodFactory
from apps.users.factories import UserFactory


class DietFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "diet.Diet"

    class Params:
        factory_user = factory.SubFactory(UserFactory)

    user = factory.SelfAttribute("factory_user")
    date = timezone.now().date()
    meal = 1
    food = factory.SubFactory(FoodFactory)
    quantity = Decimal("2.0")
