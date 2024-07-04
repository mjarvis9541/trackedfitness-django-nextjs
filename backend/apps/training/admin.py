from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from apps.training.models import Exercise, Movement, MuscleGroup, Set, Workout


class ExerciseInline(admin.TabularInline):
    model = Exercise


class SetInline(admin.TabularInline):
    model = Set
    readonly_fields = ("id",)

    # can_delete = False
    # verbose_name_plural = 'profile'
    # fk_name = 'user'
    fieldsets = (
        (
            None,
            {
                "fields": ("id", "weight", "reps"),
            },
        ),
    )


@admin.register(MuscleGroup)
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Movement)
class MovementAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "muscle_group_link")
    list_display_links = ("name", "muscle_group_link")
    list_filter = ("muscle_group",)
    list_select_related = ("muscle_group",)
    search_fields = ("name",)

    @admin.display(description="muscle group")
    def muscle_group_link(self, obj):
        if obj.muscle_group:
            link = reverse(
                "admin:training_musclegroup_change", args=[obj.muscle_group.id]
            )
            return format_html('<a href="{}">{}</a>', link, obj.muscle_group.name)
        else:
            return "n/a"


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    inlines = (SetInline,)
    list_display = ("id", "workout", "movement", "set_count")

    # @admin.display(ordering="Workout__user", description="User")
    # def get_user(self, obj):
    #     return obj.Workout.user


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = (
        "id",
        "user",
        "__str__",
        "time",
        "exercise_count",
        "total_set_count",
        "created_at",
    )
    inlines = (ExerciseInline,)


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = (
        "__str__",
        "get_date",
        "get_user",
        "get_workout",
        "get_exercise",
        "set_count",
        "created_at",
    )

    # list_display = (
    #     "id",
    #     "get_session_id",
    #     "get_movement",
    #     "weight",
    #     "reps",
    #     "get_set_count",
    #     "get_set_total",
    #     "exercise",
    #     "created_at",
    # )
    # list_select_related = ("get_user",)
    # search_fields = ("exercise__session__user",)

    @admin.display(ordering="exercise__session__user", description="user")
    def get_user(self, obj):
        return obj.exercise.workout.user

    @admin.display(ordering="exercise__session__date", description="date")
    def get_date(self, obj):
        # Don't need the workout date -- or do we?
        return obj.exercise.workout.date.strftime("%Y-%m-%d")

    @admin.display(ordering="exercise__session", description="workout")
    def get_workout(self, obj):
        return obj.exercise.workout

    @admin.display(description="exercise", ordering="exercise")
    def get_exercise(self, obj):
        return obj.exercise

    # @admin.display(description="sets")
    # def get_set_count(self, obj):
    #     return obj.exercise.set_count

    # @admin.display(description="total sets")
    # def get_set_total(self, obj):
    #     return obj.exercise.workout.total_set_count

    # @admin.display(ordering="Workout__user", description="User")
    # def get_user(self, obj):
    #     return obj.Workout.user
