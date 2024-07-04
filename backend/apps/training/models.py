from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.utils.behaviours import Timestampable

User = settings.AUTH_USER_MODEL


class MuscleGroup(Timestampable):
    """Chest, back, shoulders, etc."""

    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "muscle group"
        verbose_name_plural = "muscle groups"
        ordering = ("name",)


class Movement(Timestampable):
    """Bench press, squat, deadlift, running, jogging, walking, etc."""

    name = models.CharField(max_length=255)
    muscle_group = models.ForeignKey(
        MuscleGroup, on_delete=models.SET_NULL, blank=True, null=True
    )

    class Meta:
        verbose_name = "movement"
        verbose_name_plural = "movements"
        ordering = ("name",)

    def __str__(self):
        return self.name


class Workout(Timestampable):
    """A collection of one or more exercises on a given day."""

    # calendar = models.ForeignKey("calendars.Calendar", on_delete=models.CASCADE, related_name="workouts")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    duration = models.DurationField(
        blank=True, null=True, help_text="total duration of the workout."
    )
    notes = models.TextField("workout notes", max_length=2500, blank=True, null=True)
    # Chest day / # Upper / # Lower / # Cardio / # Intervals
    # category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default=0)

    class Meta:
        verbose_name = "workout"
        verbose_name_plural = "workouts"
        ordering = ("-date", "-id")

    def __str__(self):
        return f"{self.user} - {self.date} - {self.time.strftime('%H:%M')}"

    @property
    def exercise_count(self):
        """total sets per exercise."""
        return self.exercises.count()

    @property
    def total_set_count(self):
        """total sets per workout."""
        total = 0
        for x in self.exercises.all():
            total += x.set_count
        return total


class Exercise(Timestampable):
    """
    A collection of one or more movements and sets performed during a workout on a given day.
    instance.
    Each workout can contain one or more exercises.
    """

    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        verbose_name="workout",
        related_name="exercises",
    )
    movement = models.ForeignKey(
        Movement, on_delete=models.CASCADE, related_name="exercises"
    )
    duration = models.DurationField(
        blank=True, null=True, help_text="total duration the of exercise."
    )
    notes = models.TextField("exercise notes", max_length=2500, blank=True, null=True)
    # number = models.IntegerField(blank=True, null=True)
    # start = models.TimeField(blank=True, null=True)  # auto-added when user adds their first set?
    # distance?

    class Meta:
        verbose_name = "exercise"
        verbose_name_plural = "exercises"
        ordering = ("id",)
        # ordering = ("workout", "movement")
        # Restricting one unique movement per workout, you add additional
        # sets to the workout to log additional stats.
        constraints = [
            models.UniqueConstraint(
                fields=["workout", "movement"], name="unique_movement_per_workout"
            )
        ]

    def __str__(self):
        return f"{self.movement} ({self.set_count} sets) - ({self.workout}) "

    @property
    def set_count(self):
        """total sets per exercise."""
        return self.sets.count()


class Set(Timestampable):
    """
    Statistics/data for an Exercise instance.
    Each Exercise can have multiple sets.
    """

    exercise = models.ForeignKey(
        Exercise, on_delete=models.CASCADE, related_name="sets"
    )
    number = models.IntegerField(editable=False, null=True)
    # Anaerobic training specific
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    reps = models.IntegerField(blank=True, null=True)
    rest = models.DurationField(
        "rest (seconds)",
        blank=True,
        null=True,
        help_text="post set rest time in seconds.",
    )
    # Aerobic training specific:
    level = models.IntegerField(blank=True, null=True)
    speed = models.IntegerField("speed (kph)", blank=True, null=True)
    distance = models.IntegerField("distance (km)", blank=True, null=True)
    # Timings
    duration = models.DurationField(
        blank=True, null=True, help_text="total duration of the set."
    )
    # difficulty = models.CharField(max_length=255, blank=True)  # Easy, medium, hard
    notes = models.TextField("set notes", max_length=2500, blank=True, null=True)
    # objects = SetQuerySet.as_manager()

    class Meta:
        ordering = ("created_at",)
        # ordering = ("exercise", "exercise__session__user", "exercise__session__date", "created")

    def __str__(self):
        # user - date -
        # if we move to uuid's - created is the only way to order sets with implicitly specifying
        return (
            f"Set {self.id} - {self.exercise.movement} for {self.exercise.workout.user}"
        )

    @property
    def set_count(self):
        """total sets per exercise."""
        return self.exercise.set_count

    # @property
    # def last_set_number(self):
    #     """Assigned number of the last set of the exercise."""
    #     return self.exercise.sets.last().number

    # def save(self, *args, **kwargs):

    #     if not self.number:`
    #         num = 0
    #         for obj in self.exercise.sets.all():`
    #             print(obj)
    #             num += 1
    #             obj.number = num
    #             obj.save()
    #         num += 1
    #         self.number = num

    #     super().save(*args, **kwargs)
