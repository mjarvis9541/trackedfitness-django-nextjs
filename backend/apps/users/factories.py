import factory


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "users.User"
        django_get_or_create = ("email",)

    name = "test user"
    username = factory.Sequence(lambda x: f"user{x}")
    email = factory.Sequence(lambda x: f"user{x}@example.com")
