from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from apps.users.tests.test_views import TokenAPITestCase

User = get_user_model()


class TargetListAPIViewTestCase(TokenAPITestCase):
    """
    - Unauthorized users should not be able to access list data.
    - Authorized users should only be able to access limited list data.
    - Superusers should be able to access all data.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("target-list")

    def test_unauthorized_user_cannot_access_list_data(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_can_access_list_data(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_superuser_can_access_list_data(self):
        response = self.superuser_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TargetDetailAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_url = reverse(
            "target-detail",
            kwargs={"username": cls.user.username},
        )
        cls.public_user_url = reverse(
            "target-detail",
            kwargs={"username": cls.public_user.username},
        )
        cls.private_user_url = reverse(
            "target-detail",
            kwargs={"username": cls.private_user.username},
        )

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

    # Authorized requests:
    def test_authorized_user_can_access_their_own_data(self):
        response = self.auth_client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_can_access_public_user_data(self):
        response = self.auth_client.get(self.public_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_cannot_access_private_user_data(self):
        response = self.auth_client.get(self.private_user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Superuser requests:
    def test_superuser_can_access_private_user_data(self):
        response = self.superuser_client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
