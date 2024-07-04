from django.contrib import admin

from apps.diet.models import Diet


@admin.register(Diet)
class DietAdmin(admin.ModelAdmin):
    list_display = (
        "food",
        "brand",
        "quantity",
        "user",
        "date",
        "meal",
        "created_at",
        "updated_at",
    )
    list_filter = ("user", "date", "meal")
    readonly_fields = ("created_at", "updated_at")

    @admin.display(description="brand")
    def brand(self, obj):
        return obj.food.brand.name
