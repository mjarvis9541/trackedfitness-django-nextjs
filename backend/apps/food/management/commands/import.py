import csv

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from apps.food.models import Food

User = get_user_model()


class Command(BaseCommand):
    help = "Import food from a csv file to food database, format has to match."

    def add_arguments(self, parser):
        parser.add_argument("filepath", type=str, help="Import filepath.")

    def handle(self, *args, **kwargs):
        filepath = kwargs["filepath"]

        with open(filepath) as f:
            csv_reader = csv.DictReader(f)
            object_list = []
            for row in csv_reader:
                object_list.append(
                    Food(
                        name=row["name"],
                        brand=row["brand"],
                        data_value=row["data_value"],
                        data_measurement=row["data_measurement"],
                        energy=row["energy"],
                        fat=row["fat"],
                        saturates=row["saturates"],
                        carbohydrate=row["carbohydrate"],
                        sugars=row["sugars"],
                        fibre=row["fibre"],
                        protein=row["protein"],
                        salt=row["salt"],
                        source="import",
                    )
                )
            Food.objects.bulk_create(object_list)
            self.stdout.write(
                self.style.SUCCESS(f"Imported {len(object_list)} food objects")
            )
