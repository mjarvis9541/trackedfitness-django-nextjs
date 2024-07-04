import uuid

from django.db import models
from django.utils.text import slugify

from apps.utils.behaviours import Authorable, Timestampable


class MuscleGroup(Authorable, Timestampable):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(editable=False)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
