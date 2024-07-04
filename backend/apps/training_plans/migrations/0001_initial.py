# Generated by Django 4.1.7 on 2023-03-04 21:03

from decimal import Decimal
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('training', '0003_alter_set_options'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ExercisePlan',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('order', models.PositiveIntegerField(default=1, help_text='Denotes the order of the exercise within the workout.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)])),
                ('sets', models.PositiveIntegerField(default=1, help_text='Denotes the number of sets within the exercise.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(25)])),
                ('reps', models.PositiveIntegerField(default=10, help_text='Denotes the number of reps within the set.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)])),
                ('weight', models.DecimalField(decimal_places=2, default=Decimal('0'), help_text='Denotes the weight (kg) for the sets and reps.', max_digits=6, validators=[django.core.validators.MinValueValidator(Decimal('0'))])),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='training.movement')),
            ],
            options={
                'ordering': ('order',),
            },
        ),
        migrations.CreateModel(
            name='TrainingPlan',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('slug', models.SlugField(editable=False)),
                ('duration', models.PositiveIntegerField(help_text='Duration in weeks.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(52)])),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_created', related_query_name='%(app_label)s_%(class)s_created_query', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_updated', related_query_name='%(app_label)s_%(class)s_updated_query', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='WorkoutPlan',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('day', models.IntegerField(choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday'), (0, 'N/A')], default=1)),
                ('order', models.PositiveIntegerField(default=1, help_text='Denotes the order of the workout within the day.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)])),
                ('name', models.CharField(blank=True, help_text='Optional name of the workout, for example: "Chest Day", "Back Day", and so on.', max_length=50)),
                ('training_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='training_plans.trainingplan')),
            ],
            options={
                'ordering': ('day', 'order'),
            },
        ),
        migrations.CreateModel(
            name='SetPlan',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reps', models.PositiveIntegerField(default=10, help_text='Denotes the number of reps within the set.', validators=[django.core.validators.MaxValueValidator(100)])),
                ('weight', models.DecimalField(decimal_places=2, default=Decimal('0'), help_text='Denotes the weight (kg) for the sets and reps.', max_digits=6, validators=[django.core.validators.MinValueValidator(Decimal('0'))])),
                ('exercise_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='training_plans.exerciseplan')),
            ],
        ),
        migrations.AddField(
            model_name='exerciseplan',
            name='workout_plan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='training_plans.workoutplan'),
        ),
        migrations.AddConstraint(
            model_name='workoutplan',
            constraint=models.UniqueConstraint(fields=('training_plan', 'day', 'order'), name='unique_order_per_day_per_training_plan'),
        ),
        migrations.AddConstraint(
            model_name='exerciseplan',
            constraint=models.UniqueConstraint(fields=('workout_plan', 'order'), name='unique_order_per_workout_plan'),
        ),
    ]