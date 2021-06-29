from rest_framework import routers
from django.urls import path
from .views import NotificationAPI

app_name = 'notification'

urlpatterns = [
    path('api/tray-ntfs/', NotificationAPI.as_view())
]
