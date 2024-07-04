import django_filters

from .models import Brand, Food


class BrandFilter(django_filters.FilterSet):
    class Meta:
        model = Brand
        fields = {
            "name": ["icontains"],
        }


class FoodFilter(django_filters.FilterSet):
    class Meta:
        model = Food
        fields = {
            "name": ["icontains"],
            "brand__name": ["icontains"],
            "energy": ["lt", "gt"],
            "fat": ["lt", "gt"],
            "saturates": ["lt", "gt"],
            "carbohydrate": ["lt", "gt"],
            "sugars": ["lt", "gt"],
            "fibre": ["lt", "gt"],
            "protein": ["lt", "gt"],
            "salt": ["lt", "gt"],
            "source": ["icontains"],
            "created_by__username": ["iexact"],
            "updated_by__username": ["iexact"],
        }
