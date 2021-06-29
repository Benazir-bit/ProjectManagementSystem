from rest_framework import routers
from django.urls import path
from .views import ContactsAPI, ThreadListAPI, ChatAPI

app_name = 'chat'

urlpatterns = [
    path('api/contacts/', ContactsAPI.as_view()),
    path('api/threads/', ThreadListAPI.as_view()),
    path('api/thread/messages/', ChatAPI.as_view())
]
