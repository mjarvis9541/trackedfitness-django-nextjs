from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.progress.managers import ProgressQuerySet
from apps.utils.behaviours import Timestampable

User = settings.AUTH_USER_MODEL


class Progress(Timestampable):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)

    weight = models.DecimalField(
        _("weight (kg)"),
        null=True,
        blank=True,
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    image = models.ImageField(
        _("image"), upload_to="images/progress_pictures", null=True, blank=True
    )

    energy_burnt = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(max_length=1000, blank=True)

    objects = ProgressQuerySet.as_manager()

    class Meta:
        ordering = ("-date",)
        verbose_name = "progress"
        verbose_name_plural = "progress"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_progress_per_user_per_day"
            )
        ]

    def __str__(self):
        return f"Progress log for {self.user.email} on {self.date}"
