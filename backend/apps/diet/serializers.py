from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from apps.diet.models import Diet
from apps.meals.models import Item, Meal
from apps.meals.serializers import ItemSerializer

User = get_user_model()


class LimitedDietSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    class Meta:
        model = Diet
        fields = ["id", "user", "is_private", "username"]


class DietSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=30, source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    food_id = serializers.ReadOnlyField()
    food_name = serializers.ReadOnlyField()
    brand_id = serializers.ReadOnlyField()
    brand_name = serializers.ReadOnlyField()

    data_value = serializers.ReadOnlyField()
    data_measurement = serializers.ReadOnlyField()

    energy = serializers.ReadOnlyField()
    fat = serializers.ReadOnlyField()
    saturates = serializers.ReadOnlyField()
    carbohydrate = serializers.ReadOnlyField()
    sugars = serializers.ReadOnlyField()
    fibre = serializers.ReadOnlyField()
    protein = serializers.ReadOnlyField()
    salt = serializers.ReadOnlyField()

    quantity_input = serializers.DecimalField(
        max_digits=5, decimal_places=2, write_only=True
    )

    class Meta:
        model = Diet
        fields = [
            "id",
            "user",
            "username",
            "is_private",
            "date",
            "meal",
            "food",
            "quantity",
            "quantity_input",
            # food data
            "food_id",
            "food_name",
            "brand_id",
            "brand_name",
            "data_value",
            "data_measurement",
            "quantity_input",
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "created_at",
            "updated_at",
            "url",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "quantity": {"read_only": True},
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            user = User.objects.get(username=data["user"].pop("username"))
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet objects for another user."
            )

        queryset = Diet.objects.filter(user=user, date=data["date"], meal=data["meal"])
        if queryset.count() > 20:
            raise serializers.ValidationError(
                "You cannot add more than 20 diet entries per meal."
            )

        quantity_input = data.pop("quantity_input")
        data_measurement = data["food"].data_measurement
        if data_measurement == "srv":
            if quantity_input > 99:
                raise serializers.ValidationError(
                    f"You cannot add more than 99 servings of {data['food'].name} to your diet at a time."
                )
            data["quantity"] = quantity_input
        elif data_measurement == "g" or data_measurement == "ml":
            if quantity_input > 9999:
                raise serializers.ValidationError(
                    f"You cannot add more than 999{data_measurement} of {data['food'].name} to your diet at a time."
                )
            data["quantity"] = quantity_input / 100

        data["user"] = user
        return data


class DietDaySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    is_private = serializers.ReadOnlyField(source="user.is_private")

    food_id = serializers.ReadOnlyField()
    food_name = serializers.ReadOnlyField()
    brand_id = serializers.ReadOnlyField()
    brand_name = serializers.ReadOnlyField()

    data_value = serializers.ReadOnlyField()
    data_measurement = serializers.ReadOnlyField()

    energy = serializers.ReadOnlyField()
    fat = serializers.ReadOnlyField()
    saturates = serializers.ReadOnlyField()
    carbohydrate = serializers.ReadOnlyField()
    sugars = serializers.ReadOnlyField()
    fibre = serializers.ReadOnlyField()
    protein = serializers.ReadOnlyField()
    salt = serializers.ReadOnlyField()

    total_meal_energy = serializers.ReadOnlyField()
    total_meal_fat = serializers.ReadOnlyField()
    total_meal_saturates = serializers.ReadOnlyField()
    total_meal_carbohydrate = serializers.ReadOnlyField()
    total_meal_sugars = serializers.ReadOnlyField()
    total_meal_fibre = serializers.ReadOnlyField()
    total_meal_protein = serializers.ReadOnlyField()
    total_meal_salt = serializers.ReadOnlyField()

    total_day_energy = serializers.ReadOnlyField()
    total_day_fat = serializers.ReadOnlyField()
    total_day_saturates = serializers.ReadOnlyField()
    total_day_carbohydrate = serializers.ReadOnlyField()
    total_day_sugars = serializers.ReadOnlyField()
    total_day_fibre = serializers.ReadOnlyField()
    total_day_protein = serializers.ReadOnlyField()
    total_day_salt = serializers.ReadOnlyField()

    # # grams per kg and percentage
    total_day_energy_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_per_kg = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_per_kg = serializers.ReadOnlyField(default=0)
    total_day_fat_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_pct = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_pct = serializers.ReadOnlyField(default=0)
    total_day_fat_pct = serializers.ReadOnlyField(default=0)

    class Meta:
        model = Diet
        fields = [
            "id",
            "user",
            "username",
            "is_private",
            "username",
            "date",
            "meal",
            "quantity",
            "quantity_input",
            "food_id",
            "food_name",
            "brand_id",
            "brand_name",
            "data_value",
            "data_measurement",
            "quantity_input",
            "energy",
            "protein",
            "carbohydrate",
            "fat",
            "saturates",
            "sugars",
            "fibre",
            "salt",
            "total_meal_energy",
            "total_meal_fat",
            "total_meal_saturates",
            "total_meal_carbohydrate",
            "total_meal_sugars",
            "total_meal_fibre",
            "total_meal_protein",
            "total_meal_salt",
            "total_day_energy",
            "total_day_fat",
            "total_day_saturates",
            "total_day_carbohydrate",
            "total_day_sugars",
            "total_day_fibre",
            "total_day_protein",
            "total_day_salt",
            "total_day_energy_per_kg",
            "total_day_protein_per_kg",
            "total_day_carbohydrate_per_kg",
            "total_day_fat_per_kg",
            "total_day_protein_pct",
            "total_day_carbohydrate_pct",
            "total_day_fat_pct",
            "updated_at",
            "created_at",
            "url",
        ]


