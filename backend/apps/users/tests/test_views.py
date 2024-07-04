from http import cookies

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.views.generic import View
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from apps.users.factories import UserFactory

User = get_user_model()


class TokenAPITestCase(APITestCase):
    """
    Base API TestCase class
    - Creates a user
    - Creates a superuser
    - Creates a public_user with is_private flag set to `False`
    - Creates a private_user with is_private flag set to `True`

    - Creates a user APIClient with a valid jwt auth header
    - Creates a superuser APIClient with a valid jwt auth header
    """

    @classmethod
    def setUpTestData(cls):
        cls.http_method_names = View().http_method_names
        cls.user = UserFactory(username="testuser")
        cls.user_a = UserFactory(username="testuser_a")
        cls.user_b = UserFactory(username="testuser_b")
        cls.superuser = UserFactory(is_superuser=True)
        cls.public_user = UserFactory(is_private=False)
        cls.private_user = UserFactory(is_private=True)

        cls.user_token = cls.user.create_token("access")
        cls.superuser_token = cls.superuser.create_token("access")

        cls.auth_client = APIClient()
        cls.superuser_client = APIClient()

        cls.auth_client.credentials(HTTP_AUTHORIZATION=f"JWT {cls.user_token}")
        cls.superuser_client.credentials(
            HTTP_AUTHORIZATION=f"JWT {cls.superuser_token}"
        )


class UserListAPIViewTestCase(TokenAPITestCase):
    """
    - Unauthorized user should not be able to access list data.
    - Authorized user should not be able to access list data.
    - Superuser should be able to access all data.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("user-list")
        cls.valid_data = {
            "name": "test user",
            "username": "newtestuser",
            "email": "newtestuser@example.com",
            "password": "testpassword",
        }

    # Unauthorized requests:
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_post_request_returns_201(self):
        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Authorized requests:
    def test_authorized_user_get_request_returns_403(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_post_request_returns_403(self):
        response = self.auth_client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Superuser request:
    def test_superuser_get_request_returns_200(self):
        response = self.superuser_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_superuser_post_request_returns_201(self):
        response = self.superuser_client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserDetailAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user.set_password("testpass")
        cls.user_b.set_password("testpass")
        cls.user.save()
        cls.user_b.save()
        cls.user_url = reverse(
            "user-detail",
            kwargs={"username": cls.user.username},
        )
        cls.public_user_url = reverse(
            "user-detail",
            kwargs={"username": cls.public_user.username},
        )
        cls.private_user_url = reverse(
            "user-detail",
            kwargs={"username": cls.private_user.username},
        )
        cls.user_password_change_url = reverse(
            "user-password-change", kwargs={"username": cls.user.username}
        )
        cls.user_b_password_change_url = reverse(
            "user-password-change", kwargs={"username": cls.user_b.username}
        )
        cls.user_password_change_data = {
            "password": "testpass",
            "new_password": "newpass321",
        }
        cls.user_b_password_change_data = {
            "password": "testpass",
            "new_password": "newpass321",
        }
        cls.valid_data = {
            "name": "test user smith",
            "is_private": True,
        }

    # Unauthorized requests:
    def test_unauthorized_user_cannot_access_user_data(self):
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_access_public_user_data(self):
        response = self.client.get(self.public_user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_cannot_access_private_user_data(self):
        response = self.client.get(self.private_user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to their own data:
    def test_authorized_user_can_access_their_own_data(self):
        response = self.auth_client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_put_their_own_data(self):
        response = self.auth_client.put(self.user_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_patch_their_own_data(self):
        response = self.auth_client.patch(self.user_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_delete_their_own_data(self):
        response = self.auth_client.delete(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user -> requests to other user data:
    def test_authorized_user_cannot_access_other_user_data(self):
        response = self.auth_client.get(self.public_user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_put_other_user_data(self):
        response = self.auth_client.put(self.public_user_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_patch_other_user_data(self):
        response = self.auth_client.patch(self.public_user_url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_cannot_delete_other_user_data(self):
        response = self.auth_client.delete(self.public_user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_get_request_returns_200(self):
        response = self.auth_client.get(self.user_password_change_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_can_change_own_password(self):
        response = self.auth_client.put(
            self.user_password_change_url, data=self.user_password_change_data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_cannot_change_user_b_password(self):
        response = self.auth_client.put(
            self.user_b_password_change_url, data=self.user_b_password_change_data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TokenCreateAPIViewTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = UserFactory(email="testuser@example.com")
        cls.user.set_password("testpassword")
        cls.user.save()

        cls.url = reverse("token")
        cls.valid_data = {
            "email": "testuser@example.com",
            "password": "testpassword",
        }
        cls.invalid_data = {
            "email": "invalid@example.com",
            "password": "invalid",
        }

    def test_valid_post_request_returns_200(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_valid_post_request_returns_access_token(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertIsNotNone(response.data.get("access"))

    def test_valid_post_request_returns_refresh_token_as_cookie(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertIsNotNone(response.cookies.get("refresh_token"))

    def test_valid_post_request_returns_refresh_token_as_cookie_morsel(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertIsInstance(response.cookies.get("refresh_token"), cookies.Morsel)

    def test_invalid_post_request_returns_400(self):
        response = self.client.post(self.url, data=self.invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_post_request_does_not_set_refresh_cookie(self):
        response = self.client.post(self.url, data=self.invalid_data)
        self.assertIsNone(response.cookies.get("refresh_token"))
