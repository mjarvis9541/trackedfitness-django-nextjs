# Generated by Django 4.1.2 on 2022-10-15 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0002_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="profile",
            options={"ordering": ["-created_at"]},
        ),
        migrations.AlterField(
            model_name="profile",
            name="activity_level",
            field=models.CharField(
                choices=[
                    ("SD", "Sedentary"),
                    ("LA", "Lightly Active"),
                    ("MA", "Moderately Active"),
                    ("VA", "Very Active"),
                    ("EA", "Extremely Active"),
                ],
                default="SD",
                help_text='\n            <ul style="padding-left: 1.25rem; margin-bottom: 0;">\n            <li>Sedentary - Little or no exercise/desk job</li>\n            <li>Lightly Active - Light exercise/sports 1-3 days a week</li>\n            <li>Moderately Active - Moderate exercise/sports 3-5 days a week</li>\n            <li>Very Active - Heavy exercise/sports 6-7 days a week</li>\n            <li>Extremely Active - Very heavy exercise/physical job/training twice a day</li>\n            </ul>\n            ',
                max_length=2,
                verbose_name="activity level",
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="goal",
            field=models.CharField(
                choices=[
                    ("LW", "Lose Weight"),
                    ("GW", "Build Muscle"),
                    ("MW", "Maintain Weight"),
                ],
                default="LW",
                max_length=2,
                verbose_name="fitness goal",
            ),
        ),
    ]
