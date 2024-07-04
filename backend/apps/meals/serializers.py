from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.food.models import Food
from apps.meals.models import Item, Meal

User = get_user_model()


class MealItemCreateFromListSerializer(serializers.Serializer):
    meal = serializers.IntegerField()
    data_list = serializers.JSONField()

    def validate(self, attrs):
        # print(attrs["meal"])
        # meal_id = get_object_or_404(Meal, id=attrs["meal"])
        meal = Meal.objects.get(id=attrs["meal"]).id
        data_list = attrs["data_list"]["food"]
        new_list = []
        for obj in data_list:
            if obj["checked"] == True:
                data_measurement = Food.objects.get(id=obj["id"]).data_measurement
                if data_measurement == "srv":
                    obj["quantity"] = obj["quantity"]
                else:
                    obj["quantity"] = int(obj["quantity"]) / 100

                new_list.append(
                    Item(
                        meal_id=meal,
                        food_id=obj["id"],
                        quantity=obj["quantity"],
                    )
                )
        Item.objects.bulk_create(new_list)
        attrs["obs"] = new_list
        return attrs


class ItemSerializer(serializers.ModelSerializer):
    # food_name = serializers.ReadOnlyField()
    # brand_name = serializers.ReadOnlyField()

    data_value = serializers.ReadOnlyField()
    data_measurement = serializers.ReadOnlyField()
    quantity = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    quantity_input = serializers.DecimalField(max_digits=8, decimal_places=2)

    energy = serializers.IntegerField(read_only=True)
    fat = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    saturates = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    carbohydrate = serializers.DecimalField(
        max_digits=4, decimal_places=1, read_only=True
    )
    sugars = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    fibre = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    protein = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    salt = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)

    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    updated_by_username = serializers.ReadOnlyField(source="updated_by.username")

    class Meta:
        model = Item
        fields = (
            "id",
            "meal",
            "food",
            "food_name",
            "brand_id",
            "brand_name",
            "data_value",
            "data_measurement",
            "quantity",
            "quantity_input",
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
            "url",
        )

    def validate(self, data):
        meal = Meal.objects.get(id=data["meal"].id)
        if meal.user != self.context["request"].user:
            raise serializers.ValidationError(
                "You cannot add food to another user's meal."
            )

        quantity_input = data["quantity_input"]
        data_measurement = data["food"].data_measurement
        if data_measurement == "srv":
            if quantity_input > 99:
                raise serializers.ValidationError(
                    {"quantity_input": "can't be above this value"}
                )
        if data_measurement == "g" or data_measurement == "ml":
            if quantity_input > 9999:
                raise serializers.ValidationError(
                    {"quantity_input": "can't be above this value"}
                )
        return data

    def create(self, validated_data):
        data_measurement = validated_data["food"].data_measurement
        quantity_input = validated_data["quantity_input"]

        if data_measurement == "srv":
            quantity = quantity_input
        else:
            quantity = quantity_input / 100
        del validated_data["quantity_input"]

        item = Item(**validated_data, quantity=quantity)
        item.save()
        return item

    def update(self, instance, validated_data):
        data_measurement = validated_data["food"].data_measurement
        quantity_input = validated_data["quantity_input"]

        if data_measurement == "srv":
            quantity = quantity_input
        else:
            quantity = quantity_input / 100
        del validated_data["quantity_input"]

        instance.meal = validated_data.get("meal", instance.meal)
        instance.food = validated_data.get("food", instance.food)
        instance.quantity = quantity
        instance.save()
        return instance


class MealSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ("id", "name")


class MealDeleteSelectedSerializer(serializers.Serializer):
    id_list = serializers.ListField(child=serializers.IntegerField())

    def validate(self, data):
        user = self.context["request"].user
        id_list = data["id_list"]
        queryset = Meal.objects.filter(id__in=id_list, created_by=user)
        if not queryset:
            raise serializers.ValidationError("Nothing to delete.")
        data["queryset"] = queryset
        return data


class MealSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    energy = serializers.ReadOnlyField(default=0)
    fat = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    saturates = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    carbohydrate = serializers.DecimalField(
        max_digits=4, decimal_places=1, read_only=True
    )
    sugars = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    fibre = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    protein = serializers.DecimalField(max_digits=4, decimal_places=1, read_only=True)
    salt = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    food_count = serializers.ReadOnlyField(default=0)

    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    updated_by_username = serializers.ReadOnlyField(source="updated_by.username")

    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = (
            "id",
            "user",
            "username",
            "name",
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "food_count",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
            "url",
            "items",
        )
        # validators = [
        #     UniqueTogetherValidator(
        #         queryset=Meal.objects.all(),
        #         fields=["user", "name"],
        #         message="You already have a meal with this name.",
        #     )
        # ]
        read_only_fields = ("user",)
        extra_kwargs = {"user": {"required": False}}

    def validate_name(self, value):
        user = self.context["request"].user
        if self.instance:
            meal = Meal.objects.exclude(pk=self.instance.pk).filter(
                user=user, name=value
            )
        else:
            meal = Meal.objects.filter(user=user, name=value)
        if meal.exists():
            raise serializers.ValidationError("You already have a meal with this name.")
        return value

    def validate(self, data):
        user = self.context["request"].user
        meal_count = Meal.objects.filter(user=user).count()
        # @ TODO: Remove check if user is updating a meal name,
        if meal_count > 10 and not user.is_superuser:
            raise serializers.ValidationError(
                "You have reached the maximum allowed meals you can create for a basic account. Click here to upgrade."
            )
        return data


class GenerateMealNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ["name"]
        extra_kwargs = {"name": {"read_only": True}}
