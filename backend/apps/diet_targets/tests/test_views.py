from django.urls import reverse

from rest_framework import status

from apps.diet_targets.factories import DailyDietTargetFactory
from apps.users.tests.test_views import TokenAPITestCase


class DietTargetListAPIViewTestCase(TokenAPITestCase):
    """
    - Unauthorized user cannot make get or post request
    - Authorized user cannot make get request
    - Authorized user can make post request
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("dailydiettarget-list")
        cls.obj_a = DailyDietTargetFactory(user=cls.user_a)
        cls.obj_b = DailyDietTargetFactory(user=cls.user_b)
        cls.valid_data = {
            "username": "testuser",
            "date": "2022-01-01",
            "weight": 80,
            "protein_per_kg": 2.25,
            "carbohydrate_per_kg": 2.25,
            "fat_per_kg": 1,
        }

    # Unauthorized user
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_post_request_returns_403(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user
    def test_authorized_user_get_request_returns_403(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_post_request_returns_201(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class DietTargetDetailViewTestCase(TokenAPITestCase):
    """
    - Unauthorized user cannot make get, put, patch or delete request
    - Authorized user cannot make get, put, patch or delete request to private data
    - Authorized user cannot make put, patch or delete request to public data
    - Authorized user can make get request to public data
    - Authorized user can make get, put, patch, delete request to own data
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.obj = DailyDietTargetFactory(user=cls.user)
        cls.obj_a = DailyDietTargetFactory(user=cls.public_user)
        cls.obj_b = DailyDietTargetFactory(user=cls.private_user)
        cls.url = reverse("dailydiettarget-detail", kwargs={"pk": cls.obj.pk})
        cls.public_obj_url = reverse(
            "dailydiettarget-detail", kwargs={"pk": cls.obj_a.pk}
        )
        cls.private_obj_url = reverse(
            "dailydiettarget-detail", kwargs={"pk": cls.obj_b.pk}
        )
        cls.valid_data = {
            "username": "testuser",
            "date": "2022-01-01",
            "weight": 80,
            "protein_per_kg": 2.25,
            "carbohydrate_per_kg": 2.25,
            "fat_per_kg": 1,
        }

    # Unauthorized user - all requests are forbidden:
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_put_request_returns_403(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_patch_request_returns_403(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_delete_request_returns_403(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user - all requests to own data are allowed:
    def test_authorized_user_get_request_to_own_object_returns_200(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_put_request_to_own_object_returns_200(self):
        response = self.auth_client.put(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_patch_request_to_own_object_returns_200(self):
        response = self.auth_client.put(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_delete_request_to_own_object_returns_204(self):
        response = self.auth_client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # Authorized user - get request to public data allowed:
    # Authorized user - put, patch, delete requests to public data are forbidden:
    def test_authorized_user_get_request_to_public_user_obj_returns_200(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_put_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_patch_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_delete_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user - all requests to private user obj are forbidden:
    def test_authorized_user_get_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_put_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.put(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_patch_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.patch(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_delete_request_to_public_user_obj_returns_403(self):
        response = self.auth_client.delete(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class DietTargetDayDetailViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = DailyDietTargetFactory(user=cls.user)
        cls.public_user_obj = DailyDietTargetFactory(user=cls.public_user)
        cls.private_user_obj = DailyDietTargetFactory(user=cls.private_user)

        cls.user_obj_url = reverse(
            "diet-targets-day",
            kwargs={
                "username": cls.user_obj.user.username,
                "date": cls.user_obj.date,
            },
        )
        cls.public_obj_url = reverse(
            "diet-targets-day",
            kwargs={
                "username": cls.public_user_obj.user.username,
                "date": cls.public_user_obj.date,
            },
        )
        cls.private_obj_url = reverse(
            "diet-targets-day",
            kwargs={
                "username": cls.private_user_obj.user.username,
                "date": cls.private_user_obj.date,
            },
        )
        cls.valid_data = {
            "username": "testuser",
            "date": "2022-01-01",
            "weight": 80,
            "protein_per_kg": 2.25,
            "carbohydrate_per_kg": 2.25,
            "fat_per_kg": 1,
        }

    # Unauthorized user -> requests to public user data:
    def test_unauthorized_user_cannot_get_public_user_data(self):
        response = self.client.get(self.public_obj_url)
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
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_their_own_data(self):
        response = self.auth_client.get(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_their_own_data(self):
        response = self.auth_client.put(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_their_own_data(self):
        response = self.auth_client.patch(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_their_own_data(self):
        response = self.auth_client.delete(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to public user data:
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_public_user_data(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_public_user_data(self):
        response = self.auth_client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_public_user_data(self):
        response = self.auth_client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_public_user_data(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to private user data:
    # Should be a read-only endpoint.
    # Permissions get checked before methods are called.
    def test_authorized_user_cannot_get_private_user_data(self):
        response = self.auth_client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_put_private_user_data(self):
        response = self.auth_client.put(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_private_user_data(self):
        response = self.auth_client.patch(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_private_user_data(self):
        response = self.auth_client.delete(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class DietTargetWeekListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = DailyDietTargetFactory(user=cls.user)
        cls.public_user_obj = DailyDietTargetFactory(user=cls.public_user)
        cls.private_user_obj = DailyDietTargetFactory(user=cls.private_user)

        cls.user_obj_url = reverse(
            "diet-targets-week",
            kwargs={
                "username": cls.user_obj.user.username,
                "date": cls.user_obj.date,
            },
        )
        cls.public_obj_url = reverse(
            "diet-targets-week",
            kwargs={
                "username": cls.public_user_obj.user.username,
                "date": cls.public_user_obj.date,
            },
        )
        cls.private_obj_url = reverse(
            "diet-targets-week",
            kwargs={
                "username": cls.private_user_obj.user.username,
                "date": cls.private_user_obj.date,
            },
        )
        cls.valid_data = {
            "username": "testuser",
            "date": "2022-01-01",
            "weight": 80,
            "protein_per_kg": 2.25,
            "carbohydrate_per_kg": 2.25,
            "fat_per_kg": 1,
        }

    # Unauthorized user -> requests to public user data:
    def test_unauthorized_user_cannot_get_public_user_data(self):
        response = self.client.get(self.public_obj_url)
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
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_their_own_data(self):
        response = self.auth_client.get(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_their_own_data(self):
        response = self.auth_client.put(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_their_own_data(self):
        response = self.auth_client.patch(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_their_own_data(self):
        response = self.auth_client.delete(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to public user data:
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_public_user_data(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_public_user_data(self):
        response = self.auth_client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_public_user_data(self):
        response = self.auth_client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_public_user_data(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to private user data:
    # Should be a read-only endpoint.
    # Permissions get checked before methods are called.
    def test_authorized_user_cannot_get_private_user_data(self):
        response = self.auth_client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_put_private_user_data(self):
        response = self.auth_client.put(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_private_user_data(self):
        response = self.auth_client.patch(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_private_user_data(self):
        response = self.auth_client.delete(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class DietTargetMonthListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = DailyDietTargetFactory(user=cls.user)
        cls.public_user_obj = DailyDietTargetFactory(user=cls.public_user)
        cls.private_user_obj = DailyDietTargetFactory(user=cls.private_user)

        cls.user_obj_url = reverse(
            "diet-targets-month",
            kwargs={
                "username": cls.user_obj.user.username,
                "date": cls.user_obj.date,
            },
        )
        cls.public_obj_url = reverse(
            "diet-targets-month",
            kwargs={
                "username": cls.public_user_obj.user.username,
                "date": cls.public_user_obj.date,
            },
        )
        cls.private_obj_url = reverse(
            "diet-targets-month",
            kwargs={
                "username": cls.private_user_obj.user.username,
                "date": cls.private_user_obj.date,
            },
        )
        cls.valid_data = {
            "username": "testuser",
            "date": "2022-01-01",
            "weight": 80,
            "protein_per_kg": 2.25,
            "carbohydrate_per_kg": 2.25,
            "fat_per_kg": 1,
        }

    # Unauthorized user -> requests to public user data:
    def test_unauthorized_user_cannot_get_public_user_data(self):
        response = self.client.get(self.public_obj_url)
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
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_their_own_data(self):
        response = self.auth_client.get(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_their_own_data(self):
        response = self.auth_client.put(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_their_own_data(self):
        response = self.auth_client.patch(self.user_obj_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_their_own_data(self):
        response = self.auth_client.delete(self.user_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to public user data:
    # Should be a read-only endpoint.
    def test_authorized_user_can_get_public_user_data(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_public_user_data(self):
        response = self.auth_client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_patch_public_user_data(self):
        response = self.auth_client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_authorized_user_cannot_delete_public_user_data(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Authorized user -> requests to private user data:
    # Should be a read-only endpoint.
    # Permissions get checked before methods are called.
    def test_authorized_user_cannot_get_private_user_data(self):
        response = self.auth_client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_put_private_user_data(self):
        response = self.auth_client.put(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_private_user_data(self):
        response = self.auth_client.patch(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_private_user_data(self):
        response = self.auth_client.delete(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
