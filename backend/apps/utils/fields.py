from django import forms
from django.db.models.fields import CharField, EmailField


class LowercaseCharField(CharField):
    """Override CharField to convert to lower case before saving."""

    def to_python(self, value):
        value = super().to_python(value)
        if isinstance(value, str):
            return value.lower()


class LowercaseEmailField(EmailField):
    """Override EmailField to convert to lower case before saving."""

    def to_python(self, value):
        value = super().to_python(value)
        if isinstance(value, str):
            return value.lower()


class HTML5DateInput(forms.DateInput):
    input_type = "date"

    def __init__(self, **kwargs):
        kwargs["format"] = "%Y-%m-%d"
        super().__init__(**kwargs)
