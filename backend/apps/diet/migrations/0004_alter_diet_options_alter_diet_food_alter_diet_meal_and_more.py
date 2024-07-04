# Generated by Django 4.1.2 on 2022-10-16 14:53

from decimal import Decimal
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("food", "0003_alter_brand_options"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("diet", "0003_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="diet",
            options={"ordering": ("updated_at",)},
        ),
        migrations.AlterField(
            model_name="diet",
            name="food",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="diet_entries",
                to="food.food",
            ),
        ),
        migrations.AlterField(
            model_name="diet",
            name="meal",
            field=models.IntegerField(
                choices=[
                    (1, "Breakfast"),
                    (2, "Morning Snack"),
                    (3, "Lunch"),
                    (4, "Afternoon Snack"),
                    (5, "Dinner"),
                    (6, "Evening Snack"),
                ],
                default=1,
            ),
        ),
        migrations.AlterField(
            model_name="diet",
            name="quantity",
            field=models.DecimalField(
                decimal_places=2,
                max_digits=5,
                validators=[django.core.validators.MinValueValidator(Decimal("0.0"))],
            ),
        ),
        migrations.AlterField(
            model_name="diet",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="diet_entries",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
