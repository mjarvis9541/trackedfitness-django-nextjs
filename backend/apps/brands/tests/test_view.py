# from django.urls import reverse
# from rest_framework import status

# from apps.brands.factories import BrandFactory
# from apps.users.tests.test_views import TokenAPITestCase


# class BrandListAPIViewTestCase(TokenAPITestCase):
#     @classmethod
#     def setUpTestData(cls):
#         super().setUpTestData()
#         cls.valid_data = {
#             "name": "test brand",
#             "slug": "test-brand",
#             "created_by": cls.user.pk,
#             "updated_by": cls.user.pk,
#         }
#         cls.url = reverse("brand-list")

#     # Unauthorized requests:
#     def test_unauthorized_user_get_request_returns_403(self):
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_unauthorized_user_post_request_returns_403(self):
#         response = self.client.post(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     # Authorized requests:
#     def test_authorized_user_get_request_returns_200(self):
#         response = self.auth_client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_authorized_user_post_request_returns_201(self):
#         response = self.auth_client.post(self.url, data=self.valid_data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_authorized_user_invalid_post_request_returns_400(self):
#         response = self.auth_client.post(self.url, data={})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class BrandDetailPIViewTestCase(TokenAPITestCase):
#     @classmethod
#     def setUpTestData(cls):
#         super().setUpTestData()
#         cls.brand = BrandFactory(created_by=cls.user, updated_by=cls.user)
#         cls.brand_b = BrandFactory(created_by=cls.user_b, updated_by=cls.user_b)
#         cls.valid_data = {
#             "name": "test brand update",
#             "slug": "test-brand-update",
#             "created_by": cls.user.pk,
#             "updated_by": cls.user.pk,
#         }
#         cls.url = reverse("brand-detail", kwargs={"pk": cls.brand.pk})
#         cls.other_user_obj_url = reverse("brand-detail", kwargs={"pk": cls.brand_b.pk})

#     # Unauthorized requests:
#     def test_unauthorized_user_get_request_returns_403(self):
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_unauthorized_user_put_request_returns_403(self):
#         response = self.client.put(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_unauthorized_user_patch_request_returns_403(self):
#         response = self.client.patch(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_unauthorized_user_delete_request_returns_403(self):
#         response = self.client.delete(self.url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     # Test user to other_user obj permissions
#     def test_user_can_view_other_user_object(self):
#         response = self.auth_client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_user_cannot_update_another_user_object(self):
#         response = self.auth_client.put(self.other_user_obj_url, data=self.valid_data)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_user_cannot_partial_update_another_user_object(self):
#         response = self.auth_client.patch(self.other_user_obj_url, data=self.valid_data)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_user_cannot_delete_another_user_object(self):
#         response = self.auth_client.delete(self.other_user_obj_url)
#         self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

#     # Test user obj permissions
#     def test_user_can_view_own_object(self):
#         response = self.auth_client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_user_can_update_own_object(self):
#         response = self.auth_client.put(self.url, data=self.valid_data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_user_can_partial_update_own_object(self):
#         response = self.auth_client.patch(self.url, data=self.valid_data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_user_cannot_delete_own_object(self):
#         response = self.auth_client.delete(self.url)
#         self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

#     # Test invalid data put/patch requests
#     def test_authorized_user_invalid_put_request_returns_400(self):
#         response = self.auth_client.put(self.url, data={})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_authorized_user_invalid_patch_request_returns_400(self):
#         response = self.auth_client.put(self.url, data={})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
