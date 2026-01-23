from django.urls import path
from .views import match_list_api

urlpatterns = [
    
    path("", match_list_api, name="match_list_api"),
]
