import datetime
import time
import uuid

import jwt
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _

from apps.profiles.models import Profile
from apps.targets.models import Target
from apps.users.managers import UserQuerySet
from apps.users.validators import UsernameValidator


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[UsernameValidator()],
        error_messages={"unique": _("This username is unavailable.")},
    )

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(
        default=False,
        help_text="Has the user verified their account via email after registering.",
    )
    is_private = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserQuerySet.as_manager()

    # followings
    # add a following / add a topping / add a tag
    # add a tag / add a tag
    # help_text="Follow a user. User.connections.add(other_user)",
    connections = models.ManyToManyField(
        "self",
        blank=True,
        through="followers.UserFollowing",
        symmetrical=False,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "name"]

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self):
        return self.username

    @property
    def initial(self):
        if self.name:
            return self.name[0].upper()

    @property
    def initials(self):
        if self.name:
            return self.name[0].upper()

    @property
    def uid(self):
        return urlsafe_base64_encode(force_bytes(self.pk))

    def send_activation_email(self):
        token = default_token_generator.make_token(self)
        body = render_to_string(
            "users/emails/activate_account.html",
            {
                "user": self,
                "domain": settings.FRONTEND_DOMAIN,
                "site_name": "Trackedfitness",
                "uid": self.uid,
                "token": token,
            },
        )
        email = EmailMessage(subject="Activate account", body=body, to=[self.email])
        email.send()

    def send_password_reset_email(self):
        token = default_token_generator.make_token(self)
        body = render_to_string(
            "users/emails/password_reset.html",
            {
                "user": self,
                "domain": settings.FRONTEND_DOMAIN,
                "site_name": "Trackedfitness",
                "uid": self.uid,
                "token": token,
            },
        )
        email = EmailMessage(subject="Password Reset", body=body, to=[self.email])
        email.send()

    def send_email_change_email(self):
        token = default_token_generator.make_token(self)
        body = render_to_string(
            "users/emails/change_email.html",
            {
                "user": self,
                "domain": settings.FRONTEND_DOMAIN,
                "site_name": "Trackedfitness",
                "uid": self.uid,
                "token": token,
            },
        )
        email = EmailMessage(subject="Change Email", body=body, to=[self.email])
        email.send()

    def create_token(self, token_type):
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        if token_type == "access":
            token_exp = now + datetime.timedelta(minutes=120)
        elif token_type == "refresh":
            token_exp = now + datetime.timedelta(days=5)
        domain = "trackedfitness.com"
        jti = uuid.uuid4().hex
        iat = round(time.mktime(now.timetuple()))
        exp = round(time.mktime(token_exp.timetuple()))
        payload = {
            "iss": domain,
            "iat": iat,
            "exp": exp,
            "jti": jti,
            "uid": self.id,
            "token_type": token_type,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return token

    @staticmethod
    def set_refresh_token(response):
        """
        Takes an HTTP response object and sets refresh token to a secure cookie.
        """
        response.set_cookie(
            key="refresh_token",
            value=response.data.pop("refresh"),
            max_age=432000,  # 5 days
            secure=True,
            httponly=True,
            samesite="none",
        )
        return response

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not Profile.objects.filter(user=self).exists():
            Profile.objects.create(user=self)
        if not Target.objects.filter(user=self).exists():
            Target.objects.create(user=self)
