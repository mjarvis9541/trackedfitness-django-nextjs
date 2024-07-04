from django.db import models
from django.db.models import F


class UserFollowingQuerySet(models.QuerySet):
    def user_username(self):
        return self.annotate(user_username=F("user__username"))

    def following_username(self):
        return self.annotate(following_username=F("following__username"))
