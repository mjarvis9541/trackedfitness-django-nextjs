import datetime
import time

import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import urlsafe_base64_decode
from rest_framework import exceptions, serializers

from apps.followers.models import UserFollowing
from apps.followers.serializers import FollowersSerializer, FollowingSerializer

User = get_user_model()


class LimitedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "username", "is_private")
        read_only_fields = ("username",)


class UserSerializer(serializers.ModelSerializer):
    profile_id = serializers.ReadOnlyField(source="profile.id")
    target_id = serializers.ReadOnlyField(source="target.id")
    profile_url = serializers.HyperlinkedIdentityField(
        view_name="profile-detail", lookup_field="username"
    )
    target_url = serializers.HyperlinkedIdentityField(
        view_name="target-detail", lookup_field="username"
    )
    is_followed = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    follower_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()

    class Meta:
        model = User

        fields = (
            "id",
            "profile_id",
            "target_id",
            "name",
            "username",
            "email",
            "initial",
            "is_active",
            "is_private",
            "is_verified",
            "is_staff",
            "is_followed",
            "followers",
            "following",
            "follower_count",
            "following_count",
            "is_superuser",
            "profile_url",
            "target_url",
            "url",
            "date_joined",
            "last_login",
        )
        read_only_fields = (
            "is_staff",
            "is_superuser",
            "last_login",
            "date_joined",
        )
        extra_kwargs = {
            "url": {"view_name": "user-detail", "lookup_field": "username"},
        }

    def get_is_followed(self, obj):
        request_user = self.context["request"].user
        if UserFollowing.objects.filter(
            user_id=request_user.id, following_id=obj.id
        ).exists():
            return True
        return False

    def get_following(self, obj):
        return FollowingSerializer(
            obj.following.following_username(),
            many=True,
            context={"request": self.context["request"]},
        ).data

    def get_followers(self, obj):
        return FollowersSerializer(
            obj.followers.user_username(),
            many=True,
            context={"request": self.context["request"]},
        ).data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = ("name", "username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(is_active=False, **validated_data)
        user.send_activation_email()
        return user


class ResendActivationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "This email address is not registered to any account."
            )
        if user.is_verified:
            raise serializers.ValidationError(
                "This account has already been activated."
            )
        data["user"] = user
        return data

    def save(self):
        user = self.validated_data["user"]
        return user.send_activation_email()


class NextAuthTokenSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    username = serializers.ReadOnlyField()
    access = serializers.ReadOnlyField()
    expires_at = serializers.ReadOnlyField()

    def validate(self, data):
        user = authenticate(
            request=self.context["request"],
            email=data["email"],
            password=data["password"],
        )
        if user is None:
            raise serializers.ValidationError(
                "Please enter a correct email and password. Note that both fields may be case-sensitive.",
                code="authorization",
            )
        if not user.is_active:
            raise serializers.ValidationError("User inactive or deleted.")

        now = datetime.datetime.now(tz=datetime.timezone.utc)
        token_exp = now + datetime.timedelta(minutes=120)
        domain = "trackedfitness.com"
        iat = round(time.mktime(now.timetuple()))
        exp = round(time.mktime(token_exp.timetuple()))
        payload = {
            "iss": domain,
            "iat": iat,
            "exp": exp,
            "uid": user.id,
            "token_type": "access",
        }
        data["id"] = user.id
        data["username"] = user.username
        data["access"] = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        data["expires_at"] = exp
        return data


class TokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    username = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField()
    initials = serializers.ReadOnlyField()
    last_login = serializers.ReadOnlyField()
    access_exp = serializers.ReadOnlyField()
    refresh_exp = serializers.ReadOnlyField()

    access = serializers.ReadOnlyField()
    refresh = serializers.ReadOnlyField()

    def validate(self, data):
        request = self.context["request"]
        user = authenticate(
            request=request, email=data["email"], password=data["password"]
        )
        if user is None:
            raise serializers.ValidationError(
                "Please enter a correct email and password. Note that both fields may be case-sensitive.",
                code="authorization",
            )
        if not user.is_active:
            raise serializers.ValidationError("User inactive or deleted.")

        user.last_login = timezone.now()
        user.save()

        now = datetime.datetime.now(tz=datetime.timezone.utc)
        acc = now + datetime.timedelta(minutes=1)
        ref = now + datetime.timedelta(days=5)

        data["name"] = user.name
        data["username"] = user.username
        data["email"] = user.email
        data["initials"] = user.initial
        data["last_login"] = user.last_login
        data["access_exp"] = round(time.mktime(acc.timetuple())) * 1000
        data["refresh_exp"] = round(time.mktime(ref.timetuple())) * 1000

        data["access"] = user.create_token(token_type="access")
        data["refresh"] = user.create_token(token_type="refresh")
        return data


