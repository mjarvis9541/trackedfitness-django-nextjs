# Generated by Django 4.1.2 on 2022-10-16 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0004_remove_profile_estimated_date_of_birth"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="profile",
            name="bio",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="location",
        ),
    ]
