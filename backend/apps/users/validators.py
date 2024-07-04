from django.core import validators
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class UsernameValidator(validators.RegexValidator):
    regex = r"^[A-Za-z][A-Za-z0-9_]{2,29}$"
    message = _(
        "Usernames must begin with a letter. "
        "Can only contain letters, numbers and underscores. "
        "Must be between 3 and 30 characters in length."
    )
