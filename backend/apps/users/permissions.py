from rest_framework import permissions


class UserPermissions(permissions.BasePermission):
    """
    Limited serializers for all non-staff/non-superuser
    """

    def has_permission(self, request, view):
        # 1. Users can access retrieve, update, and password change views:
        if request.user.is_authenticated and view.action in [
            "retrieve",
            "update",
            "partial_update",
            "password_change",
        ]:
            return True

        # 2. Superusers can access all views:
        if request.user.is_superuser:
            return True

        # 3. Unauthenticated users can create:
        if not request.user.is_authenticated and view.action in [
            "create",
        ]:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. users can act upon their own objects:
        if request.user == obj:
            return True
        # 2. Superusers can act upon all objects:
        if request.user.is_superuser:
            return True
