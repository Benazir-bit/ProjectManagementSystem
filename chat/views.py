from .serializers import UserSerializer, ThreadSerializer, ChatSerializer
from django.contrib.auth.models import User
from .models import Thread, Chat, Image
from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.pagination import LimitOffsetPagination
from django.db.models import Q
# from .serializers import NotificationSerializer


class ContactsAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        users = User.objects.all().exclude(id=self.request.user.id)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class ThreadListAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        threads = request.user.thread_set.all()
        serializer = ThreadSerializer(
            threads, many=True, context={'user': request.user, "new": False})
        return Response(serializer.data)


class ChatAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        user1 = User.objects.filter(id=request.user.id)
        user2 = User.objects.filter(id=request.GET.get('other_user'))

        threads = Thread.objects.filter(
            users__in=user1).filter(users__in=user2)
        if threads:
            thread_obj = threads[0]
            chats = thread_obj.chat_set.all()[:10]
            serializer = ChatSerializer(chats, many=True)
            return Response(serializer.data)
        else:
            return Response(None)
