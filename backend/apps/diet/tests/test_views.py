import json

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from apps.diet.factories import DietFactory
from apps.food.factories import BrandFactory, FoodFactory
from apps.users.tests.test_views import TokenAPITestCase

User = get_user_model()


class DietListAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("diet-list")
        cls.brand = BrandFactory(
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.food = FoodFactory(
            brand=cls.brand,
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.diet_obj_list = DietFactory.create_batch(
            size=10,
            user=cls.user,
            food=cls.food,
        )
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "meal": 1,
            "food": cls.food.pk,
            "quantity_input": 100,
        }

    # Unauthorized requests
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_post_request_returns_403(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_get_request_returns_403(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_superuser_get_request_returns_200(self):
        response = self.superuser_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Authorized requests:
    def test_authorized_user_post_request_returns_201(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authorized_user_invalid_post_request_returns_400(self):
        response = self.auth_client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authorized_user_cannot_create_obj_for_another_user(self):
        valid_data = self.valid_data
        valid_data["username"] = self.user_b.username
        response = self.auth_client.post(self.url, data=valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_superuser_can_create_obj_for_another_user(self):
        valid_data = self.valid_data
        valid_data["username"] = self.user_b.username
        response = self.superuser_client.post(self.url, data=valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class DietDetailAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = DietFactory(user=cls.user)
        cls.public_user_obj = DietFactory(user=cls.public_user)
        cls.private_user_obj = DietFactory(user=cls.private_user)
        cls.brand = BrandFactory(
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.food = FoodFactory(
            brand=cls.brand,
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.user_obj_url = reverse(
            "diet-detail",
            kwargs={"pk": cls.user_obj.pk},
        )
        cls.public_obj_url = reverse(
            "diet-detail",
            kwargs={"pk": cls.public_user_obj.pk},
        )
        cls.private_obj_url = reverse(
            "diet-detail",
            kwargs={"pk": cls.private_user_obj.pk},
        )
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "meal": 1,
            "food": cls.food.pk,
            "quantity_input": 100,
        }

    # Unauthorized user -> requests to other users:
    def test_unauthorized_user_cannot_access_public_user_data(self):
        response = self.client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_access_private_user_data(self):
        response = self.client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_put_public_user_data(self):
        response = self.client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_patch_public_user_data(self):
        response = self.client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_delete_public_user_data(self):
        response = self.client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to their own data:
    def test_authorized_user_can_access_their_own_data(self):
        response = self.auth_client.get(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_put_their_own_data(self):
        response = self.auth_client.put(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_patch_their_own_data(self):
        response = self.auth_client.patch(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_delete_their_own_data(self):
        response = self.auth_client.delete(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # Authorized user -> requests to other user data:
    def test_authorized_user_can_access_public_user_data(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_access_private_user_data(self):
        response = self.auth_client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_put_other_user_data(self):
        response = self.auth_client.put(self.public_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_other_user_data(self):
        response = self.auth_client.patch(self.public_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_other_user_data(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class DietDeleteFromIDListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.brand = BrandFactory(
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.food = FoodFactory(
            brand=cls.brand,
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.diet_obj = DietFactory(user=cls.user, food=cls.food)
        cls.diet_obj_a = DietFactory(user=cls.user_a, food=cls.food)
        cls.url = reverse("diet-delete-from-id-list")
        cls.data = {
            "username": cls.user_a.username,
            "id_list": [cls.diet_obj_a.pk],
        }
        cls.valid_data = {
            "username": cls.user.username,
            "id_list": [cls.diet_obj.pk],
        }

    def test_unauthorized_user_request_returns_403(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_can_delete_own_object(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_delete_request_to_another_user_object_returns_400(self):
        response = self.auth_client.post(self.url, data=self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authorized_user_cannot_delete_another_user_object(self):
        response = self.auth_client.post(self.url, data=self.data)
        self.assertIn(
            "You cannot delete diet entries created by another user.",
            json.loads(response.content).get("non_field_errors"),
        )


class DietDeleteFromDateListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.brand = BrandFactory(
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.food = FoodFactory(
            brand=cls.brand,
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.diet_obj = DietFactory(user=cls.user, date="2022-03-03", food=cls.food)
        cls.diet_obj_a = DietFactory(user=cls.user_a, date="2022-03-03", food=cls.food)
        cls.data = {
            "username": cls.user_a.username,
            "date_list": [cls.diet_obj_a.date],
        }
        cls.valid_data = {
            "username": cls.user.username,
            "date_list": [cls.diet_obj.date],
        }
        cls.url = reverse("diet-delete-from-date-list")

    def test_unauthorized_user_request_returns_403(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_can_delete_own_object(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_delete_request_to_another_user_object_returns_400(self):
        response = self.auth_client.post(self.url, data=self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authorized_user_cannot_delete_another_user_object(self):
        response = self.auth_client.post(self.url, data=self.data)
        self.assertIn(
            "You cannot delete diet entries created by another user.",
            json.loads(response.content).get("non_field_errors"),
        )
