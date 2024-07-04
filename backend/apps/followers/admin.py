from django.contrib import admin

from apps.followers.models import UserFollowing


@admin.register(UserFollowing)
class UserFollowingAdmin(admin.ModelAdmin):
    list_display = [
        "__str__",
        "user",
        "following",
        "pending",
        "created_at",
    ]