class RefreshTokenSerializer(serializers.Serializer):
    email = serializers.ReadOnlyField()
    username = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField()
    initials = serializers.ReadOnlyField()
    last_login = serializers.ReadOnlyField()
    access_exp = serializers.ReadOnlyField()
    refresh_exp = serializers.ReadOnlyField()

    access = serializers.ReadOnlyField()
    refresh = serializers.ReadOnlyField()

    def validate(self, data):
        user = self.context["request"].user
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        acc = now + datetime.timedelta(minutes=1)
        ref = now + datetime.timedelta(days=5)

        data["name"] = user.name
        data["username"] = user.username
        data["email"] = user.email
        data["initials"] = user.initial
        data["last_login"] = user.last_login
        data["access_exp"] = round(time.mktime(acc.timetuple())) * 1000
        data["refresh_exp"] = round(time.mktime(ref.timetuple())) * 1000

        data["access"] = user.create_token(token_type="access")
        data["refresh"] = user.create_token(token_type="refresh")
        return data


class DeleteTokenSerializer(serializers.Serializer):
    refresh = serializers.ReadOnlyField(default=None)


class RefreshAccessTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    email = serializers.ReadOnlyField()
    username = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField()
    initials = serializers.ReadOnlyField()
    last_login = serializers.ReadOnlyField()
    access_exp = serializers.ReadOnlyField()
    refresh_exp = serializers.ReadOnlyField()

    access = serializers.ReadOnlyField()

    def validate(self, data):
        try:
            decoded_token = jwt.decode(
                data["refresh"],
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

        now = datetime.datetime.now(tz=datetime.timezone.utc)
        acc = now + datetime.timedelta(minutes=1)
        ref = now + datetime.timedelta(days=5)

        data["name"] = user.name
        data["username"] = user.username
        data["email"] = user.email
        data["initials"] = user.initial
        data["last_login"] = user.last_login
        data["access_exp"] = round(time.mktime(acc.timetuple())) * 1000
        data["refresh_exp"] = round(time.mktime(ref.timetuple())) * 1000

        data["access"] = user.create_token(token_type="access")
        data["refresh"] = user.create_token(token_type="refresh")
        return data


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        try:
            data["user"] = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "Email does not exist."})
        return data

    def save(self):
        user = self.validated_data["user"]
        return user.send_password_reset_email()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )
    token = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )

    name = serializers.ReadOnlyField()
    initials = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    last_login = serializers.ReadOnlyField()
    access = serializers.ReadOnlyField()
    access_exp = serializers.ReadOnlyField()
    refresh_exp = serializers.ReadOnlyField()

    def validate(self, data):
        try:
            user = User.objects.get(pk=urlsafe_base64_decode(data["uid"]).decode())
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        except (
            OverflowError,
            UnicodeDecodeError,
            ValueError,
        ) as e:
            raise serializers.ValidationError("Invalid uid.")

        token_valid = default_token_generator.check_token(user, data["token"])
        if not token_valid:
            raise serializers.ValidationError("Invalid password reset token.")

        now = datetime.datetime.now(tz=datetime.timezone.utc)
        acc = now + datetime.timedelta(minutes=10)
        ref = now + datetime.timedelta(days=5)

        data["user"] = user
        data["email"] = user.email
        data["initials"] = user.initials
        data["name"] = user.name
        data["username"] = user.username
        data["last_login"] = user.last_login
        data["access_exp"] = round(time.mktime(acc.timetuple())) * 1000
        data["refresh_exp"] = round(time.mktime(ref.timetuple())) * 1000

        data["access"] = user.create_token(token_type="access")
        data["refresh"] = user.create_token(token_type="refresh")
        return data

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["password"])
        user.save()


class UserActivateSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    username = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField()
    initials = serializers.ReadOnlyField()
    last_login = serializers.ReadOnlyField()
    access_exp = serializers.ReadOnlyField()
    refresh_exp = serializers.ReadOnlyField()

    access = serializers.ReadOnlyField()
    refresh = serializers.ReadOnlyField()

    def validate(self, data):
        try:
            decoded_uid = urlsafe_base64_decode(data["uid"]).decode()
            user = User.objects.get(pk=decoded_uid)
        except User.DoesNotExist as e:
            raise serializers.ValidationError("Invalid uid.")
        except (
            OverflowError,
            UnicodeDecodeError,
            ValueError,
        ) as e:
            raise serializers.ValidationError("Invalid activation token.")

        token_valid = default_token_generator.check_token(user, data["token"])
        if not token_valid:
            raise serializers.ValidationError("Invalid activation token.")

        if user.is_verified:
            raise serializers.ValidationError(
                "This account has already been activated."
            )

        user.is_active = True
        user.is_verified = True
        user.last_login = timezone.now()
        user.save()

        now = datetime.datetime.now(tz=datetime.timezone.utc)
        acc = now + datetime.timedelta(minutes=10)
        ref = now + datetime.timedelta(days=5)

        data["name"] = user.name
        data["username"] = user.username
        data["email"] = user.email
        data["initials"] = user.initial
        data["last_login"] = user.last_login
        data["access_exp"] = round(time.mktime(acc.timetuple())) * 1000
        data["refresh_exp"] = round(time.mktime(ref.timetuple())) * 1000

        data["access"] = user.create_token(token_type="access")
        data["refresh"] = user.create_token(token_type="refresh")
        return data

    def save(self):
        return


class PasswordChangeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    new_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = ("password", "new_password")

    def validate_password(self, value):
        if not self.instance.check_password(value):
            raise serializers.ValidationError("Incorrect password.")
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()
        return instance


class ChangeUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]
