from django.contrib import admin

from apps.exercises.models import Exercise


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
        "slug",
    )
    readonly_fields = ("slug", "created_at", "updated_at")
