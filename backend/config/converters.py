import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()


class UsernameConverter:
    regex = "[\w._]{3,30}"

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value


class UserConverter:
    # regex = "[\w.@+-]{5,30}"
    regex = "[\w._]{3,30}"

    def to_python(self, value):
        return get_object_or_404(User, username=value)

    def to_url(self, obj):
        return obj.username


class DateConverter:
    regex = "[0-9]{4}-[0-9]{2}-[0-9]{2}"

    def to_python(self, value):
        return datetime.date.fromisoformat(value)

    def to_url(self, value):
        return datetime.date.isoformat(value)
