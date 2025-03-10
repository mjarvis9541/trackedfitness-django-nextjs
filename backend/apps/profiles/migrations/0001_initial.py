# Generated by Django 4.0.3 on 2022-10-14 16:05

import apps.profiles.models
import datetime
from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('image', models.ImageField(blank=True, default='profiles/default/default-profile-pic.jpg', null=True, upload_to=apps.profiles.models.user_directory_path, verbose_name='profile picture')),
                ('location', models.CharField(blank=True, max_length=225, null=True, verbose_name='location')),
                ('bio', models.CharField(blank=True, max_length=225, null=True, verbose_name='bio')),
                ('sex', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female')], max_length=1, null=True, verbose_name='sex')),
                ('height', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(Decimal('0.0'))], verbose_name='height (cm)')),
                ('weight', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(Decimal('0.0'))], verbose_name='weight (kg)')),
                ('date_of_birth', models.DateField(blank=True, null=True, validators=[django.core.validators.MaxValueValidator(limit_value=datetime.date.today)], verbose_name='date of birth')),
                ('estimated_date_of_birth', models.DateField(editable=False, help_text="\n            Estimated date of birth based on the date the user input their age. This should only ever be populated if\n            we don't have the user's actual date of birth.<br />\n            ", null=True, verbose_name='estimated date of birth')),
                ('is_initial_setup', models.BooleanField(default=False, help_text='Designates whether the user has been through the initial profile and target setup.')),
                ('goal', models.CharField(choices=[('GW', 'Build Muscle'), ('LW', 'Lose Weight'), ('MW', 'Maintain Weight')], default='LW', max_length=2, verbose_name='fitness goal')),
                ('activity_level', models.CharField(blank=True, choices=[('SD', 'Sedentary'), ('LA', 'Lightly Active'), ('MA', 'Moderately Active'), ('VA', 'Very Active'), ('EA', 'Extremely Active')], help_text='\n            <ul style="padding-left: 1.25rem; margin-bottom: 0;">\n            <li>Sedentary - Little or no exercise/desk job</li>\n            <li>Lightly Active - Light exercise/sports 1-3 days a week</li>\n            <li>Moderately Active - Moderate exercise/sports 3-5 days a week</li>\n            <li>Very Active - Heavy exercise/sports 6-7 days a week</li>\n            <li>Extremely Active - Very heavy exercise/physical job/training twice a day</li>\n            </ul>\n            ', max_length=2, null=True, verbose_name='activity level')),
                ('measurement_system', models.CharField(choices=[('MET', 'Metric'), ('IMP', 'Imperial'), ('USC', 'US Customary')], default='IMP', help_text='\n            Measurement system used for recording and displaying height and weight.\n            ', max_length=3, verbose_name='measurement system')),
            ],
            options={
                'verbose_name': 'profile',
                'verbose_name_plural': 'profiles',
            },
        ),
    ]
