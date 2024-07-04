from decimal import Decimal

import factory

from apps.users.factories import UserFactory


class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "food.Brand"
        django_get_or_create = ("name",)

    class Params:
        factory_user = factory.SubFactory(UserFactory)

    name = factory.Sequence(lambda x: f"brand {x}")
    slug = factory.Sequence(lambda x: f"brand-{x}")

    created_by = factory.SelfAttribute("factory_user")
    updated_by = factory.SelfAttribute("factory_user")


class FoodFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "food.Food"

    class Params:
        factory_user = factory.SubFactory(UserFactory)

    name = factory.Sequence(lambda x: f"chicken breast {x}")
    slug = factory.Sequence(lambda x: f"chicken-breast-{x}")
    brand = factory.SubFactory(BrandFactory)

    data_value = 100
    data_measurement = "g"

    energy = 106
    fat = Decimal("1.1")
    saturates = Decimal("0.3")
    carbohydrate = Decimal("0.0")
    sugars = Decimal("0.0")
    fibre = Decimal("0.0")
    protein = Decimal("24.0")
    salt = Decimal("0.15")

    created_by = factory.SelfAttribute("factory_user")
    updated_by = factory.SelfAttribute("factory_user")
