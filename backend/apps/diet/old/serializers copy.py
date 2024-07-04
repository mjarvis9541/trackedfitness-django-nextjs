import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from rest_framework import serializers

from apps.diet.models import Diet
from apps.meals.models import Item, Meal
from apps.meals.serializers import ItemSerializer

User = get_user_model()


class DietMonthSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    username = serializers.CharField(max_length=100, write_only=True)

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

    quantity_input = serializers.DecimalField(
        max_digits=5, decimal_places=2, write_only=True
    )


class DietSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100, write_only=True)

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

    quantity_input = serializers.DecimalField(
        max_digits=5, decimal_places=2, write_only=True
    )

    class Meta:
        model = Diet
        fields = [
            "id",
            "user",
            "username",
            "date",
            "meal",
            "food",
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
            "updated_at",
            "created_at",
            "url",
        ]
        extra_kwargs = {"user": {"read_only": True}, "quantity": {"write_only": True}}

    def validate(self, data):
        try:
            user = User.objects.get(username=data.pop("username"))
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        request_user = self.context["request"].user
        if request_user != user and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You do not have permission to perform that action."
            )
        queryset = Diet.objects.filter(user=user, date=data["date"], meal=data["meal"])
        if queryset.count() > 20:
            raise serializers.ValidationError(
                "You cannot add more than 20 diet entries per meal."
            )
        data["user"] = user
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
        return data


class DietDeleteFromDateListSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100, write_only=True)
    date_list = serializers.ListField(child=serializers.DateField())

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        queryset = Diet.objects.filter(user=user, date__in=data["date_list"])
        if not queryset.exists():
            raise serializers.ValidationError("No diet entries within this date range.")
        return data

    def delete_from_date_list(self):
        return Diet.objects.delete_from_date_list(**self.validated_data)


