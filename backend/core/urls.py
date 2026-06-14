from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, StudentProfileViewSet, TeacherProfileViewSet, AdminProfileViewSet
from courses.views import CourseViewSet, SectionViewSet
from applications.views import PostulationViewSet
from history.views import AssistantHistoryViewSet

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
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/', include(router.urls)),
    path('api/courses-ucn/', include('courses.urls')),  
    path('users/', include('users.urls')),
]