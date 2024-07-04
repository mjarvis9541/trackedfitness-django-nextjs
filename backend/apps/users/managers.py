import datetime
from typing import Literal

from django.db import models
from django.db.models import Count
from django.utils.crypto import get_random_string
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class UserQuerySet(models.QuerySet):
    def create_user(self, name, username, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address.")
        user = self.model(
            name=name,
            username=slugify(username),
            email=self.normalize_email(email),
            is_active=kwargs.get("is_active", False),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, username, email, password=None):
        user = self.create_user(
            name=name,
            username=username,
            email=email,
            password=password,
        )
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def follower_count(self):
        return self.annotate(follower_count=Count("followers"))

    def following_count(self):
        return self.annotate(following_count=Count("following"))

    def create_jwt(
        self,
        uid: int,
        type: Literal["access", "refresh"],
    ):
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        return

    @classmethod
    def normalize_email(cls, email):
        """
        Normalize the email address by lowercasing the domain part of it.
        """
        email = email or ""
        try:
            email_name, domain_part = email.strip().rsplit("@", 1)
        except ValueError:
            pass
        else:
            email = email_name + "@" + domain_part.lower()
        return email

    def make_random_password(
        self,
        length=10,
        allowed_chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
    ):
        """
        Generate a random password with the given length and given
        allowed_chars. The default value of allowed_chars does not have "I" or
        "O" or letters and digits that look similar -- just to avoid confusion.
        """
        return get_random_string(length, allowed_chars)

    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})
