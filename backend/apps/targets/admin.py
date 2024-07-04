from django.contrib import admin

from apps.targets.models import Target


@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):
    pass
    # list_display = (
    #     "user",
    #     "energy",
    #     "protein",
    #     "carbohydrate",
    #     "fat",
    #     "saturates",
    #     "sugars",
    #     "fibre",
    #     "salt",
    #     "calculation_method",
    #     "energy_per_kg",
    #     "protein_per_kg",
    #     "carbohydrate_per_kg",
    #     "fat_per_kg",
    #     "percent_protein",
    #     "percent_carbohydrate",
    #     "percent_fat",
    #     "updated_at",
    #     "created_at",
    # )
    # fieldsets = (
    #     (
    #         None,
    #         {
    #             "fields": (
    #                 "user",
    #                 "energy",
    #                 "protein",
    #                 "carbohydrate",
    #                 "fat",
    #                 "saturates",
    #                 "sugars",
    #                 "fibre",
    #                 "salt",
    #                 "sodium",
    #                 "fitness_goal",
    #                 "weight_goal",
    #                 "calculation_method",
    #                 "energy_per_kg",
    #                 "protein_per_kg",
    #                 "carbohydrate_per_kg",
    #                 "fat_per_kg",
    #                 "percent_protein",
    #                 "percent_carbohydrate",
    #                 "percent_fat",
    #                 "calories_from_protein",
    #                 "calories_from_carbs",
    #                 "calories_from_fat",
    #             )
    #         },
    #     ),
    # )
    # readonly_fields = (
    #     "sodium",
    #     "user",
    #     # 'recommended_calories',
    #     "calories_from_protein",
    #     "calories_from_carbs",
    #     "calories_from_fat",
    #     "percent_protein",
    #     "percent_carbohydrate",
    #     "percent_fat",
    #     "energy_per_kg",
    #     "protein_per_kg",
    #     "carbohydrate_per_kg",
    #     "fat_per_kg",
    # )
