from django.conf.urls import url, include
from . import views
from rest_framework import routers
from .api import *
from knox import views as knox_views
from django.urls import path

app_name = 'weekly_status'

urlpatterns = [
 path('api/weeklystatusreport/', WeeklystatusreportAPI.as_view()),
  path('api/weeklystatusreportlist/', WeeklystatusreportListAPI.as_view()),
]
# urlpatterns = [
#     url(r'^inbox/', views.inbox, name="inbox"),
#     url(r'^sent/', views.sent, name="sent_reports"),
#     url(r'^new_status/', views.new_status, name="new_status"),
#     url(r'^weekly_status/(?P<status_id>[0-9]+)', views.status_report, name="status_report"),
#     url(r'^feedback/(?P<feedback_id>[0-9]+)', views.feedback, name="feedback"),
#     url(r'^weekly_status/summary', views.summary, name="summary"),
#     url(r'^ajax/summary/get_employee_list', views.get_employee_list, name="get_employee_list"),
#     url(r'^ajax/summary/get_summary', views.get_summary, name="get_summary"),
#     url(r'^ajax/mail/get_unread_mail', views.get_unread_mail, name="get_unread_mail"),
# ]
    
