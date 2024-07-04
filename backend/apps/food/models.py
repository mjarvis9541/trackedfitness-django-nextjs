from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.food.managers import BrandQuerySet, FoodQuerySet
from apps.utils.behaviours import Authorable, Timestampable


def brand_directory_path(instance, filename):
    return f"brands/images/{instance.id}/{filename}"


class Brand(Timestampable, Authorable):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(editable=False)
    image = models.ImageField(upload_to=brand_directory_path, blank=True, null=True)
    objects = BrandQuerySet.as_manager()

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Food(Timestampable, Authorable):
    class Measurement(models.TextChoices):
        GRAMS = "g", ("g")
        MILLILITRES = "ml", ("ml")
        SERVINGS = "srv", ("serving")

    name = models.CharField(_("name"), max_length=255)
    slug = models.SlugField(_("slug"), blank=True, max_length=255)
    brand = models.ForeignKey(
        Brand,
        verbose_name=_("brand"),
        on_delete=models.PROTECT,
        related_name="food",
    )
    new_brand = models.ForeignKey("brands.Brand", on_delete=models.PROTECT, null=True)
    # categories = models.ManyToManyField("categories.Category")
    data_value = models.IntegerField(_("data value"))
    data_measurement = models.CharField(
        _("data measurement"), max_length=3, choices=Measurement.choices
    )

    energy = models.PositiveIntegerField(_("calories (kcal)"))
    fat = models.DecimalField(
        _("fat (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    saturates = models.DecimalField(
        _("saturates (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    carbohydrate = models.DecimalField(
        _("carbohydrate (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    sugars = models.DecimalField(
        _("sugars (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    fibre = models.DecimalField(
        _("fibre (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    protein = models.DecimalField(
        _("protein (g)"),
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    salt = models.DecimalField(
        _("salt (g)"),
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.0"))],
    )

    objects = FoodQuerySet.as_manager()

    class Meta:
        verbose_name = "food"
        verbose_name_plural = "food"
        ordering = ("name",)
        # constraints = [models.UniqueConstraint(fields=['name', 'brand'], name='unique_name_brand')]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("food-detail", kwargs={"pk": self.pk})

    @property
    def sodium(self):
        return round(self.salt * 400)

    @property
    def serving(self):
        if self.data_measurement == "g" or self.data_measurement == "ml":
            return f"{round(self.data_value)}{self.data_measurement}"
        else:
            return f"{round(self.data_value)} {self.get_data_measurement_display().title()}"

    def save(self, *args, **kwargs):
        self.slug = slugify(
            f"{self.name}-{self.brand.name}-{self.data_value}{self.data_measurement}"
        )
        super().save(*args, **kwargs)
