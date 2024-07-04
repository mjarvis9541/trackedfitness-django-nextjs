from datetime import date
from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.profiles.managers import ProfileQuerySet
from apps.utils.behaviours import Timestampable
from apps.utils.calcs import (
    calculate_age,
    calculate_bmi,
    calculate_bmr,
    calculate_tdee,
    convert_cm_to_in,
    convert_in_to_ft_in,
    convert_kg_to_lb,
    convert_lb_to_st_lb,
)

User = settings.AUTH_USER_MODEL


def user_directory_path(instance, filename):
    # File will be uploaded to:
    # /media/profiles/profile/<profile_id>/<filename>.ext
    return f"profiles/{instance.id}/{filename}"


class Profile(Timestampable):
    """
    Stores stats on the related user, sex, height, weight, age and activity
    level. Calculates BMI, BMR, TDEE.
    Converts height and weight between various systems of measurements.
    User height and weight are stored using the metric system (cm, kg)
    """

    class Sex(models.TextChoices):
        MALE = "M", _("Male")
        FEMALE = "F", _("Female")

    class ActivityLevel(models.TextChoices):
        SEDENTARY = "SD", _("Sedentary")
        LIGHTLY_ACTIVE = "LA", _("Lightly Active")
        MODERATELY_ACTIVE = "MA", _("Moderately Active")
        VERY_ACTIVE = "VA", _("Very Active")
        EXTRA_ACTIVE = "EA", _("Extremely Active")

    class MeasurementSystem(models.TextChoices):
        METRIC = "MET", _("Metric")
        IMPERIAL = "IMP", _("Imperial")
        US_CUSTOMARY = "USC", _("US Customary")

    class Goal(models.TextChoices):
        LOSE_WEIGHT = "LW", _("Lose Weight")
        GAIN_WEIGHT = "GW", _("Build Muscle")
        MAINTAIN_WEIGHT = "MW", _("Maintain Weight")

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    image = models.ImageField(
        _("profile picture"),
        default="profiles/default/default-profile-pic.jpg",
        upload_to=user_directory_path,
        null=True,
        blank=True,
    )
    sex = models.CharField(
        _("sex"), max_length=1, choices=Sex.choices, null=True, blank=True
    )
    height = models.DecimalField(
        _("height (cm)"),
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    weight = models.DecimalField(
        _("weight (kg)"),
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))],
    )
    date_of_birth = models.DateField(
        _("date of birth"),
        null=True,
        blank=True,
        validators=[MaxValueValidator(limit_value=date.today)],
    )

    # activity = models.ForeignKey(ActivityLevel, on_delete=models.PROTECT, related_name="profiles")
    goal = models.CharField(
        _("goal"),
        max_length=2,
        choices=Goal.choices,
        default=Goal.LOSE_WEIGHT,
    )

    activity_level = models.CharField(
        _("activity level"),
        max_length=2,
        choices=ActivityLevel.choices,
        default=ActivityLevel.SEDENTARY,
        help_text=_(
            """
            <ul style="padding-left: 1.25rem; margin-bottom: 0;">
            <li>Sedentary - Little or no exercise/desk job</li>
            <li>Lightly Active - Light exercise/sports 1-3 days a week</li>
            <li>Moderately Active - Moderate exercise/sports 3-5 days a week</li>
            <li>Very Active - Heavy exercise/sports 6-7 days a week</li>
            <li>Extremely Active - Very heavy exercise/physical job/training twice a day</li>
            </ul>
            """
        ),
    )
    measurement_system = models.CharField(
        _("measurement system"),
        max_length=3,
        choices=MeasurementSystem.choices,
        default=MeasurementSystem.IMPERIAL,
        help_text=_(
            """
            Measurement system used for recording and displaying height and weight.
            """
        ),
    )

    # connections = models.ManyToManyField(
    #     "self",
    #     blank=True,
    #     through="followers.Follower",
    #     symmetrical=False,
    # )

    objects = ProfileQuerySet.as_manager()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.user.username

    @property
    def age(self):
        """Calculated age from date of birth or estimated date of birth."""
        if self.date_of_birth:
            return calculate_age(self.date_of_birth)

    @property
    def bmi(self):
        """Calculated Body Mass Index from height and weight."""
        if self.height and self.weight:
            return calculate_bmi(self.height, self.weight)

    @property
    def bmr(self):
        """Calculated Basal Metabolic Rate from age, sex, height and weight."""
        if self.age and self.height and self.sex and self.weight:
            return calculate_bmr(self.age, self.height, self.sex, self.weight)

    @property
    def tdee(self):
        """
        Calculated Total Daily Energy Expenditure from activity level and
        basal metabolic rate.
        """
        if self.activity_level and self.bmr:
            return calculate_tdee(self.activity_level, self.bmr)

    @property
    def height_in(self):
        if self.height:
            return convert_cm_to_in(self.height)

    @property
    def height_ft_in(self):
        if self.height:
            return convert_in_to_ft_in(self.height_in)

    @property
    def weight_lb(self):
        if self.weight:
            return convert_kg_to_lb(self.weight)

    @property
    def weight_st_lb(self):
        if self.weight:
            return convert_lb_to_st_lb(self.weight_lb)

    # @property
    # def safe_weekly_weight_loss_goal(self):
    #     """
    #     Safe weekly weight loss target. Based on a calculation of 0.5% - 1% of
    #     the user's total body weight.
    #     """
    #     if self.weight:
    #         data = {}
    #         data["lower_limit"] = round(self.weight * Decimal("0.005"), 1)
    #         data["upper_limit"] = round(self.weight * Decimal("0.01"), 1)
    #         return data
    #     else:
    #         return "Calculation requires user weight."

    # @property
    # def safe_monthly_weight_loss_goal(self):
    #     """
    #     Safe monthly weight loss target. Based on a calculation of 0.5% - 1% of
    #     the user's total body weight, multiplied by 4.
    #     """
    #     if self.weight:
    #         data = {}
    #         data["lower_limit"] = round(self.weight * Decimal("0.005") * 4, 1)
    #         data["upper_limit"] = round(self.weight * Decimal("0.01") * 4, 1)
    #         return data
    #     else:
    #         return "Calculation requires user weight."

    # def get_profile_imperial_form_data(self):
    #     data = {}
    #     if self.height:
    #         data["height_ft"] = self.height_ft_in.get("ft")
    #         data["height_in"] = self.height_ft_in.get("in")
    #     if self.weight:
    #         data["weight_st"] = self.weight_st_lb.get("st")
    #         data["weight_lb"] = self.weight_st_lb.get("lb")
    #     return data

    # def get_profile_us_customary_form_data(self):
    #     data = {}
    #     if self.height:
    #         data["height_ft"] = self.height_ft_in.get("ft")
    #         data["height_in"] = self.height_ft_in.get("in")
    #     if self.weight:
    #         data["weight_lb"] = self.weight_lb
    #     return data

    # def update_from_imperial_data(self, **kwargs):
    #     if kwargs.get("height_in") and kwargs.get("height_ft"):
    #         total_in = kwargs["height_in"] + (kwargs["height_ft"] * 12)
    #         self.height = total_in * Decimal("2.54")
    #     if kwargs.get("weight_lb") and kwargs.get("weight_st"):
    #         total_lb = kwargs["weight_lb"] + (kwargs["weight_st"] * 14)
    #         self.weight = total_lb * Decimal("0.453592")
    #     self.save()

    # def update_from_us_customary_data(self, **kwargs):
    #     if kwargs.get("height_in") and kwargs.get("height_ft"):
    #         total_in = kwargs["height_in"] + (kwargs["height_ft"] * 12)
    #         self.height = total_in * Decimal("2.54")
    #     if kwargs.get("weight_lb"):
    #         total_lb = kwargs["weight_lb"]
    #         self.weight = total_lb * Decimal("0.453592")
    #     self.save()

    # def update_profile_target(self, instance):
    #     age = calculate_age(
    #         date_of_birth=instance.date_of_birth,
    #     )
    #     bmr = calculate_bmr(
    #         age=age,
    #         height=instance.height,
    #         sex=instance.sex,
    #         weight=instance.weight,
    #     )
    #     tdee = calculate_tdee(
    #         activity_level=instance.activity_level,
    #         bmr=bmr,
    #     )
    #     goal = instance.goal
    #     if goal == "LW":
    #         calorie_modifier = 0.8
    #         percent_protein = 40
    #         percent_carbohydrate = 40
    #         percent_fat = 20
    #     if goal == "GW":
    #         calorie_modifier = 1.1
    #         percent_protein = 25
    #         percent_carbohydrate = 55
    #         percent_fat = 20
    #     if goal == "MW":
    #         calorie_modifier = 1
    #         percent_protein = 25
    #         percent_carbohydrate = 55
    #         percent_fat = 20

    #     # Calculate targets:
    #     recommended_calories = round(tdee * calorie_modifier)
    #     energy = recommended_calories
    #     protein = round(recommended_calories * (percent_protein / 100) / 4, 1)
    #     carbohydrate = round(recommended_calories * (percent_carbohydrate / 100) / 4, 1)
    #     fat = round(recommended_calories * (percent_fat / 100) / 9, 1)
    #     saturates = round(fat * 0.35, 1)
    #     sugars = round(energy * 0.03, 1)
    #     fibre = 30
    #     salt = 6

    #     instance.user.target.energy = energy
    #     instance.user.target.protein = protein
    #     instance.user.target.carbohydrate = carbohydrate
    #     instance.user.target.fat = fat
    #     instance.user.target.saturates = saturates
    #     instance.user.target.sugars = sugars
    #     instance.user.target.fibre = fibre
    #     instance.user.target.salt = salt
    #     instance.user.target.save()
    #     instance.save()

    #     return instance
