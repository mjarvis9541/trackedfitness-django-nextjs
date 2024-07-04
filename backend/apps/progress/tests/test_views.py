import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from apps.progress.factories import ProgressFactory
from apps.users.tests.test_views import TokenAPITestCase

User = get_user_model()


class ProgressListAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("progress-list")
        cls.obj_list = ProgressFactory.create_batch(size=10)
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "weight": Decimal("80.0"),
            "energy_burnt": 2000,
        }

    # GET requests:
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

    # POST requests:
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


class ProgressDetailAPIViewTestCase(TokenAPITestCase):
    """
    Unauthorized users cannot access any objects
    Authorized users can only access their own objects
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = ProgressFactory(user=cls.user)
        cls.public_user_obj = ProgressFactory(user=cls.public_user)
        cls.private_user_obj = ProgressFactory(user=cls.private_user)

        cls.user_obj_url = reverse(
            "progress-detail",
            kwargs={"pk": cls.user_obj.pk},
        )
        cls.public_obj_url = reverse(
            "progress-detail",
            kwargs={"pk": cls.public_user_obj.pk},
        )
        cls.private_obj_url = reverse(
            "progress-detail",
            kwargs={"pk": cls.private_user_obj.pk},
        )
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "weight": Decimal("80.0"),
            "energy_burnt": 2000,
            "notes": "Hello, world",
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

    # Unauthorized user -> requests to private user data:
    def test_unauthorized_user_cannot_get_private_user_data(self):
        response = self.client.get(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_put_public_user_data(self):
        response = self.client.put(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_patch_public_user_data(self):
        response = self.client.patch(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_delete_public_user_data(self):
        response = self.client.delete(self.private_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to their own data:
    def test_authorized_user_can_get_their_own_data(self):
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

    # Authorized user -> requests to public user data:
    def test_authorized_user_can_get_public_user_data(self):
        response = self.auth_client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_put_public_user_data(self):
        response = self.auth_client.put(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_public_user_data(self):
        response = self.auth_client.patch(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_public_user_data(self):
        response = self.auth_client.delete(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to private user data:
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


class ProgressDayDetailViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = ProgressFactory(
            user=cls.user,
            date=datetime.date(2022, 3, 3),
        )
        cls.public_user_obj = ProgressFactory(
            user=cls.public_user,
            date=datetime.date(2022, 3, 3),
        )
        cls.private_user_obj = ProgressFactory(
            user=cls.private_user,
            date=datetime.date(2022, 3, 3),
        )
        cls.user_obj_url = reverse(
            "progress-day",
            kwargs={
                "username": cls.user_obj.user.username,
                "date": cls.user_obj.date,
            },
        )
        cls.public_obj_url = reverse(
            "progress-day",
            kwargs={
                "username": cls.public_user_obj.user.username,
                "date": cls.public_user_obj.date,
            },
        )
        cls.private_obj_url = reverse(
            "progress-day",
            kwargs={
                "username": cls.private_user_obj.user.username,
                "date": cls.private_user_obj.date,
            },
        )
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "weight": Decimal("80.0"),
            "energy_burnt": 2000,
            "notes": "Hello, world",
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


class ProgressMonthListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_obj = ProgressFactory(
            user=cls.user,
            date=datetime.date(2022, 3, 3),
        )
        cls.public_user_obj = ProgressFactory(
            user=cls.public_user,
            date=datetime.date(2022, 3, 3),
        )
        cls.private_user_obj = ProgressFactory(
            user=cls.private_user,
            date=datetime.date(2022, 3, 3),
        )
        cls.user_obj_url = reverse(
            "progress-month",
            kwargs={
                "username": cls.user_obj.user.username,
                "date": cls.user_obj.date,
            },
        )
        cls.public_obj_url = reverse(
            "progress-month",
            kwargs={
                "username": cls.public_user_obj.user.username,
                "date": cls.public_user_obj.date,
            },
        )
        cls.private_obj_url = reverse(
            "progress-month",
            kwargs={
                "username": cls.private_user_obj.user.username,
                "date": cls.private_user_obj.date,
            },
        )
        cls.valid_data = {
            "username": cls.user.username,
            "date": "2022-01-01",
            "weight": Decimal("80.0"),
            "energy_burnt": 2000,
            "notes": "Hello, world",
        }

    # Unauthorized user -> requests to public user data:
    def test_unauthorized_user_cannot_get_public_user_data(self):
        response = self.client.get(self.public_obj_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to their own data:
    # Read-only endpoint.
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
    # Read-only endpoint.
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
    # Read-only endpoint.
    # Permissions get checked before methods are called.
    # 403 forbidden will be triggered before 405 method not allowed.
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
