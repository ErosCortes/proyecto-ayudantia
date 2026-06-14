from django.urls import path
from .views import oauth_success, logout_user

urlpatterns = [
    path("success/", oauth_success, name='oauth_success'),
    path("logout/", logout_user, name='logout'),
]