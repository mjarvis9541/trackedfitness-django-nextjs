from django.contrib import admin

from apps.meals.models import Item, Meal


class ItemInline(admin.StackedInline):
    model = Item
    extra = 0


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "description")
    inlines = (ItemInline,)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("meal", "food", "quantity")
