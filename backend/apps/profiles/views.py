from django.db.models import F
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.profiles.models import Profile
from apps.profiles.permissions import ProfilePermissions
from apps.profiles.serializers import (
    LimitedProfileSerializer,
    ProfileHeaderSerializer,
    ProfileSerializer,
    ProfileTargetSerializer,
)


class ProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [ProfilePermissions]
    filterset_fields = ["user__is_private"]
    search_fields = ["user__username"]
    lookup_field = "username"

    def get_queryset(self):
        return Profile.objects.select_related("user", "user__target").annotate(
            username=F("user__username")
        )

    def get_serializer_class(self):
        if self.request.user.is_superuser and self.action == "list":
            # Allow full serializer for superuser.
            return ProfileSerializer
        if self.action in ["update_target", "update_target_put"]:
            return ProfileTargetSerializer
        if self.action in ["retrieve", "update", "partial_update"]:
            # Allow full serializer when user is viewing/updating their own.
            return ProfileSerializer
        if self.action == "profile_header":
            return ProfileHeaderSerializer

        return LimitedProfileSerializer

    @action(detail=True, url_path="initial-setup")
    def update_target(self, request, **kwargs):
        """
        Update target based on profile data.
        TODO: Combine both.
        """
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    @update_target.mapping.put
    def update_target_put(self, request, **kwargs):
        """
        Update target based on profile data.
        TODO: Combine both.
        """
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, url_path="profile-header")
    def profile_header(self, request, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
