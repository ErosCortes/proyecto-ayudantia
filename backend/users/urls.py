from django.urls import path
from .views import oauth_success, logout_user
from .cruds import manage_courses, course_detail, get_tutorship_history

urlpatterns = [
    # Auth views
    path("success/", oauth_success),
    path("logout/", logout_user),
    
    # Tutorship views
    path("tutorship-history/", get_tutorship_history),
    
    # Course views
    path("courses/", manage_courses),
    path("courses/<int:course_id>/", course_detail),
]