from rest_framework import mixins, permissions, viewsets

from apps.targets.models import Target
from apps.targets.serializers import (
    LimitedTargetSerializer,
    TargetGramsSerializer,
    TargetSerializer,
)


class TargetPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Authenticated users can view list (limited serializer)
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. Users can act upon their own objects:
        if obj.user == request.user:
            return True

        # 2. Users can view other user objects if not private:
        if request.method in permissions.SAFE_METHODS and not obj.user.is_private:
            return True

        # 3. Superusers can access all objects:
        if request.user.is_superuser:
            return True


class TargetViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [TargetPermissions]
    filterset_fields = ["user__is_private"]
    search_fields = ["user__username"]
    lookup_field = "username"

    def get_queryset(self):
        return (
            Target.objects.select_related("user")
            .get_username()
            .get_grams_per_kg()
            .get_percentage_of_calories()
        )

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            if self.action in ["retrieve", "update", "partial_update"]:
                return TargetGramsSerializer
            return TargetSerializer

        if self.action in ["retrieve", "update", "partial_update"]:
            return TargetGramsSerializer

        return LimitedTargetSerializer


# class TargetViewSet(
#     mixins.RetrieveModelMixin,
#     mixins.UpdateModelMixin,
#     mixins.ListModelMixin,
#     viewsets.GenericViewSet,
# ):
#     # queryset = (
#     #     Target.objects.select_related("user", "user__profile")
#     #     # .get_grams_per_kg()
#     #     .get_percentage_of_calories()
#     # )
#     filterset_fields = ["user__username"]
#     search_fields = ["user__username"]
#     lookup_field = "username"

#     def get_queryset(self):
#         return Target.objects.select_related("user").annotate(
#             username=F("user__username")
#         )

#     def get_serializer_class(self):
#         if self.action in ["grams", "grams_put", "update_target_by_username"]:
#             return TargetGramsSerializer
#         if self.action == "recommended":
#             return TargetRecommendedSerializer
#         if self.action == "reset":
#             return TargetResetSerializer
#         if self.action == "percent":
#             return TargetPercentSerializer
#         if self.action == "custom":
#             return TargetCustomSerializer
#         return TargetSerializer

#     @action(detail=False, permission_classes=[IsAuthenticated], url_path="me")
#     def my_target(self, request):
#         serializer = self.get_serializer(request.user.target)
#         return Response(serializer.data)

#     @action(detail=False, url_path=f"username/{regex}")
#     def username(self, request, **kwargs):
#         user = get_object_or_404(User, username=kwargs.get("username"))
#         obj = self.get_queryset().filter(user=user).get_percentage_of_calories().get()
#         serializer = self.get_serializer(obj)
#         return Response(serializer.data)

#     # @get_target_by_username.mapping.put
#     # def update_target_by_username(self, request, **kwargs):
#     #     obj = get_object_or_404(self.get_queryset().filter(user__username=username))
#     #     serializer = self.get_serializer(instance=obj, data=request.data)
#     #     if serializer.is_valid(raise_exception=True):
#     #         profile = obj.user.profile
#     #         profile.weight = serializer.validated_data["user"]["profile"]["weight"]
#     #         profile.save()
#     #         profile.refresh_from_db()
#     #         obj.set_grams_per_kg(**serializer.validated_data)
#     #         return Response(serializer.data)
#     #     return Response(serializer.errors)

#     @action(detail=True)
#     def grams(self, request, **kwargs):
#         target = self.get_object()
#         serializer = self.get_serializer(target)
#         return Response(serializer.data)

#     @grams.mapping.put
#     def grams_put(self, request, username):
#         target = self.get_object()
#         serializer = self.get_serializer(instance=target, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             profile = target.user.profile
#             profile.weight = serializer.validated_data["user"]["profile"]["weight"]
#             profile.save()
#             profile.refresh_from_db()
#             target.set_grams_per_kg(**serializer.validated_data)
#             return Response(serializer.data)
#         return Response(serializer.errors)

#     @action(detail=True, methods=["put"])
#     def percent(self, request, username):
#         target = self.get_object()
#         serializer = self.get_serializer(instance=target, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             target.set_percent(**serializer.validated_data)
#             return Response(serializer.data)
#         return Response(serializer.errors)

#     @action(detail=True, methods=["put"])
#     def recommended(self, request, username):
#         profile = request.user.profile
#         serializer = self.get_serializer(instance=profile, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors)

#     @action(detail=True, methods=["put"])
#     def reset(self, request, username):
#         target = self.get_object()
#         serializer = self.get_serializer(instance=target, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             target.reset()
#             return Response(serializer.data)
#         return Response(serializer.errors)

#     @action(detail=True, methods=["put"])
#     def custom(self, request, username):
#         target = self.get_object()
#         serializer = self.get_serializer(instance=target, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             target.set_custom(**serializer.validated_data)
#             return Response(serializer.data)
#         return Response(serializer.errors)
