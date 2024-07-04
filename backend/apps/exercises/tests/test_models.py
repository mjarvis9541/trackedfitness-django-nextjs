from django.test import TestCase

from apps.exercises.factories import ExerciseFactory


class ExerciseModelTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.bench = ExerciseFactory(name="Bench Press")
        cls.squat = ExerciseFactory(name="Squat")
        cls.row = ExerciseFactory(name="Barbell Row")

    def test_string_representation(self):
        str_ = str(self.bench)
        self.assertEqual(str_, "Bench Press")
