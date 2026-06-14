from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_cursos_ucn),
    path('sync/', views.sync_cursos_ucn),
    path('sync-profesor/', views.sync_profesor_ucn),
]