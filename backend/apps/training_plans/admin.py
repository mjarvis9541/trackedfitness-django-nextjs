from django.contrib import admin

from apps.training_plans.models import ExercisePlan, SetPlan, TrainingPlan, WorkoutPlan


@admin.register(TrainingPlan)
class TrainingPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "duration",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
        "slug",
    )
    readonly_fields = ("slug", "created_at", "updated_at")


@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "training_plan",
        "get_day_display",
        "order",
        "name",
    )


@admin.register(ExercisePlan)
class ExercisePlanAdmin(admin.ModelAdmin):
    pass


# @admin.register(SetPlan)
# class SetPlanAdmin(admin.ModelAdmin):
#     pass
