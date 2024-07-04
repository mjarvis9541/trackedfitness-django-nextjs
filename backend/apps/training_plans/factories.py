from decimal import Decimal

import factory

from apps.users.factories import UserFactory


class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "training_plans.TrainingPlan"
        django_get_or_create = ("name",)

    class Params:
        factory_user = factory.SubFactory(UserFactory)

    name = factory.Sequence(lambda x: f"5-day split {x}")
    slug = factory.Sequence(lambda x: f"5-day-split-{x}")

    description = "A typical 5-day body part split"
    duration = 8

    created_by = factory.SelfAttribute("factory_user")
    updated_by = factory.SelfAttribute("factory_user")
