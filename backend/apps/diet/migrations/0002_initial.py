# Generated by Django 4.0.3 on 2022-10-14 16:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('diet', '0001_initial'),
        ('food', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diet',
            name='food',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='diary_entries', to='food.food'),
        ),
    ]
