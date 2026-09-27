from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomLoginView,
    CurrentUserView,
    ChooseRoleView,
    LogoutView,
    AdminUserListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomLoginView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', CurrentUserView.as_view(), name='auth_me'),
    path('choose-role/', ChooseRoleView.as_view(), name='auth_choose_role'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('users/', AdminUserListView.as_view(), name='admin_users_list'),
]
