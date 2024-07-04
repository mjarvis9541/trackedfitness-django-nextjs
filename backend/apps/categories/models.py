from django.db import models
from django.utils.text import slugify

from apps.utils.behaviours import Authorable, Timestampable


class Category(Authorable, Timestampable):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(editable=False, unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
