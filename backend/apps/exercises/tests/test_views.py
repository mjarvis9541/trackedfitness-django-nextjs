from django.urls import reverse
from rest_framework import status

from apps.exercises.factories import ExerciseFactory
from apps.users.tests.test_views import TokenAPITestCase


class ExerciseListAPIViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.valid_data = {
            "name": "test exercise",
            "slug": "test-exercise",
            "created_by": cls.user.pk,
            "updated_by": cls.user.pk,
        }
        cls.url = reverse("exercise-list")

    # Unauthenticated requests:
    def test_unauthenticated_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_post_request_returns_403(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authenticated requests (non-admin disallowed):
    def test_authenticated_user_get_request_returns_403(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_post_request_returns_403(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_invalid_post_request_returns_403(self):
        response = self.auth_client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
