import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

# Reference: https://blog.kevinastone.com/django-model-behaviors


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # editable=False,
        related_name="%(app_label)s_%(class)s_created",
        related_query_name="%(app_label)s_%(class)s_created_query",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # editable=False,
        related_name="%(app_label)s_%(class)s_updated",
        related_query_name="%(app_label)s_%(class)s_updated_query",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Timestampable(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Authorable(models.Model):
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # editable=False,
        related_name="%(app_label)s_%(class)s_created",
        related_query_name="%(app_label)s_%(class)s_created_query",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # editable=False,
        related_name="%(app_label)s_%(class)s_updated",
        related_query_name="%(app_label)s_%(class)s_updated_query",
    )

    class Meta:
        abstract = True


class Nutritionable(models.Model):
    energy = models.PositiveIntegerField(_("calories (kcal)"), default=2000)
    fat = models.DecimalField(
        _("fat (g)"),
        max_digits=4,
        decimal_places=1,
        default=70,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    saturates = models.DecimalField(
        _("saturates (g)"),
        max_digits=4,
        decimal_places=1,
        default=20,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    carbohydrate = models.DecimalField(
        _("carbohydrate (g)"),
        max_digits=4,
        decimal_places=1,
        default=260,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    sugars = models.DecimalField(
        _("sugars (g)"),
        max_digits=4,
        decimal_places=1,
        default=90,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    fibre = models.DecimalField(
        _("fibre (g)"),
        max_digits=4,
        decimal_places=1,
        default=30,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    protein = models.DecimalField(
        _("protein (g)"),
        max_digits=4,
        decimal_places=1,
        default=50,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    salt = models.DecimalField(
        _("salt (g)"),
        max_digits=5,
        decimal_places=2,
        default=6,
        validators=[MinValueValidator(Decimal("0.0"))],
    )

    class Meta:
        abstract = True
