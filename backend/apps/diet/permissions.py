from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import permissions

User = get_user_model()


class DietPermissions(permissions.BasePermission):
    """Standard list view for all users cannot be viewed."""

    def has_permission(self, request, view):
        # 1. Users must be authenticated
        if not request.user.is_authenticated:
            return False

        # 2. Authorized users can create objects
        if request.user.is_authenticated and request.method == "POST":
            return True

        # 3. Authorized users can access the following views
        if request.user.is_authenticated and view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
        ]:
            return True

        # 4. Superusers can access all views
        if request.user.is_superuser:
            return True

    def has_object_permission(self, request, view, obj):
        # 1. Authorized users can view their own objects
        if request.user == obj.user:
            return True

        # 2. Authorized users can view other user objects if not private
        if not obj.user.is_private and request.method in permissions.SAFE_METHODS:
            return True

        # 3. Superusers can view all objects
        if request.user.is_superuser:
            return True


class DietDayWeekMonthPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1a. Users must be authenticated
        if not request.user.is_authenticated:
            return False

        # 1b. Get user object and set to the view
        username = view.kwargs.get("username")
        user = get_object_or_404(User, username=username)
        view.kwargs["user"] = user

        # 2. Authenticated users can access their own list data
        if request.user.username == user.username:
            return True

        # 3. Authenticated users can access other user list data if not
        # private
        if not user.is_private:
            return True

        # 4. Superusers can access all list data
        if request.user.is_superuser:
            return True
