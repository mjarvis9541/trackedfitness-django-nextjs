import datetime
from decimal import Decimal

import factory

from apps.users.factories import UserFactory


class DailyDietTargetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "diet_targets.DailyDietTarget"

    user = factory.SubFactory(UserFactory)
    date = factory.Sequence(
        lambda x: datetime.date(1970, 1, 1) + datetime.timedelta(days=x)
    )
    energy = 4900
    protein = Decimal("250.0")
    carbohydrate = Decimal("750.0")
    fat = Decimal("100.0")
    saturates = Decimal("35.0")
    sugars = Decimal("147.0")
    fibre = Decimal("30.0")
    salt = Decimal("6.0")
