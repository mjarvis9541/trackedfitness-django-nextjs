from django_filters import rest_framework as filters

from apps.targets.models import Target


class TargetFilter(filters.FilterSet):
    username = filters.CharFilter(
        field_name="user__username", lookup_expr="iexact", distinct=True
    )

    class Meta:
        model = Target
        fields = ["username"]