class DiarySerializer(serializers.ModelSerializer):
    brand_id = serializers.ReadOnlyField()
    food_name = serializers.ReadOnlyField()
    brand_name = serializers.ReadOnlyField()
    # diary names
    diary_name = serializers.ReadOnlyField()
    meal_name = serializers.ReadOnlyField(source="get_meal_display")
    #
    username = serializers.ReadOnlyField()
    quantity = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    quantity_input = serializers.DecimalField(max_digits=8, decimal_places=2)
    data_value = serializers.IntegerField(default=None, read_only=True)
    data_measurement = serializers.ReadOnlyField()
    # Diet entry calculated macros (database annotation)
    energy = serializers.ReadOnlyField()
    fat = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    saturates = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    carbohydrate = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    sugars = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    fibre = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    protein = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    salt = serializers.DecimalField(max_digits=5, decimal_places=1, read_only=True)
    sodium = serializers.ReadOnlyField()
    # Meal total macros (database annotation, window function)
    total_meal_energy = serializers.IntegerField(read_only=True)
    total_meal_fat = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_saturates = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_carbohydrate = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_sugars = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_fibre = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_protein = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_meal_salt = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    # Daily total macros (database annotation, window function)
    total_day_energy = serializers.IntegerField(read_only=True)
    total_day_fat = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_saturates = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_carbohydrate = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_sugars = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_fibre = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_protein = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    total_day_salt = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    # Daily target macros (database annotation)
    target_energy = serializers.IntegerField(read_only=True)
    target_fat = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_saturates = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_carbohydrate = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_sugars = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_fibre = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_protein = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    target_salt = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    # Daily remaining macros (database annotation)
    remaining_energy = serializers.IntegerField(read_only=True)
    remaining_fat = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_saturates = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_carbohydrate = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_sugars = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_fibre = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_protein = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    remaining_salt = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )

    class Meta:
        model = Diet
        fields = [
            "id",
            "food_id",
            "brand_id",
            "date",
            "meal",
            "user",
            "username",
            "food_name",
            "brand_name",
            #
            "diary_name",
            "meal_name",
            "food",
            # "food_id",
            "quantity",
            "quantity_input",
            #
            "data_value",
            "data_measurement",
            "energy",
            "fat",
            "saturates",
            "carbohydrate",
            "sugars",
            "fibre",
            "protein",
            "salt",
            "sodium",
            # Meal total macros
            "total_meal_energy",
            "total_meal_fat",
            "total_meal_saturates",
            "total_meal_carbohydrate",
            "total_meal_sugars",
            "total_meal_fibre",
            "total_meal_protein",
            "total_meal_salt",
            # Daily total macros
            "total_day_energy",
            "total_day_fat",
            "total_day_saturates",
            "total_day_carbohydrate",
            "total_day_sugars",
            "total_day_fibre",
            "total_day_protein",
            "total_day_salt",
            # Daily user target
            "target_energy",
            "target_fat",
            "target_saturates",
            "target_carbohydrate",
            "target_sugars",
            "target_fibre",
            "target_protein",
            "target_salt",
            # Daily user remaining macros
            "remaining_energy",
            "remaining_fat",
            "remaining_saturates",
            "remaining_carbohydrate",
            "remaining_sugars",
            "remaining_fibre",
            "remaining_protein",
            "remaining_salt",
            "created_at",
            "updated_at",
            "url",
        ]
        read_only_fields = ("user",)
        extra_kwargs = {"date": {"initial": now().strftime("%Y-%m-%d")}}

    def validate(self, data):
        user = self.context["request"].user
        date = data["date"]
        if Diet.objects.filter(user=user, date=date).count() > 50:
            raise serializers.ValidationError("Too many diary entries on this date.")

        quantity_input = data["quantity_input"]
        data_measurement = data["food"].data_measurement

        if data_measurement == "srv":
            if quantity_input > 99:
                raise serializers.ValidationError(
                    {"quantity_input": "can't be above this val"}
                )

        if data_measurement == "g" or data_measurement == "ml":
            if quantity_input > 9999:
                raise serializers.ValidationError(
                    {"quantity_input": "can't be above 9999"}
                )

        data["user"] = self.context["request"].user
        return data

    def create(self, validated_data):
        data_measurement = validated_data["food"].data_measurement
        quantity_input = validated_data["quantity_input"]
        if data_measurement == "srv":
            quantity = quantity_input
        else:
            quantity = quantity_input / 100
        del validated_data["quantity_input"]
        diary = Diet(**validated_data, quantity=quantity)
        diary.save()
        return Diet.objects.filter(id=diary.id).summary().get()

    def update(self, instance, validated_data):
        data_measurement = validated_data["food"].data_measurement
        quantity_input = validated_data["quantity_input"]
        if data_measurement == "srv":
            quantity = quantity_input
        else:
            quantity = quantity_input / 100
        del validated_data["quantity_input"]

        instance.date = validated_data.get("date", instance.date)
        instance.meal = validated_data.get("meal", instance.meal)
        instance.food = validated_data.get("food", instance.food)
        instance.quantity = quantity
        instance.save()
        # TODO: Use another serializer to return instance properties as opposed
        # to running another query on the database.
        return Diet.objects.filter(id=instance.id).summary().get()


class CopyAllFromDateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    from_date = serializers.DateField(
        write_only=True, initial=now().strftime("%Y-%m-%d")
    )
    to_date = serializers.DateField(write_only=True, initial=now().strftime("%Y-%m-%d"))

    def validate(self, attrs):
        try:
            attrs["user"] = User.objects.get(username=attrs["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")

        attrs["diet_entries"] = Diet.objects.filter(
            user=attrs["user"], date=attrs["from_date"]
        ).values()
        if not attrs["diet_entries"]:
            raise serializers.ValidationError(
                f"No diet entries on {attrs['from_date']}."
            )
        return attrs

    def create(self, validated_data):
        diet_entries_to_create = [
            Diet(
                user=validated_data["user"],
                date=self.validated_data["to_date"],
                meal=obj["meal"],
                food_id=obj["food_id"],
                quantity=obj["quantity"],
            )
            for obj in validated_data["diet_entries"]
        ]
        Diet.objects.bulk_create(diet_entries_to_create)
        return validated_data


class CopyAllFromDateAndMealSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    from_date = serializers.DateField(
        write_only=True, initial=now().strftime("%Y-%m-%d")
    )
    to_date = serializers.DateField(write_only=True, initial=now().strftime("%Y-%m-%d"))
    from_meal = serializers.ChoiceField(write_only=True, choices=Diet.Meal)
    to_meal = serializers.ChoiceField(write_only=True, choices=Diet.Meal)

    def validate(self, attrs):
        try:
            attrs["user"] = User.objects.get(username=attrs["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")

        attrs["diet_entries"] = Diet.objects.filter(
            user=attrs["user"], date=attrs["from_date"], meal=attrs["from_meal"]
        ).values()
        if not attrs["diet_entries"]:
            raise serializers.ValidationError(
                f"No diet entries in meal {attrs['from_meal']} on {attrs['from_date']}."
            )
        return attrs

    def create(self, validated_data):
        diet_entries_to_create = [
            Diet(
                user=validated_data["user"],
                date=self.validated_data["to_date"],
                meal=obj["meal"],
                food_id=obj["food_id"],
                quantity=obj["quantity"],
            )
            for obj in validated_data["diet_entries"]
        ]
        Diet.objects.bulk_create(diet_entries_to_create)
        return validated_data


class DiaryDayTotalSerializer(serializers.Serializer):
    username = serializers.ReadOnlyField(source="user.username")
    date = serializers.ReadOnlyField(default=None)
    week = serializers.ReadOnlyField(default=None)
    profile_weight = serializers.ReadOnlyField(default=0)
    total_day_energy = serializers.ReadOnlyField(default=0)
    total_day_fat = serializers.ReadOnlyField(default=0)
    total_day_saturates = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate = serializers.ReadOnlyField(default=0)
    total_day_sugars = serializers.ReadOnlyField(default=0)
    total_day_fibre = serializers.ReadOnlyField(default=0)
    total_day_protein = serializers.ReadOnlyField(default=0)
    total_day_salt = serializers.ReadOnlyField(default=0)
    # Grams/percentage
    total_day_energy_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_per_kg = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_per_kg = serializers.ReadOnlyField(default=0)
    total_day_fat_per_kg = serializers.ReadOnlyField(default=0)
    total_day_protein_pct = serializers.ReadOnlyField(default=0)
    total_day_carbohydrate_pct = serializers.ReadOnlyField(default=0)
    total_day_fat_pct = serializers.ReadOnlyField(default=0)
    # Week
    total_week_energy = serializers.ReadOnlyField(default=0)
    total_week_protein = serializers.ReadOnlyField(default=0)
    total_week_fat = serializers.ReadOnlyField(default=0)
    total_week_carbohydrate = serializers.ReadOnlyField(default=0)
    total_week_saturates = serializers.ReadOnlyField(default=0)
    total_week_sugars = serializers.ReadOnlyField(default=0)
    total_week_fibre = serializers.ReadOnlyField(default=0)
    total_week_salt = serializers.ReadOnlyField(default=0)
    # Grams/percentage
    total_week_protein_pct = serializers.ReadOnlyField(default=0)
    total_week_carbohydrate_pct = serializers.ReadOnlyField(default=0)
    total_week_fat_pct = serializers.ReadOnlyField(default=0)
    # last added
    last_updated_at = serializers.ReadOnlyField(default=0)


class DiaryCreateFromMealSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    saved_meal = serializers.IntegerField(write_only=True)
    meal_item_list = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Diet
        fields = ["username", "date", "meal", "saved_meal", "meal_item_list"]
        extra_kwargs = {"date": {"initial": now().strftime("%Y-%m-%d")}}

    def validate_saved_meal(self, value):
        meal = Meal.objects.filter(id=value)

        if not meal.exists():
            raise serializers.ValidationError("Invalid saved meal.")
        if not meal.get().items.exists():
            raise serializers.ValidationError("This meal has no items to add.")

        return value

    def validate_username(self, value):
        if not User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Invalid username.")
        return value

    def create(self, validated_data):
        user = get_object_or_404(User, username=validated_data.pop("username"))
        saved_meal = Meal.objects.get(id=validated_data["saved_meal"])
        meal_item_list = saved_meal.items.all()
        Diet.objects.bulk_create(
            [
                Diet(
                    user=user,
                    date=validated_data["date"],
                    meal=validated_data["meal"],
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in meal_item_list
            ]
        )
        return {
            "date": validated_data["date"],
            "meal": validated_data["meal"],
            "meal_item_list": meal_item_list,
        }


class DeleteSelectedSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    id_list = serializers.ListField(child=serializers.IntegerField())

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")
        queryset = Diet.objects.filter(id__in=data["id_list"], user=user)
        if not queryset:
            raise serializers.ValidationError("Nothing to delete.")
        data["queryset"] = queryset
        return data


class DeleteFromWeekSerializer(serializers.Serializer):
    from_date = serializers.DateField(
        initial=now().strftime("%Y-%m-%d"), write_only=True
    )

    def validate(self, data):
        user = self.context["request"].user
        date = data["from_date"]
        # date = datetime.fromisoformat(from_date)
        start_of_week = date - datetime.timedelta(days=date.weekday() % 7)
        end_of_week = start_of_week + datetime.timedelta(days=6)
        queryset = Diet.objects.filter(
            user_id=user.id, date__range=[start_of_week, end_of_week]
        )
        if not queryset:
            raise serializers.ValidationError("Nothing to delete.")
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
        meal_name = validated_data["meal_name"]
        id_list = validated_data["id_list"]

        meal = Meal.objects.create(user=user, name=meal_name)

        object_list = Diet.objects.filter(id__in=id_list, user=user)
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


class DiaryMealSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    username = serializers.ReadOnlyField(source="user.username")
    date = serializers.ReadOnlyField()
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

    # class Meta:
    #     model = Diet
    #     fields = [
    #         "id",
    #         "user",
    #         "username",
    #         "date",
    #         "meal",
    #         "food_id",
    #         "food_name",
    #         "brand_id",
    #         "brand_name",
    #         "data_value",
    #         "data_measurement",
    #         "energy",
    #         "fat",
    #         "saturates",
    #         "carbohydrate",
    #         "sugars",
    #         "fibre",
    #         "protein",
    #         "salt",
    #         "total_meal_energy",
    #         "total_meal_fat",
    #         "total_meal_saturates",
    #         "total_meal_carbohydrate",
    #         "total_meal_sugars",
    #         "total_meal_fibre",
    #         "total_meal_protein",
    #         "total_meal_salt",
    #         "url",
    #     ]
    #     extra_kwargs = {"user": {"read_only": True}}


class DietCopyPreviousSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, max_length=255)
    from_date = serializers.DateField(write_only=True)
    from_meal = serializers.ChoiceField(write_only=True, choices=Diet.Meal)
    to_date = serializers.DateField(write_only=True)
    to_meal = serializers.ChoiceField(write_only=True, choices=Diet.Meal)

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        from_date = data["from_date"]
        from_meal = data["from_meal"]
        from_queryset = Diet.objects.filter(user=user, date=from_date, meal=from_meal)

        if not from_queryset:
            raise serializers.ValidationError("No diet entries.")
        data["user"] = user
        data["from_queryset"] = from_queryset
        return data

    def create(self, validated_data):
        created = Diet.objects.bulk_create(
            [
                Diet(
                    user=self.validated_data["user"],
                    date=validated_data["to_date"],
                    meal=validated_data["to_meal"],
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in validated_data["from_queryset"]
            ]
        )
        return created


class DietCopyFromPreviousDateSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, max_length=255)
    from_date = serializers.DateField(write_only=True)
    to_date = serializers.DateField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        from_date = data["from_date"]
        from_queryset = Diet.objects.filter(user=user, date=from_date)

        if not from_queryset:
            raise serializers.ValidationError("No diet entries.")
        data["user"] = user
        data["from_queryset"] = from_queryset
        return data

    def create(self, validated_data):
        created = Diet.objects.bulk_create(
            [
                Diet(
                    user=self.validated_data["user"],
                    date=validated_data["to_date"],
                    meal=obj.meal,
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in validated_data["from_queryset"]
            ]
        )
        return created
