# Generated by Django 4.0.3 on 2022-10-14 16:05

from decimal import Decimal
import django.core.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DailyDietTarget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('energy', models.PositiveIntegerField(default=2000)),
                ('fat', models.DecimalField(decimal_places=1, default=70, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('saturates', models.DecimalField(decimal_places=1, default=20, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('carbohydrate', models.DecimalField(decimal_places=1, default=260, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('sugars', models.DecimalField(decimal_places=1, default=90, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('fibre', models.DecimalField(decimal_places=1, default=30, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('protein', models.DecimalField(decimal_places=1, default=50, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('salt', models.DecimalField(decimal_places=2, default=6, max_digits=5, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
            ],
            options={
                'ordering': ['date'],
            },
        ),
    ]
