# Generated by Django 4.0.3 on 2022-10-14 16:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('targets', '0004_alter_target_user'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='target',
            options={'ordering': ('id',)},
        ),
    ]
