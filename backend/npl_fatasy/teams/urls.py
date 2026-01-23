from django.urls import path
from .views import team_list_api

urlpatterns = [
    path("list/", team_list_api, name="team_list_api"),
]
