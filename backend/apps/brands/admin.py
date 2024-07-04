from django.contrib import admin

from apps.brands.models import Brand


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
