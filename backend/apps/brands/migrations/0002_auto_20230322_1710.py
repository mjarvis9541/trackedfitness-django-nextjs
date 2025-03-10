# Generated by Django 4.1.7 on 2023-03-22 17:10

from django.db import migrations


def move_data(apps, schema_editor):
    try:
        FoodBrand = apps.get_model("food", "Brand")
        NewBrand = apps.get_model("brands", "Brand")
        for obj in FoodBrand.objects.all():
            NewBrand.objects.create(
                name=obj.name,
                slug=obj.slug,
            )
    except:
        pass


class Migration(migrations.Migration):
    dependencies = [
        ("brands", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            move_data,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
