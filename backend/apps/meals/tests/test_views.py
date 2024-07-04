from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from apps.food.factories import BrandFactory, FoodFactory
from apps.meals.factories import ItemFactory, MealFactory
from apps.users.tests.test_views import TokenAPITestCase

User = get_user_model()


class MealListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("meal-list")
        cls.obj_list = MealFactory.create_batch(size=10)
        cls.valid_data = {"user_id": cls.user.id, "name": "meal 1"}

    # Unauthorized user
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_post_request_returns_403(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user
    def test_authorized_user_get_request_returns_200(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_post_request_returns_201(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Authorized user - invalid post data fails:
    def test_authorized_user_invalid_data_post_request_returns_400(self):
        response = self.auth_client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MealDetailViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.obj = MealFactory(user=cls.user)
        cls.obj_a = MealFactory(user=cls.public_user)
        cls.obj_b = MealFactory(user=cls.private_user)
        cls.url = reverse("meal-detail", kwargs={"pk": cls.obj.pk})
        cls.public_obj_url = reverse("meal-detail", kwargs={"pk": cls.obj_a.pk})
        cls.private_obj_url = reverse("meal-detail", kwargs={"pk": cls.obj_b.pk})
        cls.valid_data = {
            "name": "meal 2",
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

    # Authorized user - invalid data put and patch fails:
    def test_authorized_user_invalid_data_put_request_to_own_object_returns_400(self):
        response = self.auth_client.put(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authorized_user_invalid_data_patch_request_to_own_object_returns_400(self):
        response = self.auth_client.put(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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


class ItemListViewTestCase(TokenAPITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.url = reverse("item-list")
        cls.meal = MealFactory(user=cls.user)
        cls.other_user_meal = MealFactory(user=cls.user_b)
        cls.brand = BrandFactory(
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.food = FoodFactory(
            brand=cls.brand,
            created_by=cls.user,
            updated_by=cls.user,
        )
        cls.obj_list = ItemFactory.create_batch(size=10, meal=cls.meal, food=cls.food)
        cls.valid_data = {
            "meal": cls.meal.pk,
            "food": cls.food.pk,
            "quantity_input": 100,
        }
        cls.other_user_meal_data = {
            "meal": cls.other_user_meal.pk,
            "food": cls.food.pk,
            "quantity_input": 100,
        }

    # Unauthorized requests:
    def test_unauthorized_user_get_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_user_post_request_returns_403(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Authorized user - cannot access list view, but can post:
    def test_authorized_user_get_request_returns_403(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_post_request_returns_201(self):
        response = self.auth_client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authorized_user_invalid_data_post_request_returns_400(self):
        response = self.auth_client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authorized_user_cannot_add_food_to_other_user_meal(self):
        response = self.auth_client.post(self.url, data=self.other_user_meal_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Superuser - can access all views:
    def test_superuser_get_request_returns_200(self):
        response = self.superuser_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ItemDetailViewTestCase(TokenAPITestCase):
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
        cls.food = FoodFactory()
        cls.meal = MealFactory(user=cls.user)
        cls.meal_b = MealFactory(user=cls.user_b)
        cls.item = ItemFactory(meal=cls.meal)
        cls.item_b = ItemFactory(meal=cls.meal_b)
        cls.url = reverse("item-detail", kwargs={"pk": cls.item.pk})
        cls.url_b = reverse("item-detail", kwargs={"pk": cls.item_b.pk})
        cls.valid_data = {
            "meal": cls.meal.pk,
            "food": cls.food.pk,
            "quantity_input": 125,
        }
        cls.other_user_meal_valid_data = {
            "meal": cls.meal_b.pk,
            "food": cls.food.pk,
            "quantity_input": 125,
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

    # Authorized user - get request to other user data allowed:
    # Authorized user - put, patch, delete requests to other data are forbidden:
    def test_authorized_user_get_request_to_other_user_obj_returns_200(self):
        response = self.auth_client.get(self.url_b)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authorized_user_put_request_to_other_user_obj_returns_403(self):
        response = self.auth_client.put(self.url_b)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_patch_request_to_other_user_obj_returns_403(self):
        response = self.auth_client.patch(self.url_b)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_delete_request_to_other_user_obj_returns_403(self):
        response = self.auth_client.delete(self.url_b)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
