# Generated by Django 4.1.7 on 2023-03-05 17:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('training_plans', '0003_alter_workoutplan_options_exerciseplan_rest_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='exerciseplan',
            options={'ordering': ('workout_plan__day', 'order')},
        ),
    ]