class DietDayTotalSerializer(serializers.Serializer):
    date = serializers.ReadOnlyField(default=None)
    username = serializers.ReadOnlyField(default=None)
    # total day
    total_day_energy = serializers.ReadOnlyField(default=0)
    total_day_fat = serializers.ReadOnlyField(default=0)
    total_day_saturates = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate = serializers.ReadOnlyField(default=0)
    total_day_sugars = serializers.ReadOnlyField(default=0)
    total_day_fibre = serializers.ReadOnlyField(default=0)
    total_day_protein = serializers.ReadOnlyField(default=0)
    total_day_salt = serializers.ReadOnlyField(default=0)
    # grams per kg and percentage
    total_day_energy_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_per_kg = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_per_kg = serializers.ReadOnlyField(default=0)
    total_day_fat_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_pct = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_pct = serializers.ReadOnlyField(default=0)
    total_day_fat_pct = serializers.ReadOnlyField(default=0)
    # total week
    total_week_energy = serializers.ReadOnlyField(default=0)
    total_week_protein = serializers.ReadOnlyField(default=0)
    total_week_fat = serializers.ReadOnlyField(default=0)
    total_week_carbohydrate = serializers.ReadOnlyField(default=0)
    total_week_saturates = serializers.ReadOnlyField(default=0)
    total_week_sugars = serializers.ReadOnlyField(default=0)
    total_week_fibre = serializers.ReadOnlyField(default=0)
    total_week_salt = serializers.ReadOnlyField(default=0)
    # grams per kg and percentage
    total_week_energy_per_kg = serializers.ReadOnlyField(default=0)
    total_week_protein_per_kg = serializers.ReadOnlyField(default=0)
    total_week_carbohydrate_per_kg = serializers.ReadOnlyField(default=0)
    total_week_fat_per_kg = serializers.ReadOnlyField(default=0)
    total_week_protein_pct = serializers.ReadOnlyField(default=0)
    total_week_carbohydrate_pct = serializers.ReadOnlyField(default=0)
    total_week_fat_pct = serializers.ReadOnlyField(default=0)
    # Week average
    avg_week_energy = serializers.ReadOnlyField(default=0)
    avg_week_protein = serializers.ReadOnlyField(default=0)
    avg_week_fat = serializers.ReadOnlyField(default=0)
    avg_week_carbohydrate = serializers.ReadOnlyField(default=0)
    avg_week_saturates = serializers.ReadOnlyField(default=0)
    avg_week_sugars = serializers.ReadOnlyField(default=0)
    avg_week_fibre = serializers.ReadOnlyField(default=0)
    avg_week_salt = serializers.ReadOnlyField(default=0)
    # Last time food was added to diet
    last_updated_at = serializers.ReadOnlyField(default=None)


class DietCreateFromMealSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=30)
    saved_meal = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    saved_meal_items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Diet
        fields = [
            "username",
            "date",
            "meal",
            "saved_meal",
            "saved_meal_items",
        ]
        extra_kwargs = {
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet entries for another user."
            )
        saved_meal_items = data["saved_meal"].items.select_related(
            "food",
            "food__brand",
            "created_by",
            "updated_by",
        )
        if not saved_meal_items.exists():
            raise serializers.ValidationError(
                "This meal does not contain any food items."
            )
        data["username"] = user.username
        data["saved_meal_items"] = saved_meal_items
        data["user"] = user
        return data

    def create(self, validated_data):
        Diet.objects.bulk_create_from_meal(**validated_data)
        return validated_data


class DietCreateFromDateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=30)
    from_date = serializers.DateField(
        write_only=True, initial=timezone.now().strftime("%Y-%m-%d")
    )
    from_queryset = DietDaySerializer(many=True, read_only=True)

    class Meta:
        model = Diet
        fields = [
            "username",
            "from_date",
            "date",
            "from_queryset",
        ]
        extra_kwargs = {
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet entries for another user."
            )
        from_queryset = Diet.objects.filter(user=user, date=data["from_date"])
        if not from_queryset.exists():
            raise serializers.ValidationError("There are no diet entries on this date.")
        data["from_queryset"] = from_queryset
        data["username"] = user.username
        data["user"] = user
        return data

    def create(self, validated_data):
        Diet.objects.bulk_create_from_date(**validated_data)
        return validated_data


class DietCreateFromDateMealSerializer(serializers.ModelSerializer):
    """
    Copy previous day/meal, `to_date` and `to_meal` is just `date` and `meal`.
    """

    username = serializers.CharField(max_length=30)
    from_date = serializers.DateField(
        write_only=True, initial=timezone.now().strftime("%Y-%m-%d")
    )
    from_meal = serializers.ChoiceField(choices=Diet.Meal.choices)
    from_queryset = DietDaySerializer(many=True, read_only=True)

    class Meta:
        model = Diet
        fields = [
            "username",
            "from_date",
            "from_meal",
            "date",
            "meal",
            "from_queryset",
        ]
        extra_kwargs = {
            "date": {"initial": timezone.now().strftime("%Y-%m-%d")},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].initial = self.context["request"].user.username

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot create diet entries for another user."
            )
        from_queryset = Diet.objects.filter(
            user=user, date=data["from_date"], meal=data["from_meal"]
        )
        if not from_queryset.exists():
            raise serializers.ValidationError(
                "There are no diet entries within this meal."
            )
        data["from_queryset"] = from_queryset
        data["username"] = user.username
        data["user"] = user
        return data

    def create(self, validated_data):
        Diet.objects.bulk_create_from_date_meal(**validated_data)
        return validated_data


class DietBulkDeleteSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, max_length=30)
    id_list = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, max_length=1000
    )

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if user != request_user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot delete diet entries created by another user."
            )
        queryset = Diet.objects.filter(user=user, pk__in=data["id_list"])
        if not queryset.exists():
            raise serializers.ValidationError("No diet entries within this range.")
        data["queryset"] = queryset
        return data


class DietBulkDeleteDateSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, max_length=30)
    date_list = serializers.ListField(
        child=serializers.DateField(), allow_empty=False, max_length=100
    )

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if user != request_user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You cannot delete diet entries created by another user."
            )
        queryset = Diet.objects.filter(user=user, date__in=data["date_list"])
        if not queryset.exists():
            raise serializers.ValidationError("No diet entries within date range.")
        data["queryset"] = queryset
        return data


class SaveSelectedSerializer(serializers.Serializer):
    meal_id = serializers.ReadOnlyField(default=None)
    meal_name = serializers.CharField()
    id_list = serializers.ListField(child=serializers.IntegerField())

    def validate_meal_name(self, value):
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
        id_list = data["id_list"]
        id_list = Diet.objects.filter(id__in=id_list, user=user).values_list(
            "id", flat=True
        )
        if not id_list:
            raise serializers.ValidationError({"id_list": "Invalid diary objects."})
        return data

    def create(self, validated_data):
        user = self.context["request"].user
        # meal_name = validated_data["meal_name"]
        id_list = validated_data["id_list"]

        object_list = Diet.objects.filter(id__in=id_list, user=user)
        generated_meal_name = ", ".join(
            [
                f"{round(diet.quantity_input)}{diet.food.data_measurement} {diet.food.name}"
                for diet in object_list
            ]
        )

        meal = Meal.objects.create(
            user=user,
            name=generated_meal_name,
            created_by=user,
            updated_by=user,
        )

        meal_items = [
            Item(
                meal=meal,
                food=obj.food,
                quantity=obj.quantity,
            )
            for obj in object_list
        ]
        Item.objects.bulk_create(meal_items)
        validated_data["meal_id"] = meal.id
        return validated_data
