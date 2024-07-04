from datetime import datetime
from decimal import Decimal

from dateutil.relativedelta import relativedelta
from django.test import SimpleTestCase

from .. import calcs


class CalcTests(SimpleTestCase):
    def test_calculate_age(self):
        date_of_birth = datetime.now() - relativedelta(years=30)
        age = calcs.calculate_age(date_of_birth)
        self.assertEqual(age, 30)

    def test_calculate_bmi(self):
        height = 180
        weight = Decimal(85)
        bmi = calcs.calculate_bmi(height, weight)
        self.assertEqual(bmi, 26)

    def test_calculate_bmr_male(self):
        age = 30
        height = 180
        sex = "M"
        weight = Decimal(85)
        bmr = calcs.calculate_bmr(age, height, sex, weight)
        self.assertEqual(bmr, 1830)

    def test_calculate_bmr_female(self):
        age = 30
        height = 161
        sex = "F"
        weight = Decimal(70)
        bmr = calcs.calculate_bmr(age, height, sex, weight)
        self.assertEqual(bmr, 1395)

    def test_calculate_tdee_sedentary(self):
        activity_level = "SD"
        bmr = 1830
        tdee = calcs.calculate_tdee(activity_level, bmr)
        self.assertEqual(tdee, 2196)

    def test_calculate_tdee_lightly_active(self):
        activity_level = "LA"
        bmr = 1830
        tdee = calcs.calculate_tdee(activity_level, bmr)
        self.assertEqual(tdee, 2516)

    def test_calculate_tdee_moderately_active(self):
        activity_level = "MA"
        bmr = 1830
        tdee = calcs.calculate_tdee(activity_level, bmr)
        self.assertEqual(tdee, 2836)

    def test_calculate_tdee_very_active(self):
        activity_level = "VA"
        bmr = 1830
        tdee = calcs.calculate_tdee(activity_level, bmr)
        self.assertEqual(tdee, 3157)

    def test_calculate_tdee_extremely_active(self):
        activity_level = "EA"
        bmr = 1830
        tdee = calcs.calculate_tdee(activity_level, bmr)
        self.assertEqual(tdee, 3477)

    def test_convert_cm_to_in(self):
        cm = 180
        inches = calcs.convert_cm_to_in(cm)
        self.assertEqual(inches, 71)

    def test_convert_in_to_ft_in(self):
        inches = 71
        ft_in = calcs.convert_in_to_ft_in(inches)
        self.assertEqual(ft_in["ft"], 5)
        self.assertEqual(ft_in["in"], 11)

    def test_convert_kg_to_lb(self):
        kg = 85
        lb = calcs.convert_kg_to_lb(kg)
        self.assertEqual(lb, 187)

    def test_convert_lb_to_st_lb(self):
        lb = 187
        st_lb = calcs.convert_lb_to_st_lb(lb)
        self.assertEqual(st_lb["st"], 13)
        self.assertEqual(st_lb["lb"], 5)
