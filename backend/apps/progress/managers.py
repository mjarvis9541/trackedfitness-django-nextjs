from django.conf import settings
from django.db import models
from django.db.models import Avg, F, Sum, Window
from django.db.models.functions import ExtractMonth, ExtractWeek

User = settings.AUTH_USER_MODEL


class ProgressQuerySet(models.QuerySet):
    def get_username(self):
        return self.annotate(username=F("user__username"))

    def latest_weight_for_user(self, user_id):
        return (
            self.filter(user_id=user_id)
            .order_by("-date")
            .values("weight")
            .first()
            .get("weight")
        )

    def week_avg_weight(self):
        return self.annotate(
            week_avg_weight=Window(
                expression=Avg("weight"),
                partition_by=[F("user"), ExtractWeek(F("date"))],
                # order_by=[F("date").asc()],
                # frame=RowRange(start=-90, end=0),
            ),
        )

    def month_avg_weight(self):
        return self.annotate(
            month=ExtractMonth(F("date")),
            month_avg_weight=Window(
                expression=Avg("weight"),
                partition_by=[F("user"), ExtractMonth(F("date"))],
                # order_by=[F("date").asc()],
                # frame=RowRange(start=-90, end=0),
            ),
        )

    def week_avg_energy_burnt(self):
        return self.annotate(
            week_avg_energy_burnt=Window(
                expression=Avg("energy_burnt"),
                partition_by=[F("user"), ExtractWeek(F("date"))],
                # order_by=[F("date").asc()],
                # frame=RowRange(start=-90, end=0),
            ),
        )

    def week_total_energy_burnt(self):
        return self.annotate(
            week_total_energy_burnt=Window(
                expression=Sum("energy_burnt"),
                partition_by=[F("user"), ExtractWeek(F("date"))],
            )
        )
