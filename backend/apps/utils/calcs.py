from decimal import Decimal

from django.utils import timezone


def calculate_age(date_of_birth):
    # Calculates age from date of birth (param takes a date object)
    now = timezone.now()
    year = now.year
    month = now.month
    day = now.day
    age = (
        year
        - date_of_birth.year
        - ((month, day) < (date_of_birth.month, date_of_birth.day))
    )
    return age


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


def convert_cm_to_in(cm: Decimal):
    result = round(cm / Decimal("2.54"))
    return result


def convert_in_to_ft_in(inches: Decimal):
    result = {}
    result["ft"] = round(inches // 12)
    result["in"] = round(inches % 12)
    return result


def convert_kg_to_lb(kg: Decimal):
    result = round(kg * Decimal("2.20462"))
    return result


def convert_lb_to_st_lb(lb: Decimal):
    result = {}
    result["st"] = round(lb // 14)
    result["lb"] = round(lb % 14)
    return result
