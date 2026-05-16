from django.urls import path
from .views import oauth_success

from .views import (
    get_tutorships,
    get_applications
)

urlpatterns = [
    path("success/", oauth_success),
    path('tutorships/',get_tutorships),
    path('applications/', get_applications)
]