from django.contrib import admin

from apps.diet_settings.models import DietSettings


@admin.register(DietSettings)
class DietSettingsAdmin(admin.ModelAdmin):
    pass
