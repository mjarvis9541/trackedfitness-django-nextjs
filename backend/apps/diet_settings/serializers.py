from rest_framework import serializers

from .models import DietSettings


class DietSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietSettings
        fields = (
            "user",
            "visible_meals",
            "meal_1_name",
            "meal_2_name",
            "meal_3_name",
            "meal_4_name",
            "meal_5_name",
            "meal_6_name",
            "created_at",
            "updated_at",
            "url",
        )
