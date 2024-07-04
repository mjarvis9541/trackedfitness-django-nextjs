from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from apps.users.models import User


class UserFollowingInline(admin.TabularInline):
    extra = 3
    fk_name = "user"
    model = User.connections.through


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [UserFollowingInline]
    list_display = [
        "username",
        "email",
        "name",
        "is_active",
        "is_private",
        "is_verified",
        "is_staff",
        "is_superuser",
        "last_login",
        "date_joined",
    ]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "username",
                    "email",
                    "password",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_private",
                    "is_verified",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            _("Security"),
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )
    readonly_fields = [
        "last_login",
        "date_joined",
        "is_staff",
        "is_superuser",
        "is_verified",
    ]
