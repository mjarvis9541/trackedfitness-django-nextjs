from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.categories.serializers import CategorySerializer
from apps.food.models import Brand, Food

User = get_user_model()

SERVING_CHOICES = [("100g", "100g"), ("100ml", "100ml"), ("1 Serving", "1 Serving")]


def handle_serving(validated_data):
    if validated_data["serving"] == "100g":
        data_value = 100
        data_measurement = "g"
    elif validated_data["serving"] == "100ml":
        data_value = 100
        data_measurement = "ml"
    else:
        data_value = 1
        data_measurement = "srv"
    return data_value, data_measurement


class BrandSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=255,
        validators=[
            UniqueValidator(
                queryset=Brand.objects.all(),
                message="A brand with this name already exists.",
                lookup="iexact",
            )
        ],
    )
    food_count = serializers.ReadOnlyField()
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    updated_by_username = serializers.ReadOnlyField(source="updated_by.username")

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
            "slug",
            "image",
            "food_count",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
            "url",
        )
        read_only_fields = (
            "created_by",
            "updated_by",
            "slug",
        )

    # def validate_name(self, value):
    #     brand = Brand.objects.filter(name=value.lower())
    #     if self.instance:
    #         brand = brand.exclude(pk=self.instance.pk)
    #     if brand.exists():
    #         raise serializers.ValidationError("A brand with this name already exists.")
    #     return value


class BrandSelectSerializer(serializers.ModelSerializer):
    name_with_count = serializers.ReadOnlyField()

    class Meta:
        model = Brand
        fields = ("id", "name", "name_with_count")


class FoodSerializer(serializers.ModelSerializer):
    brand_name = serializers.StringRelatedField(source="brand.name")
    brand_slug = serializers.StringRelatedField(source="brand.slug")
    categories = CategorySerializer(many=True, required=False)
    serving = serializers.ChoiceField(choices=SERVING_CHOICES)
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    updated_by_username = serializers.StringRelatedField(source="updated_by.username")
    added_to_diary_last_quantity = serializers.ReadOnlyField()
    added_to_diary_count = serializers.ReadOnlyField()
    added_to_diary_last_date = serializers.ReadOnlyField()

    class Meta:
        model = Food
        fields = (
            "id",
            "name",
            "slug",
            "brand",
            "brand_name",
            "brand_slug",
            "categories",
            "data_value",
            "data_measurement",
            "serving",
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "sodium",
            "added_to_diary_last_quantity",
            "added_to_diary_count",
            "added_to_diary_last_date",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
            "url",
        )
        read_only_fields = (
            "slug",
            "data_value",
            "data_measurement",
            "source",
            "is_active",
        )

    def validate(self, data):
        data_value, data_measurement = handle_serving(data)
        user = self.context["request"].user
        food = Food.objects.filter(
            name=data["name"],
            brand=data["brand"],
            data_value=data_value,
            data_measurement=data_measurement,
        )
        if self.instance:
            food = food.exclude(pk=self.instance.pk)
        if food:
            raise serializers.ValidationError(
                "A food with this name, brand and serving already exists."
            )
        calories = data["energy"]
        calories_with_buffer = round(calories * 1.1)
        calories_from_macros = (
            round(data["protein"] * 4)
            + round(data["carbohydrate"] * 4)
            + round(data["fat"] * 9)
        )
        calories_from_macros_with_buffer = calories_from_macros + 1000
        # print(calories)
        # print(calories_with_buffer)
        # print(calories_from_macros)

        # @TODO: Test this
        if calories_from_macros > calories_with_buffer:
            raise serializers.ValidationError(
                f"Calories provided are too low for the amount of protein, carbs and fat\
                    you have entered. Please review your input, if correct set\
                        calories to {calories_from_macros} kcal."
            )
        if calories > calories_from_macros_with_buffer:
            raise serializers.ValidationError(
                f"Calories provided are too high for the amount of protein, carbs and fat\
                    you have entered. Please review your input, if correct set\
                        calories to {calories_from_macros_with_buffer} kcal."
            )
        if data["saturates"] > data["fat"]:
            raise serializers.ValidationError("Saturates can not be higher than fat.")
        if data["sugars"] > data["carbohydrate"]:
            raise serializers.ValidationError(
                "Sugars can not be higher than carbohydrate."
            )
        if data["fibre"] > data["carbohydrate"]:
            raise serializers.ValidationError(
                "Fibre can not be higher than carbohydrate."
            )
        return data

    def create(self, validated_data):
        data_value, data_measurement = handle_serving(validated_data)
        del validated_data["serving"]
        food = Food(
            **validated_data, data_value=data_value, data_measurement=data_measurement
        )
        food.save()
        return food

    def update(self, instance, validated_data):
        data_value, data_measurement = handle_serving(validated_data)
        del validated_data["serving"]
        instance.name = validated_data.get("name", instance.name)
        instance.brand = validated_data.get("brand", instance.brand)
        instance.data_value = data_value
        instance.data_measurement = data_measurement
        instance.energy = validated_data.get("energy", instance.energy)
        instance.fat = validated_data.get("fat", instance.fat)
        instance.saturates = validated_data.get("saturates", instance.saturates)
        instance.carbohydrate = validated_data.get(
            "carbohydrate", instance.carbohydrate
        )
        instance.sugars = validated_data.get("sugars", instance.sugars)
        instance.fibre = validated_data.get("fibre", instance.fibre)
        instance.protein = validated_data.get("protein", instance.protein)
        instance.salt = validated_data.get("salt", instance.salt)
        instance.created_by = validated_data.get("created_by", instance.created_by)
        instance.updated_by = validated_data.get("updated_by", instance.updated_by)
        instance.save()
        return instance


class BrandDeleteSelectedSerializer(serializers.Serializer):
    brand_id_list = serializers.ListField(
        child=serializers.IntegerField(), min_length=1, max_length=100
    )

    def validate(self, data):
        brand_list = Brand.objects.filter(id__in=data["brand_id_list"])
        if not brand_list:
            raise serializers.ValidationError("Nothing to delete.")
        data["brand_obj_list"] = brand_list
        return data
