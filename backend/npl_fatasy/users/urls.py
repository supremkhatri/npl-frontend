from django.urls import path
from .views import register, login_view, logout_view, csrf, session_view

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("csrf/", csrf, name="csrf"),
    path("session/", session_view, name="session"),
]
