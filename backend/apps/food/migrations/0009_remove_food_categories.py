# Generated by Django 4.1.7 on 2023-03-22 17:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0008_auto_20230322_1726'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='food',
            name='categories',
        ),
    ]
