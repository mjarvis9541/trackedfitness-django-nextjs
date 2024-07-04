from django_filters import rest_framework as filters

from apps.profiles.models import Profile


class ProfileFilter(filters.FilterSet):
    username = filters.CharFilter(field_name="user__username", lookup_expr="iexact")

    class Meta:
        model = Profile
        fields = ["username"]
