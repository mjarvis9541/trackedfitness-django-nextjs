from django.contrib import admin

from apps.diet_targets.models import DailyDietTarget


@admin.register(DailyDietTarget)
class DailyDietTargetsTargetsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "date",
        "energy",
        "protein",
        "carbohydrate",
        "fat",
        "saturates",
        "sugars",
        "fibre",
        "salt",
        "created_at",
        "updated_at",
    )
    readonly_fields = ("updated_at", "created_at")
