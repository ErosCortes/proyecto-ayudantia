from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserViewSet, StudentProfileViewSet, TeacherProfileViewSet, AdminProfileViewSet, RegisterView, LoginView
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
    path('api/', include(router.urls)),
    path('api/courses-ucn/', include('courses.urls')),
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
