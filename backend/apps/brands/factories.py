import factory

from apps.users.factories import UserFactory


class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "brands.Brand"
        django_get_or_create = ("name",)

    class Params:
        factory_user = factory.SubFactory(UserFactory)

    name = factory.Sequence(lambda x: f"brand {x}")
    slug = factory.Sequence(lambda x: f"brand-{x}")

    created_by = factory.SelfAttribute("factory_user")
    updated_by = factory.SelfAttribute("factory_user")
