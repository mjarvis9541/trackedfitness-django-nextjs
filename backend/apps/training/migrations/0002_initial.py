# Generated by Django 4.0.3 on 2022-10-14 16:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('training', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workouts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='set',
            name='exercise',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sets', to='training.exercise'),
        ),
        migrations.AddField(
            model_name='movement',
            name='muscle_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='training.musclegroup'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='movement',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='training.movement'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='workout',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='training.workout', verbose_name='workout'),
        ),
        migrations.AddConstraint(
            model_name='exercise',
            constraint=models.UniqueConstraint(fields=('workout', 'movement'), name='unique_movement_per_workout'),
        ),
    ]
