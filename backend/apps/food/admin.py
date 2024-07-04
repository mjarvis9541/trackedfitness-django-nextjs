from django.contrib import admin

from apps.food.models import Brand, Food


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    )
    readonly_fields = (
        "slug",
        "updated_by",
        "created_by",
        "updated_at",
        "created_at",
    )
    search_fields = ("name",)
    list_select_related = ("created_by", "updated_by")


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "brand",
        "serving",
        "slug",
        "energy",
        "fat",
        "saturates",
        "carbohydrate",
        "sugars",
        "fibre",
        "protein",
        "salt",
        "updated_at",
        "created_at",
    )
    readonly_fields = (
        "slug",
        "updated_by",
        "updated_at",
        "created_by",
        "created_at",
    )
    list_filter = ("data_measurement", "brand")
    search_fields = ("name", "brand__name")
