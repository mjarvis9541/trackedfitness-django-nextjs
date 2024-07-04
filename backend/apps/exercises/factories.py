import factory

from apps.users.factories import UserFactory


class ExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "exercises.Exercise"
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda x: f"exercise {x}")
    slug = factory.Sequence(lambda x: f"exercise-{x}")

    created_by = factory.SubFactory(UserFactory)
    updated_by = factory.SubFactory(UserFactory)
