from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path, register_converter
from rest_framework.routers import DefaultRouter

from apps.categories import views as category_views
from apps.diet import views as diet_views
from apps.diet_settings import views as diet_settings_views
from apps.diet_targets import views as diet_target_views
from apps.exercises import views as exercise_views
from apps.followers import views as user_following_views
from apps.food import views as food_views
from apps.meals import views as meal_views
from apps.muscle_groups import views as muscle_group_views
from apps.profiles import views as profile_views
from apps.progress import views as progress_views
from apps.targets import views as target_views
from apps.training_plans import views as training_plan_views
from apps.users import views as user_views
from config.converters import DateConverter, UserConverter

register_converter(DateConverter, "date")
register_converter(UserConverter, "user")


router = DefaultRouter()
router.register(r"brands", food_views.BrandViewSet, basename="brand")
router.register(r"categories", category_views.CategoryViewSet, basename="category")
router.register(r"diet", diet_views.DietViewSet, basename="diet")
router.register(
    r"diet-settings",
    diet_settings_views.DietSettingsViewSet,
    basename="dietsettings",
)
router.register(
    r"diet-targets",
    diet_target_views.DailyDietTargetsViewSet,
    basename="dailydiettarget",
)
router.register(r"exercises", exercise_views.ExerciseViewSet, basename="exercise")
router.register(r"food", food_views.FoodViewSet, basename="food")
router.register(r"items", meal_views.ItemViewSet, basename="item")
router.register(r"meals", meal_views.MealViewSet, basename="meal")
router.register(r"profiles", profile_views.ProfileViewSet, basename="profile")
router.register(r"progress", progress_views.ProgressViewSet, basename="progress")
router.register(r"targets", target_views.TargetViewSet, basename="target")
router.register(r"users", user_views.UserViewSet, basename="user")
router.register(
    r"userfollowing",
    user_following_views.UserFollowingViewSet,
    basename="userfollowing",
)
router.register(
    r"training-plans",
    training_plan_views.TrainingPlanViewSet,
    basename="trainingplan",
)
router.register(
    r"workout-plans",
    training_plan_views.WorkoutPlanViewSet,
    basename="workoutplan",
)
router.register(
    r"exercise-plans",
    training_plan_views.ExercisePlanViewSet,
    basename="exerciseplan",
)
router.register(
    r"muscle-groups",
    muscle_group_views.MuscleGroupViewSet,
    basename="musclegroup",
)


urlpatterns = [
    path("user-followings/", user_following_views.UserFollowingAPIView.as_view()),
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path(
        "admin/password_reset/",
        auth_views.PasswordResetView.as_view(),
        name="admin_password_reset",
    ),
    path(
        "admin/password_reset/done/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    # Diet day, week and month read-only views:
    path(
        "diet-day/<str:username>/<date:date>/",
        diet_views.DietDayListView.as_view(),
        name="diet-day",
    ),
    path(
        "diet-week/<str:username>/<date:date>/",
        diet_views.DietWeekListView.as_view(),
        name="diet-week",
    ),
    path(
        "diet-month/<str:username>/<date:date>/",
        diet_views.DietMonthListView.as_view(),
        name="diet-month",
    ),
    # daily diet target read-only views:
    path(
        "diet-targets-day/<str:username>/<date:date>/",
        diet_target_views.DietTargetDayDetailView.as_view(),
        name="diet-targets-day",
    ),
    path(
        "diet-targets-week/<str:username>/<date:date>/",
        diet_target_views.DietTargetWeekListView.as_view(),
        name="diet-targets-week",
    ),
    path(
        "diet-targets-month/<str:username>/<date:date>/",
        diet_target_views.DietTargetMonthListView.as_view(),
        name="diet-targets-month",
    ),
    # Progress day and month read-only views:
    path(
        "progress-day/<str:username>/<date:date>/",
        progress_views.ProgressDayDetailView.as_view(),
        name="progress-day",
    ),
    path(
        "progress-month/<str:username>/<date:date>/",
        progress_views.ProgressMonthListView.as_view(),
        name="progress-month",
    ),
    # Token auth:
    path("auth/token/", user_views.TokenCreateAPIView.as_view(), name="token"),
    path("auth/refresh/", user_views.TokenRefreshAPIView.as_view(), name="refresh"),
    path("auth/logout/", user_views.TokenDeleteAPIView.as_view(), name="delete"),
    # New token auth:
    path(
        "get-next-token/", user_views.NextAuthAPIView.as_view(), name="get-next-token"
    ),
    path("v2/token/", user_views.ObtainTokensAPIView.as_view(), name="obtain-token"),
    path(
        "v2/refresh/",
        user_views.RefreshAccessTokenAPIView.as_view(),
        name="refresh-token",
    ),
    # Debug:
    path("__debug__/", include("debug_toolbar.urls")),
]

urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
