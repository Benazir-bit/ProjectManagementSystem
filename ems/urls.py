"""ems URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
import django.contrib.auth.views as auth_views
from django.conf.urls import url
import uspl.views
from django.conf.urls.static import static
from django.conf import settings
from .views import index

"""
urlpatterns = [
    path('', uspl.views.home),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('uspl/', include("uspl.urls")),
    path('notifications/', include('notify.urls', 'notifications')),
    path('weekly_status/', include('weekly_status.urls', 'weekly_status')),
    path('admin/', admin.site.urls),
    path('password_reset/', auth_views.PasswordResetView.as_view(),
         name='password_reset'),
    path('password_reset/done/', auth_views.PasswordChangeDoneView,
         name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.PasswordResetConfirmView, name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView,
         name='password_reset_complete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
"""
urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path('uspl/', include("uspl.urls")),
    path('notifications/', include("notification.urls")),
    path('weekly_status/', include("weekly_status.urls")),
    path('chat/', include("chat.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
