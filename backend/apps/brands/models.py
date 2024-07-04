import uuid

from django.db import models
from django.utils.text import slugify

from apps.brands.managers import BrandQuerySet
from apps.utils.behaviours import Authorable, Timestampable


def brand_directory_path(instance, filename):
    return f"brands/image/{instance.name}/{filename}"


class Brand(Timestampable, Authorable):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(editable=False)

    image = models.ImageField(upload_to=brand_directory_path, blank=True, null=True)

    objects = BrandQuerySet.as_manager()

    class Meta:
        ordering = ("name",)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
