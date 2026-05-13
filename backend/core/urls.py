"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, StudentProfileViewSet, TeacherProfileViewSet, AdminProfileViewSet
from courses.views import CourseViewSet, SectionViewSet
from applications.views import PostulationViewSet
from history.views import AssistantHistoryViewSet

# Crear router para ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'student-profiles', StudentProfileViewSet, basename='student-profile')
router.register(r'teacher-profiles', TeacherProfileViewSet, basename='teacher-profile')
router.register(r'admin-profiles', AdminProfileViewSet, basename='admin-profile')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'postulations', PostulationViewSet, basename='postulation')
router.register(r'history', AssistantHistoryViewSet, basename='history')

urlpatterns = [
    path('admin/', admin.site.urls),

    # OAuth Google
    path('auth/', include('social_django.urls', namespace='social')),

    # API REST
    path('api/', include(router.urls)),

    # Rutas propias
    path('users/', include('users.urls')),
]