from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import F, Q
from django.utils.translation import gettext_lazy as _

from apps.followers.managers import UserFollowingQuerySet

User = settings.AUTH_USER_MODEL


class UserFollowing(models.Model):
    """
    Follower
    Connection
    User_follower
    User_following
    Allow a user to follow another user.
    """

    user = models.ForeignKey(
        User,
        related_name="following",
        on_delete=models.CASCADE,
    )
    following = models.ForeignKey(
        User,
        related_name="followers",
        on_delete=models.CASCADE,
    )
    pending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserFollowingQuerySet.as_manager()

    class Meta:
        ordering = ("id",)
        constraints = [
            models.CheckConstraint(
                name="cannot_follow_self",
                check=~Q(user=F("following")),
            ),
            models.UniqueConstraint(
                name="unique_user_following",
                fields=["user", "following"],
            ),
        ]

    def __str__(self):
        return f"{self.user} is following {self.following}"

    def clean(self):
        if self.user == self.following:
            raise ValidationError(_("Users cannot follow themselves."))


# class PendingUserFollowing(models.Model):
#     PendingUserFollower
#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#     )
#     is_following = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#     )

# Django by default names a through model SourceModel_m2mfield, so for example Pizza_toppings –
# Willem Van Onsem
# May 30, 2020 at 21:43
# User_following

# pizza > toppings > add
# pizza > add a topping > add
# Michael > add a following > add
