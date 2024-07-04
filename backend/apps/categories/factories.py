import factory

from apps.users.factories import UserFactory


class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "categories.Category"
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda x: f"category {x}")
    slug = factory.Sequence(lambda x: f"category-{x}")

    created_by = factory.SubFactory(UserFactory)
    updated_by = factory.SubFactory(UserFactory)
