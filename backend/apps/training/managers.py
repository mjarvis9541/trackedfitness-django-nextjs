from django.db import models
from django.db.models import (
    Avg,
    Case,
    ExpressionWrapper,
    F,
    Func,
    Max,
    Min,
    RowRange,
    Sum,
    Value,
    ValueRange,
    When,
    Window,
)
from django.db.models.functions import Coalesce, FirstValue


class WorkoutQuerySet(models.QuerySet):
    pass


class ExerciseQuerySet(models.QuerySet):
    pass


class SetQuerySet(models.QuerySet):
    pass
