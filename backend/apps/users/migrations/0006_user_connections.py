# Generated by Django 4.1.2 on 2023-02-06 21:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('followers', '0001_initial'),
        ('users', '0005_alter_user_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='connections',
            field=models.ManyToManyField(blank=True, through='followers.UserFollowing', to=settings.AUTH_USER_MODEL),
        ),
    ]
