import datetime
from decimal import Decimal

from django.db import models
from django.db.models import OuterRef, Subquery

from apps.progress.models import Progress


def calculate_age(date_of_birth):
    today = datetime.date.today()
    return (
        today.year
        - date_of_birth.year
        - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    )


def calculate_bmi(height, weight):
    # Calculates Body Mass Index
    result = round(weight / Decimal((height / 100) ** 2))
    return result


def calculate_bmr(age, height, sex, weight):
    # Calculates Basal Metabolic Rate
    if sex == "M":
        value = 5
    elif sex == "F":
        value = -161
    result = round((10 * weight) + (Decimal("6.25") * height) - (5 * age) + value)
    return result


def calculate_tdee(activity_level, bmr):
    # Calculates Total Daily Energy Expenditure
    if activity_level == "SD":
        value = 1.2
    if activity_level == "LA":
        value = 1.375
    if activity_level == "MA":
        value = 1.55
    if activity_level == "VA":
        value = 1.725
    if activity_level == "EA":
        value = 1.9
    result = round(bmr * value)
    return result


class ProfileQuerySet(models.QuerySet):
    def update_profile_target(self, instance):
        age = calculate_age(
            date_of_birth=instance.date_of_birth,
        )
        bmr = calculate_bmr(
            age=age,
            height=instance.height,
            sex=instance.sex,
            weight=instance.weight,
        )
        tdee = calculate_tdee(
            activity_level=instance.activity_level,
            bmr=bmr,
        )
        goal = instance.goal
        if goal == "LW":
            calorie_modifier = 0.8
            percent_protein = 40
            percent_carbohydrate = 40
            percent_fat = 20
        if goal == "GW":
            calorie_modifier = 1.1
            percent_protein = 25
            percent_carbohydrate = 55
            percent_fat = 20
        if goal == "MW":
            calorie_modifier = 1
            percent_protein = 25
            percent_carbohydrate = 55
            percent_fat = 20

        # Calculate targets:
        recommended_calories = round(tdee * calorie_modifier)
        energy = recommended_calories
        protein = round(recommended_calories * (percent_protein / 100) / 4, 1)
        carbohydrate = round(recommended_calories * (percent_carbohydrate / 100) / 4, 1)
        fat = round(recommended_calories * (percent_fat / 100) / 9, 1)
        saturates = round(fat * 0.35, 1)
        sugars = round(energy * 0.03, 1)
        fibre = 30
        salt = 6

        instance.user.target.energy = energy
        instance.user.target.protein = protein
        instance.user.target.carbohydrate = carbohydrate
        instance.user.target.fat = fat
        instance.user.target.saturates = saturates
        instance.user.target.sugars = sugars
        instance.user.target.fibre = fibre
        instance.user.target.salt = salt
        instance.user.target.save()
        instance.save()

        return instance

    def latest_weight(self):
        return self.annotate(
            # latest_weight_until_date=Subquery(
            #     Progress.objects.filter(
            #         user_id=OuterRef("user_id"),
            #         weight__isnull=False,
            #         date__lte=OuterRef("created_at"),
            #     )
            #     .order_by("-date")
            #     .values("weight")[:1]
            # ),
            latest_weight=Subquery(
                Progress.objects.filter(
                    user_id=OuterRef("user_id"),
                    weight__isnull=False,
                )
                .order_by("-date")
                .values("weight")[:1]
            ),
        )
