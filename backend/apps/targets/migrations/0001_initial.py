# Generated by Django 4.0.3 on 2022-10-14 16:05

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Target',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('weight_goal', models.DecimalField(blank=True, decimal_places=1, help_text='Optional. Used to determine duration required to reach weight goal.', max_digits=4, null=True, verbose_name='weight goal (kg)')),
                ('fitness_goal', models.CharField(choices=[('GW', 'Build Muscle'), ('LW', 'Lose Fat'), ('MW', 'Maintain Weight')], default='MW', max_length=2, verbose_name='fitness goal')),
                ('calculation_method', models.CharField(choices=[('CUS', 'Custom'), ('DEF', 'Default'), ('GRA', 'Grams per kg'), ('PER', 'Percentage'), ('REC', 'Recommended')], default='REC', help_text='Calculation method used to set your calorie and macronutrient targets.', max_length=3, verbose_name='calculation method')),
                ('energy', models.PositiveIntegerField(default=2000, verbose_name='calories (kcal)')),
                ('fat', models.DecimalField(decimal_places=1, default=70, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='fat (g)')),
                ('saturates', models.DecimalField(decimal_places=1, default=20, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='saturates (g)')),
                ('carbohydrate', models.DecimalField(decimal_places=1, default=260, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='carbohydrate (g)')),
                ('sugars', models.DecimalField(decimal_places=1, default=90, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='sugars (g)')),
                ('fibre', models.DecimalField(decimal_places=1, default=30, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='fibre (g)')),
                ('protein', models.DecimalField(decimal_places=1, default=50, max_digits=4, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='protein (g)')),
                ('salt', models.DecimalField(decimal_places=2, default=6, max_digits=5, validators=[django.core.validators.MinValueValidator(Decimal('0.1'))], verbose_name='salt (g)')),
            ],
            options={
                'verbose_name': 'target',
                'verbose_name_plural': 'targets',
                'ordering': ('id',),
            },
        ),
    ]
