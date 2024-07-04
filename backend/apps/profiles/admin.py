from django.contrib import admin

from apps.profiles.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user",
                    "age",
                    "sex",
                    "height",
                    "weight",
                    "date_of_birth",
                    "activity_level",
                    "bmi",
                    "bmr",
                    "tdee",
                    "admin_height_in",
                    "admin_height_ft_in",
                    "admin_weight_lb",
                    "admin_weight_st_lb",
                    "measurement_system",
                    "safe_weekly_rate_of_weight_loss_lower_limit_kg",
                    "safe_weekly_rate_of_weight_loss_upper_limit_kg",
                    "safe_monthly_rate_of_weight_loss_lower_limit_kg",
                    "safe_monthly_rate_of_weight_loss_upper_limit_kg",
                    "image",
                    # "following",
                )
            },
        ),
    )
    list_display = [
        "user",
        "age",
        "sex",
        "height",
        "weight",
        "date_of_birth",
        "activity_level",
    ]
    ordering = ("user",)
    readonly_fields = (
        "user",
        "age",
        "bmi",
        "bmr",
        "tdee",
        "admin_height_in",
        "admin_height_ft_in",
        "admin_weight_lb",
        "admin_weight_st_lb",
        "safe_weekly_rate_of_weight_loss_lower_limit_kg",
        "safe_weekly_rate_of_weight_loss_upper_limit_kg",
        "safe_monthly_rate_of_weight_loss_lower_limit_kg",
        "safe_monthly_rate_of_weight_loss_upper_limit_kg",
    )

    def admin_height_in(self, instance):
        return instance.height_in

    def admin_height_ft_in(self, instance):
        feet = instance.height_ft_in.get("ft")
        inches = instance.height_ft_in.get("in")
        return f"{feet}, {inches}"

    def admin_weight_lb(self, instance):
        return instance.weight_lb

    def admin_weight_st_lb(self, instance):
        stone = instance.weight_st_lb.get("st")
        pounds = instance.weight_st_lb.get("lb")
        return f"{stone}, {pounds}"

    def safe_weekly_rate_of_weight_loss_lower_limit_kg(self, instance):
        result = instance.safe_weekly_weight_loss_goal.get("lower_limit")
        return result

    def safe_weekly_rate_of_weight_loss_upper_limit_kg(self, instance):
        result = instance.safe_weekly_weight_loss_goal.get("upper_limit")
        return result

    def safe_monthly_rate_of_weight_loss_lower_limit_kg(self, instance):
        result = instance.safe_monthly_weight_loss_goal.get("lower_limit")
        return result

    def safe_monthly_rate_of_weight_loss_upper_limit_kg(self, instance):
        result = instance.safe_monthly_weight_loss_goal.get("upper_limit")
        return result

    admin_height_in.short_description = "height (in)"
    admin_height_ft_in.short_description = "height (ft, in)"
    admin_weight_lb.short_description = "weight (lb)"
    admin_weight_st_lb.short_description = "weight (st, lb)"
