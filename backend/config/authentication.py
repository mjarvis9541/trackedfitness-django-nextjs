import datetime

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, exceptions

User = get_user_model()


class AccessTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization")
        if not header:
            return None
        auth = header.split()
        if len(auth) == 1:
            raise exceptions.AuthenticationFailed(_("Invalid Authorization header."))
        elif len(auth) > 2:
            raise exceptions.AuthenticationFailed(
                _(
                    "Invalid Authorization header. Token string should not contain spaces."
                )
            )
        token = auth[1]
        try:
            decoded_token = jwt.decode(
                token,
                key=settings.SECRET_KEY,
                issuer="trackedfitness.com",
                leeway=datetime.timedelta(seconds=10),
                algorithms=["HS256"],
            )
        except Exception as e:
            raise exceptions.AuthenticationFailed(e)

        token_type = decoded_token.get("token_type")
        if token_type != "access":
            raise exceptions.AuthenticationFailed(_("Invalid token type."))
        uid = decoded_token.get("uid")
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(_("User not found."))
        if not user.is_active:
            raise exceptions.AuthenticationFailed(_("Invalid user."))
        return (user, None)

    def authenticate_header(self, request):
        return 'JWT realm="api"'


class RefreshTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("refresh_token")
        if not token:
            raise exceptions.AuthenticationFailed(_("No token in the request."))
        try:
            decoded_token = jwt.decode(
                token,
                key=settings.SECRET_KEY,
                issuer="trackedfitness.com",
                leeway=datetime.timedelta(seconds=10),
                algorithms=["HS256"],
            )
        except Exception as e:
            raise exceptions.AuthenticationFailed(e)
        token_type = decoded_token.get("token_type")
        if token_type != "refresh":
            raise exceptions.AuthenticationFailed(_("Invalid token type."))
        uid = decoded_token.get("uid")
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(_("User not found."))
        if not user.is_active:
            raise exceptions.AuthenticationFailed(_("User inactive or deleted."))
        return (user, None)

    def authenticate_header(self, request):
        return 'JWT realm="api"'
