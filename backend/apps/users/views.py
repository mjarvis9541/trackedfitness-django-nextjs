from django.contrib.auth import get_user_model
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.followers.serializers import FollowersSerializer, FollowingSerializer
from apps.users.permissions import UserPermissions
from apps.users.serializers import (
    ChangeUsernameSerializer,
    DeleteTokenSerializer,
    LimitedUserSerializer,
    NextAuthTokenSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetSerializer,
    RefreshAccessTokenSerializer,
    RefreshTokenSerializer,
    RegisterSerializer,
    ResendActivationEmailSerializer,
    TokenSerializer,
    UserActivateSerializer,
    UserSerializer,
)
from config.authentication import RefreshTokenAuthentication

User = get_user_model()


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [UserPermissions]
    search_fields = ["username", "email"]
    lookup_field = "username"

    def get_queryset(self):
        return (
            User.objects.select_related("profile", "target")
            .follower_count()
            .following_count()
            .order_by("id")
        )

    def get_serializer_class(self):
        if self.action == "password_reset":
            return PasswordResetSerializer
        if self.action == "password_reset_confirm":
            return PasswordResetConfirmSerializer
        if self.action == "create" and not self.request.user.is_superuser:
            return RegisterSerializer
        if self.action == "password_change":
            return PasswordChangeSerializer
        if self.action == "change_username":
            return ChangeUsernameSerializer
        if self.action == "activate":
            return UserActivateSerializer
        if self.action == "resend_activation_email":
            return ResendActivationEmailSerializer
        if self.action == "following":
            return FollowingSerializer
        if self.action == "followers":
            return FollowersSerializer
        if self.request.user.is_superuser:
            return UserSerializer

        return LimitedUserSerializer

    @action(detail=True)
    def following(self, request, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj.following.following_username(), many=True)
        return Response(serializer.data)

    @action(detail=True)
    def followers(self, request, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj.followers.user_username(), many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["put"],
        url_path="password-change",
    )
    def password_change(self, request, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[],
        url_path="password-reset",
    )
    def password_reset(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[],
        url_path="password-reset-confirm",
    )
    def password_reset_confirm(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[],
        url_path="activate",
    )
    def activate(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response(serializer.data)
        if response.data.get("refresh"):
            User.set_refresh_token(response)
        return response

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[],
        url_path="resend-activation-email",
    )
    def resend_activation_email(self, request):
        """
        Allow the user to re-request an activation email if not already verified.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["put"],
        url_path="change-username",
    )
    def change_username(self, request):
        serializer = self.get_serializer(instance=request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TokenCreateAPIView(generics.GenericAPIView):
    permission_classes = []
    serializer_class = TokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = Response(serializer.data)
        if response.data.get("refresh"):
            User.set_refresh_token(response)
        return response


class TokenRefreshAPIView(generics.GenericAPIView):
    authentication_classes = [RefreshTokenAuthentication]
    serializer_class = RefreshTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = Response(serializer.data)
        if response.data.get("refresh"):
            User.set_refresh_token(response)
        return response


class TokenDeleteAPIView(generics.GenericAPIView):
    authentication_classes = [RefreshTokenAuthentication]
    serializer_class = DeleteTokenSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            {"refresh": request.COOKIES.get("refresh_token")}
        )
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if request.COOKIES.get("refresh_token"):
            response = Response(status.HTTP_200_OK)
            response.delete_cookie("refresh_token", samesite="none")
            return response
        return Response(
            {"data": "no refresh token in the request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ObtainTokensAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = TokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class NextAuthAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = NextAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class RefreshAccessTokenAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = RefreshAccessTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
