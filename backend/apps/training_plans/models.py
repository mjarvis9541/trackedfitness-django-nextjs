import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.utils.behaviours import Authorable, Timestampable


class TrainingPlan(Authorable, Timestampable):
    """
    A collection of workouts over a period of time.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # user = models.ForeignKey(
    #     to=settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE,
    #     related_name="routines",
    # )
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(editable=False)
    description = models.TextField(max_length=1000)
    duration = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(52),
        ],
        help_text="Duration in weeks.",
    )

    class Meta:
        ordering = ("name",)
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=["user", "name"],
        #         name="unique_routine_per_user",
        #     )
        # ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # self.slug = slugify(f"{self.user.username} {self.name}")
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class WorkoutPlan(models.Model):
    """
    A plan for the day/workout, a collection of exercise plans.
    Workout plan is a collection of exercises (for the day)
    There can be one or more workouts for a given day.
    For example AM Cardio PM Weights
    """

    class DayOfWeek(models.IntegerChoices):
        MONDAY = 1, _("Monday")
        TUESDAY = 2, _("Tuesday")
        WEDNESDAY = 3, _("Wednesday")
        THURSDAY = 4, _("Thursday")
        FRIDAY = 5, _("Friday")
        SATURDAY = 6, _("Saturday")
        SUNDAY = 7, _("Sunday")
        NA = 0, _("N/A")

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    training_plan = models.ForeignKey(
        to="training_plans.TrainingPlan",
        on_delete=models.CASCADE,
    )
    day = models.IntegerField(
        choices=DayOfWeek.choices,
        default=DayOfWeek.MONDAY,
    )
    order = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10),
        ],
        help_text="Denotes the order of the workout within the day.",
    )
    name = models.CharField(
        max_length=50,
        blank=True,
        help_text='Optional name of the workout, for example: "Chest Day", "Back Day", and so on.',
    )

    class Meta:
        ordering = (
            "training_plan",
            "day",
            "order",
        )
        constraints = [
            models.UniqueConstraint(
                fields=["training_plan", "day", "order"],
                name="unique_order_per_day_per_training_plan",
            )
        ]

    def __str__(self):
        return f"{self.training_plan}: {self.get_day_display()}: Workout {self.order}"


class ExercisePlan(models.Model):
    """
    Exercise plan is a single (exercise/movement) and it's collection of sets
    (bench press 100kg for 4 sets - is an exercise plan)
    An exercise is performing one or more movements
    A routine can have one or more workout plans
    A workout can have one or more exercise plans
    An exercise can have one or more set plans
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    workout_plan = models.ForeignKey(
        to=WorkoutPlan,
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Denotes the order of the exercise within the workout.",
    )
    movement = models.ForeignKey(
        to="training.Movement",
        on_delete=models.CASCADE,
    )
    sets = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(25),
        ],
        help_text="Denotes the number of sets within the exercise.",
    )
    reps = models.PositiveIntegerField(
        default=10,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(100),
        ],
        help_text="Denotes the number of reps within the set.",
    )
    weight = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=Decimal(0),
        validators=[
            MinValueValidator(Decimal(0)),
        ],
        help_text="Denotes the weight (kg) for the sets and reps.",
    )
    rest = models.PositiveIntegerField(
        default=60,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(600),
        ],
        help_text="Post-set rest time in seconds.",
    )

    class Meta:
        ordering = (
            "workout_plan__day",
            "order",
        )
        constraints = [
            models.UniqueConstraint(
                fields=["workout_plan", "order"],
                name="unique_order_per_workout_plan",
            )
        ]

    def __str__(self):
        return (
            f"{self.workout_plan.training_plan}:\n"
            f"{self.workout_plan.get_day_display()}:\n"
            f"Workout: {self.workout_plan.order}:\n"
            f"Exercise: {self.order}:\n"
            f"{self.movement} ({self.sets} x {self.reps})\n"
        )


class SetPlan(models.Model):
    """
    A more fine-grained set-plan for an exercise within a workout.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    exercise_plan = models.ForeignKey(
        to=ExercisePlan,
        on_delete=models.CASCADE,
    )
    reps = models.PositiveIntegerField(
        default=10,
        validators=[MaxValueValidator(100)],
        help_text="Denotes the number of reps within the set.",
    )
    weight = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=Decimal(0),
        validators=[MinValueValidator(Decimal(0))],
        help_text="Denotes the weight (kg) for the sets and reps.",
    )
