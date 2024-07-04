import datetime
from decimal import Decimal

import factory

from apps.users.factories import UserFactory


class ProgressFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "progress.Progress"

    user = factory.SubFactory(UserFactory)
    date = factory.Sequence(
        lambda x: datetime.date(1970, 1, 1) + datetime.timedelta(days=x)
    )
    weight = Decimal("100.0")
    energy_burnt = 2000
    notes = factory.Sequence(lambda x: f"progress notes {x}")
