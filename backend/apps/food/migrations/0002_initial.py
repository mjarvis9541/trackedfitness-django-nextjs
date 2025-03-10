# Generated by Django 4.0.3 on 2022-10-14 16:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('food', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='created_by',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_created', related_query_name='%(app_label)s_%(class)s_created_query', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='food',
            name='updated_by',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_updated', related_query_name='%(app_label)s_%(class)s_updated_query', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='brand',
            name='created_by',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_created', related_query_name='%(app_label)s_%(class)s_created_query', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='brand',
            name='updated_by',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_updated', related_query_name='%(app_label)s_%(class)s_updated_query', to=settings.AUTH_USER_MODEL),
        ),
    ]
