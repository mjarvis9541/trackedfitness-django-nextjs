from rest_framework import permissions


class ProfilePermissions(permissions.BasePermission):
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
