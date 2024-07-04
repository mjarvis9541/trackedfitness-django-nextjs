from django.db import models
from django.db.models import Avg, ExpressionWrapper, F, Max, Sum, Value, Window
from django.db.models.functions import Cast, Concat, ExtractWeek, Round


class DietQuerySet(models.QuerySet):
    def get_last_updated_at(self):
        day_window = {"partition_by": [F("user"), F("date")]}
        return self.annotate(
            last_updated_at=Window(Max("updated_at"), **day_window),
        )

    def get_food_total(self):
        return self.annotate(
            username=F("user__username"),
            food_name=F("food__name"),
            brand_id=F("food__brand__id"),
            brand_name=F("food__brand__name"),
            data_value=F("quantity") * F("food__data_value"),
            data_measurement=F("food__data_measurement"),
            energy=Cast(
                Round(F("quantity") * F("food__energy")),
                output_field=models.IntegerField(),
            ),
            fat=Round(F("quantity") * F("food__fat"), 1),
            saturates=Round(F("quantity") * F("food__saturates"), 1),
            carbohydrate=Round(F("quantity") * F("food__carbohydrate"), 1),
            sugars=Round(F("quantity") * F("food__sugars"), 1),
            fibre=Round(F("quantity") * F("food__fibre"), 1),
            protein=Round(F("quantity") * F("food__protein"), 1),
            salt=Round(F("quantity") * F("food__salt"), 2),
            # to add: percentage of target calories!
        )

    def get_meal_total(self):
        meal_window = {"partition_by": [F("user"), F("date"), F("meal")]}
        return self.get_food_total().annotate(
            total_meal_energy=Window(Sum("energy"), **meal_window),
            total_meal_fat=Window(Sum("fat"), **meal_window),
            total_meal_saturates=Window(Sum("saturates"), **meal_window),
            total_meal_carbohydrate=Window(Sum("carbohydrate"), **meal_window),
            total_meal_sugars=Window(Sum("sugars"), **meal_window),
            total_meal_fibre=Window(Sum("fibre"), **meal_window),
            total_meal_protein=Window(Sum("protein"), **meal_window),
            total_meal_salt=Window(Sum("salt"), **meal_window),
        )

    def get_day_total(self):
        day_window = {"partition_by": [F("user"), F("date")]}
        return self.get_meal_total().annotate(
            total_day_energy=(Window(Sum("energy"), **day_window)),
            total_day_fat=Window(Sum("fat"), **day_window),
            total_day_saturates=Window(Sum("saturates"), **day_window),
            total_day_carbohydrate=Window(Sum("carbohydrate"), **day_window),
            total_day_sugars=Window(Sum("sugars"), **day_window),
            total_day_fibre=Window(Sum("fibre"), **day_window),
            total_day_protein=Window(Sum("protein"), **day_window),
            total_day_salt=Window(Sum("salt"), **day_window),
            # grams per kg
            total_day_energy_per_kg=Cast(
                Round(F("total_day_energy") / F("user__profile__weight")),
                output_field=models.IntegerField(),
            ),
            total_day_protein_per_kg=Round(
                F("total_day_protein") / F("user__profile__weight"), 2
            ),
            total_day_carbohydrate_per_kg=Round(
                F("total_day_carbohydrate") / F("user__profile__weight"), 2
            ),
            total_day_fat_per_kg=Round(
                F("total_day_fat") / F("user__profile__weight"), 2
            ),
            # percentage
            total_day_protein_pct=(
                Round((F("total_day_protein") * 4) / F("total_day_energy") * 100, 2)
            ),
            total_day_carbohydrate_pct=(
                Round(F("total_day_carbohydrate") * 4 / F("total_day_energy") * 100, 2)
            ),
            total_day_fat_pct=Round(
                F("total_day_fat") * 9 / F("total_day_energy") * 100, 2
            ),
            last_updated_at=Window(Max("updated_at"), **day_window),
        )

    def get_week_total(self):
        week_window = {"partition_by": [F("user"), ExtractWeek(F("date"))]}
        return self.get_day_total().annotate(
            week=ExtractWeek(F("date")),
            total_week_energy=Window(Sum("energy"), **week_window),
            total_week_protein=Window(Sum("protein"), **week_window),
            total_week_carbohydrate=Window(Sum("carbohydrate"), **week_window),
            total_week_fat=Window(Sum("fat"), **week_window),
            total_week_saturates=Window(Sum("saturates"), **week_window),
            total_week_sugars=Window(Sum("sugars"), **week_window),
            total_week_fibre=Window(Sum("fibre"), **week_window),
            total_week_salt=Window(Sum("salt"), **week_window),
            total_week_energy_per_kg=Cast(
                Round(F("total_week_energy") / F("user__profile__weight")),
                output_field=models.IntegerField(),
            ),
            total_week_protein_per_kg=Round(
                F("total_week_protein") / F("user__profile__weight"), 2
            ),
            total_week_carbohydrate_per_kg=Round(
                F("total_week_carbohydrate") / F("user__profile__weight"), 2
            ),
            total_week_fat_per_kg=Round(
                F("total_week_fat") / F("user__profile__weight"), 2
            ),
            total_week_protein_pct=Round(
                (F("total_week_protein") * 4) / F("total_week_energy") * 100, 2
            ),
            total_week_carbohydrate_pct=Round(
                (F("total_week_carbohydrate") * 4) / F("total_week_energy") * 100, 2
            ),
            total_week_fat_pct=Round(
                (F("total_week_fat") * 9) / F("total_week_energy") * 100, 2
            ),
        )

    def get_week_average(self):
        week_window = {"partition_by": [F("user"), ExtractWeek(F("date"))]}
        return self.get_day_total().annotate(
            week=ExtractWeek(F("date")),
            avg_week_energy=Window(Avg("energy"), **week_window),
            avg_week_protein=Window(Avg("protein"), **week_window),
            avg_week_carbohydrate=Window(Avg("carbohydrate"), **week_window),
            avg_week_fat=Window(Avg("fat"), **week_window),
            avg_week_saturates=Window(Avg("saturates"), **week_window),
            avg_week_sugars=Window(Avg("sugars"), **week_window),
            avg_week_fibre=Window(Avg("fibre"), **week_window),
            avg_week_salt=Window(Avg("salt"), **week_window),
        )

    def bulk_create_from_meal(self, **kwargs):
        """Creates diet objects from items within a saved meal."""
        return self.bulk_create(
            [
                self.model(
                    user=kwargs["user"],
                    date=kwargs["date"],
                    meal=kwargs["meal"],
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in kwargs["saved_meal_items"]
            ],
            batch_size=100,
        )

    def bulk_create_from_date(self, **kwargs):
        """Creates diet objects from diet entries from a previous date."""
        return self.bulk_create(
            [
                self.model(
                    user=kwargs["user"],
                    date=kwargs["date"],
                    meal=obj.meal,
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in kwargs["from_queryset"]
            ],
            batch_size=100,
        )

    def bulk_create_from_date_meal(self, **kwargs):
        """Creates diet objects from diet entries from a previous meal."""
        return self.bulk_create(
            [
                self.model(
                    user=kwargs["user"],
                    date=kwargs["date"],
                    meal=kwargs["meal"],
                    food=obj.food,
                    quantity=obj.quantity,
                )
                for obj in kwargs["from_queryset"]
            ],
            batch_size=100,
        )

    ## PRE ROUNDING
    def get_food_total(self):
        return self.annotate(
            username=F("user__username"),
            food_name=F("food__name"),
            brand_id=F("food__brand__id"),
            brand_name=F("food__brand__name"),
            data_value=F("quantity") * F("food__data_value"),
            data_measurement=F("food__data_measurement"),
            energy=Cast(
                Round(F("quantity") * F("food__energy")),
                output_field=models.IntegerField(),
            ),
            fat=Round(F("quantity") * F("food__fat"), 1),
            saturates=F("quantity") * F("food__saturates"),
            carbohydrate=F("quantity") * F("food__carbohydrate"),
            sugars=F("quantity") * F("food__sugars"),
            fibre=F("quantity") * F("food__fibre"),
            protein=F("quantity") * F("food__protein"),
            salt=F("quantity") * F("food__salt"),
            profile_weight=F("user__profile__weight"),
            # to add: percentage of target calories!
        )

    def summary(self):
        meal_window = {
            "partition_by": [F("user"), F("date"), F("meal")],
            "order_by": [F("user").asc(), F("date").asc(), F("meal").asc()],
        }
        day_window = {
            "partition_by": [F("user"), F("date")],
            "order_by": [F("user").asc(), F("date").asc()],
        }
        week_window = {
            "partition_by": [F("user"), ExtractWeek(F("date"))],
            "order_by": [F("user").asc(), ExtractWeek(F("date"))],
        }
        return self.select_related("food").annotate(
            food_name=F("food__name"),
            brand_id=F("food__brand__id"),
            brand_name=F("food__brand__name"),
            data_value=Round(F("quantity") * F("food__data_value"), 3),
            data_measurement=F("food__data_measurement"),
            diary_name=Concat(
                F("food__name"),
                Value(", "),
                F("food__brand__name"),
                output_field=models.CharField(),
            ),
            # Calories and macronutrients
            energy=ExpressionWrapper(
                RoundWithPlaces(F("quantity") * F("food__energy")),
                output_field=models.IntegerField(),
            ),
            fat=F("quantity") * F("food__fat"),
            saturates=F("quantity") * F("food__saturates"),
            carbohydrate=F("quantity") * F("food__carbohydrate"),
            sugars=F("quantity") * F("food__sugars"),
            fibre=F("quantity") * F("food__fibre"),
            protein=F("quantity") * F("food__protein"),
            salt=F("quantity") * F("food__salt"),
            # Meal totals
            total_meal_energy=Window(expression=Sum("energy"), **meal_window),
            total_meal_fat=Window(expression=Sum("fat"), **meal_window),
            total_meal_saturates=Window(expression=Sum("saturates"), **meal_window),
            total_meal_carbohydrate=Window(
                expression=Sum("carbohydrate"), **meal_window
            ),
            total_meal_sugars=Window(expression=Sum("sugars"), **meal_window),
            total_meal_fibre=Window(expression=Sum("fibre"), **meal_window),
            total_meal_protein=Window(expression=Sum("protein"), **meal_window),
            total_meal_salt=Window(expression=Sum("salt"), **meal_window),
            # Daily totals
            total_day_energy=Window(expression=Sum("energy"), **day_window),
            total_day_fat=Window(expression=Sum("fat"), **day_window),
            total_day_saturates=Window(expression=Sum("saturates"), **day_window),
            total_day_carbohydrate=Window(expression=Sum("carbohydrate"), **day_window),
            total_day_sugars=Window(expression=Sum("sugars"), **day_window),
            total_day_fibre=Window(expression=Sum("fibre"), **day_window),
            total_day_protein=Window(expression=Sum("protein"), **day_window),
            total_day_salt=Window(expression=Sum("salt"), **day_window),
            # Total kcal/grams day per kg
            total_day_energy_per_kg_bodyweight=ExpressionWrapper(
                RoundWithPlaces(F("total_day_energy") / F("user__profile__weight")),
                output_field=models.IntegerField(),
            ),
            total_day_protein_per_kg_bodyweight=ExpressionWrapper(
                (F("total_day_protein") / F("user__profile__weight")),
                output_field=models.DecimalField(),
            ),
            total_day_carbohydrate_per_kg_bodyweight=ExpressionWrapper(
                (F("total_day_carbohydrate") / F("user__profile__weight")),
                output_field=models.DecimalField(),
            ),
            total_day_fat_per_kg_bodyweight=ExpressionWrapper(
                (F("total_day_fat") / F("user__profile__weight")),
                output_field=models.DecimalField(),
            ),
            # Total day percentages
            total_day_protein_pct=(
                (F("total_day_protein") * 4) / F("total_day_energy") * 100
            ),
            total_day_carbohydrate_pct=(
                F("total_day_carbohydrate") * 4 / F("total_day_energy") * 100
            ),
            total_day_fat_pct=(F("total_day_fat") * 9 / F("total_day_energy") * 100),
            # Total week data:
            week=ExtractWeek(F("date")),
            total_week_energy=Window(expression=Sum("energy"), **week_window),
            total_week_protein=Window(expression=Sum("protein"), **week_window),
            total_week_carbohydrate=Window(
                expression=Sum("carbohydrate"), **week_window
            ),
            total_week_fat=Window(expression=Sum("fat"), **week_window),
            total_week_saturates=Window(expression=Sum("saturates"), **week_window),
            total_week_sugars=Window(expression=Sum("sugars"), **week_window),
            total_week_fibre=Window(expression=Sum("fibre"), **week_window),
            total_week_salt=Window(expression=Sum("salt"), **week_window),
            total_week_protein_pct=(
                (F("total_week_protein") * 4) / F("total_week_energy") * 100
            ),
            total_week_carbohydrate_pct=(
                (F("total_week_carbohydrate") * 4) / F("total_week_energy") * 100
            ),
            total_week_fat_pct=(
                (F("total_week_fat") * 9) / F("total_week_energy") * 100
            ),
            # Target calories and macronutrients
            target_energy=F("user__target__energy"),
            target_fat=F("user__target__fat"),
            target_saturates=F("user__target__saturates"),
            target_carbohydrate=F("user__target__carbohydrate"),
            target_sugars=F("user__target__sugars"),
            target_fibre=F("user__target__fibre"),
            target_protein=F("user__target__protein"),
            target_salt=F("user__target__salt"),
            target_energy_per_kg_bodyweight=F("user__target__energy")
            / F("user__profile__weight"),
            # Remaining calories and macronutrients
            remaining_energy=F("user__target__energy") - F("total_day_energy"),
            remaining_fat=F("user__target__fat") - F("total_day_fat"),
            remaining_saturates=F("user__target__saturates") - F("total_day_saturates"),
            remaining_carbohydrate=F("user__target__carbohydrate")
            - F("total_day_carbohydrate"),
            remaining_sugars=F("user__target__sugars") - F("total_day_sugars"),
            remaining_fibre=F("user__target__fibre") - F("total_day_fibre"),
            remaining_protein=F("user__target__protein") - F("total_day_protein"),
            remaining_salt=F("user__target__salt") - F("total_day_salt"),
            remaining_energy_per_kg_bodyweight=F("target_energy_per_kg_bodyweight")
            - F("total_day_energy_per_kg_bodyweight"),
        )

    def target_remaining(self, user):
        total = self.total()
        target = Target.objects.filter(user=user).values().first()
        return {
            "total_energy": total.get("total_energy", 0),
            "total_protein": total.get("total_protein", 0),
            "total_carbohydrate": total.get("total_carbohydrate", 0),
            "total_fat": total.get("total_fat", 0),
            "total_saturates": total.get("total_saturates", 0),
            "total_sugars": total.get("total_sugars", 0),
            "total_fibre": total.get("total_fibre", 0),
            "total_salt": total.get("total_salt", 0),
            "target_energy": target.get("energy", 0),
            "target_protein": target.get("protein", 0),
            "target_carbohydrate": target.get("carbohydrate", 0),
            "target_fat": target.get("fat", 0),
            "target_saturates": target.get("saturates", 0),
            "target_sugars": target.get("sugars", 0),
            "target_fibre": target.get("fibre", 0),
            "target_salt": target.get("salt", 0),
            # won't work as not returned in values(), as it's a property
            "target_energy_per_kg": target.get("energy_per_kg", 0),
            "energy": target.get("energy", 0) - total.get("total_energy", 0),
            "protein": target.get("protein", 0) - total.get("total_protein", 0),
            "carbohydrate": target.get("carbohydrate", 0)
            - total.get("total_carbohydrate", 0),
            "fat": target.get("fat", 0) - total.get("total_fat", 0),
            "saturates": target.get("saturates", 0) - total.get("total_saturates", 0),
            "sugars": target.get("sugars", 0) - total.get("total_sugars", 0),
            "fibre": target.get("fibre", 0) - total.get("total_fibre", 0),
            "salt": target.get("salt", 0) - total.get("total_salt", 0),
        }
