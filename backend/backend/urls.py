from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from core.api.viewsets import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token-auth/', views.obtain_auth_token),
    path('api/', include(router.urls)),
]
