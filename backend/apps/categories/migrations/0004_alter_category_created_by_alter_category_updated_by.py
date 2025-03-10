# Generated by Django 4.1.7 on 2023-03-04 21:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('categories', '0003_alter_category_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_created', related_query_name='%(app_label)s_%(class)s_created_query', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='category',
            name='updated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_updated', related_query_name='%(app_label)s_%(class)s_updated_query', to=settings.AUTH_USER_MODEL),
        ),
    ]
