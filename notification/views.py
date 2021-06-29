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

from .models import Notification
from .serializers import NotificationSerializer


class NotificationAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        ntfs = Notification.objects.filter(recipient=request.user)[:20]
        unread_count = Notification.objects.filter(
            recipient=request.user).filter(read=False).count()
        serializer = NotificationSerializer(ntfs, many=True)
        return Response({
            "unread_count": unread_count,
            "notifications": serializer.data
        })
