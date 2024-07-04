from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import permissions

User = get_user_model()


class IsDetailOrNone(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.method == "POST" and request.user.is_authenticated:
            return True
        if view.action in [
            "retrieve",
            "update",
            "partial_update",
        ]:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user == obj.user:
            return True


class ObjectOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if view.action == "list":
            return False
        if request.user.is_authenticated and view.action in [
            "update",
            "create",
            "retrieve",
            "password_change",
        ]:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if view.action == "create":
            return True
        if request.user.is_superuser:
            return True
        if request.user == obj:
            return True


class IsPrivateList(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        username = request.parser_context.get("kwargs").get("username")
        if username and request.user.username == username:
            return True
        if username:
            user = get_object_or_404(User, username=username)
            if not user.is_private:
                return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.user == obj.user:
            return True
        if not obj.user.is_private:
            return True


class IsPrivate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.user == obj.user:
            return True
        if not obj.user.is_private:
            return True
        return False


class IsCreatedByOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            # Allows viewing the object:
            return True
        return obj.user == request.user


class ObjectAndParentIsCreatedByOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user
