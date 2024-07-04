from django.contrib import admin

from apps.muscle_groups.models import MuscleGroup


@admin.register(MuscleGroup)
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
        "slug",
    )
    readonly_fields = ("slug", "created_at", "updated_at")
