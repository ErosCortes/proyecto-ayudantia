from django.urls import path
from .views import oauth_success

urlpatterns = [
    path("success/", oauth_success),
]