from django.contrib.auth.models import User, Group
from .models import *
from uspl.models import Project, Task, Issue, Feedback
from uspl.models import Reply as Fd_reply
from itertools import chain
from operator import attrgetter
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken
from .serializers import *
from uspl.serializers import FeedbackSerializer, ReplySerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.core.exceptions import PermissionDenied
# from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# Pagination for REST FRAMEWORK TAKEN
from rest_framework.pagination import LimitOffsetPagination


# class FeedbackAPI(APIView):
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]


class WeeklystatusreportListAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    def get(self, request):
        if request.GET.get('type') == 'inbox':
            all_status = WorkStatus.objects.filter(recipent = request.user).filter(sent=True)
            own_task_feedbacks = Feedback.objects.filter(task__assigned_to=request.user)
            replies = Fd_reply.objects.filter(feedback__task__project__supervisor=request.user)
            # messages = sorted(chain(all_status, own_task_feedbacks, replies), key=attrgetter('updated'), reverse=True)
            messages = sorted(chain(all_status), key=attrgetter('updated'), reverse=True)
            # print(messages)
            if request.GET.get('offset'):
                paginator = LimitOffsetPagination()
                result_page = paginator.paginate_queryset(messages, request)
                serializer = WeeklystatusreportSerializer(
                    result_page, many=True, context={'request': request})
                # all_list=[]
                # paginator = LimitOffsetPagination()
                # result_page = paginator.paginate_queryset(messages, request)
                # for message in result_page:
                #     if message.get_type() == 'status':
                #         serializer = WeeklystatusreportSerializer(message, context={'request': request})
                #         all_list.append(serializer.data)
                #     if message.get_type() == 'feedback':
                #         serializer = FeedbackSerializer(message, context={'request': request})
                #         all_list.append(serializer.data)
                #     if message.get_type() == 'fdreply':
                #         serializer = ReplySerializer(message, context={'request': request})
                #         all_list.append(serializer.data)

                return paginator.get_paginated_response(serializer.data)
            else:
                serializer = WeeklystatusreportSerializer(
                    all_status, many=True, context={'request': request})
                return Response(serializer.data)

        if request.GET.get('type') == 'sent':
            all_status = WorkStatus.objects.filter(sender = request.user).filter(sent=True)
            feedbacks = Feedback.objects.filter(task__project__supervisor=request.user)
            replies = Fd_reply.objects.filter(feedback__task__assigned_to=request.user)
            # messages = sorted(chain(all_status, feedbacks, replies), key=attrgetter('updated'), reverse=True)
            messages = sorted(chain(all_status), key=attrgetter('updated'), reverse=True)
            if request.GET.get('offset'):
                paginator = LimitOffsetPagination()
                result_page = paginator.paginate_queryset(messages, request)
                serializer = WeeklystatusreportSerializer(
                    result_page, many=True, context={'request': request})
                # all_list=[]
                # paginator = LimitOffsetPagination()
                # result_page = paginator.paginate_queryset(messages, request)
                # for message in result_page:
                #     if message.get_type() == 'status':
                #         serializer = WeeklystatusreportSerializer(message, context={'request': request})
                #         all_list.append(serializer.data)
                #     if message.get_type() == 'feedback':
                #         serializer = FeedbackSerializer(message, context={'request': request})
                #         all_list.append(serializer.data)
                #     if message.get_type() == 'fdreply':
                #         serializer = ReplySerializer(message, context={'request': request})
                #         all_list.append(serializer.data)                
                return paginator.get_paginated_response(serializer.data)
            else:
                serializer = WeeklystatusreportSerializer(
                    all_status, many=True, context={'request': request})
                return Response(serializer.data)

class WeeklystatusreportAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    def get(self, request):
        if request.GET.get('type') == 'draft':
            if WorkStatus.objects.filter(sender=request.user).filter(sent=False).exists():
                draftReport = WorkStatus.objects.filter(sender=request.user).filter(sent=False)[0]
                draftReport_serializer = WeeklystatusreportSerializer(draftReport)
                activity_completed = ActivityCompleted.objects.filter(workstatus=draftReport)
                activity_completed_serializer = ActivityCompletedSerializer(activity_completed, many=True)
                activity_progress = ActivityInProgress.objects.filter(workstatus=draftReport)
                activity_progress_serializer = ActivityInProgressSerializer(activity_progress, many=True)
                activity_nextWeek = ActivityNextWeek.objects.filter(workstatus=draftReport)
                activity_nextWeek_serializer = ActivityNextWeekSerializer(activity_nextWeek, many=True)
                issue = Issue.objects.filter(workstatus=draftReport)
                issue_serializer = IssueSerializer(issue, many=True)
                            
                return Response({'workreport': draftReport_serializer.data, 'activity_completed': activity_completed_serializer.data, 'activity_progress': activity_progress_serializer.data,
                'activity_nextWeek':activity_nextWeek_serializer.data,'issue':issue_serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return Response(None, status=status.HTTP_201_CREATED)
 
        if request.GET.get('type') == 'report':
            report = WorkStatus.objects.get(id=request.GET.get('id'))
            report_serializer = WeeklystatusreportSerializer(report)
            activity_completed = ActivityCompleted.objects.filter(workstatus=report)
            activity_completed_serializer = ActivityCompletedSerializer(activity_completed, many=True)
            activity_progress = ActivityInProgress.objects.filter(workstatus=report)
            activity_progress_serializer = ActivityInProgressSerializer(activity_progress, many=True)
            activity_nextWeek = ActivityNextWeek.objects.filter(workstatus=report)
            activity_nextWeek_serializer = ActivityNextWeekSerializer(activity_nextWeek, many=True)
            issue = Issue.objects.filter(workstatus=report)
            issue_serializer = IssueSerializer(issue, many=True)
                        
            return Response({'workreport': report_serializer.data, 'activity_completed': activity_completed_serializer.data, 'activity_progress': activity_progress_serializer.data,
            'activity_nextWeek':activity_nextWeek_serializer.data,'issue':issue_serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(None, status=status.HTTP_201_CREATED)
        
        
             

    def post(self, request):
        if WorkStatus.objects.filter(sender=request.user).filter(sent=False).exists():
            temp_status = WorkStatus.objects.filter(sender=request.user).filter(sent=False)[0]
            temp_status.delete()
                    
        if request.data.get('weekly'):
            report_type = 'weekly'
            week = request.data.get('date')
            from_date =None
            to_date=None
            month = None
            
        elif request.data.get('monthly'):
            report_type = 'monthly'
            week = None
            from_date = None
            to_date = None
            month = request.data.get('date')
        elif request.data.get('isRange'):
            report_type = 'range'
            week = None
            from_date = request.data.get('date')[0]
            to_date = request.data.get('date')[1]
            month = None
            
        to_id=[]
        for username in request.data.get('to'):
            user= User.objects.get(username= username)
            to_id.append(user.id)
        cc_id = []
        if request.data.get('cc'):
            for username in request.data.get('cc'):
                user= User.objects.get(username= username)
                cc_id.append(user.id)
        print(to_id, cc_id)
        work_status_data = {
            'sender': request.user.id,
            'recipent': to_id,
            'cc_list': cc_id,
            "sent": True,
            'report_type': report_type,
            'week': week,
            'from_date': from_date,
            'to_date': to_date,
            'month':month
        }
        serializer = WeeklystatusreportPostSerializer(data=work_status_data, partial=True)
        if serializer.is_valid():
            workstatus = serializer.save(timestamp=timezone.now(), updated=timezone.now())
            
            if request.data.get('data_completed'):
                for activity_completed in request.data.get('data_completed'):
                    activity_completed_data = {
                      'workstatus':workstatus.id,
                      'task': activity_completed['task'],
                      'description':activity_completed['description_of_effort']                        
                    }
                    activity_completedSerializer = ActivityCompletedSerializer(data=activity_completed_data)
                    if activity_completedSerializer.is_valid():
                        activity_completedSerializer.save()
                        
            if request.data.get('data_progress'):
                for data_progress in request.data.get('data_progress'):
                    data_progress_data = {
                        'workstatus': workstatus.id,
                        'current': data_progress['activities_in_progress'],
                        'next': data_progress['next_action'],
                        'due_date':data_progress['due_date']
                    }
                    data_progressSerializer = ActivityInProgressSerializer(data=data_progress_data)
                    if data_progressSerializer.is_valid():
                        data_progressSerializer.save()
            if request.data.get('data_next_week'):
                for data_next_week in request.data.get('data_next_week'):
                    data_next_week_data = {
                                            'workstatus': workstatus.id,
                                            'task': data_next_week['task3'],
                                            'description':data_next_week['description_of_effort3']
                                        }
                    data_next_weekSerializer = ActivityNextWeekSerializer(data=data_next_week_data)
                    if data_next_weekSerializer.is_valid():
                        data_next_weekSerializer.save()
            if request.data.get('data_issue'):
                for data_issue in request.data.get('data_issue'):
                    data_issue_data = {
                       'workstatus': workstatus.id,
                       'name': data_issue['issue_name'],
                       'description':data_issue['description_of_issue']
                    }
                 
                    data_issueSerializer = IssueSerializer(data=data_issue_data)
                    if data_issueSerializer.is_valid():
                        data_issueSerializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        if WorkStatus.objects.filter(sender=request.user).filter(sent=False).exists():
            temp_status = WorkStatus.objects.filter(sender=request.user).filter(sent=False)[0]
            temp_status.delete()
        
        if request.data.get('weekly'):
            report_type = 'weekly'
            week = request.data.get('date')
            from_date =None
            to_date=None
            month = None
            
        elif request.data.get('monthly'):
            report_type = 'monthly'
            week = None
            from_date = None
            to_date = None
            month = request.data.get('date')
        elif request.data.get('isRange'):
            report_type = 'range'
            week = None
            from_date = request.data.get('date')[0]
            to_date = request.data.get('date')[1]
            month = None
            
        to_id=[]
        for username in request.data.get('to'):
            user= User.objects.get(username= username)
            to_id.append(user.id)
        cc_id = []
        if request.data.get('cc'):
            for username in request.data.get('cc'):
                user= User.objects.get(username= username)
                cc_id.append(user.id)
        print(to_id, cc_id)
        work_status_data = {
            'sender': request.user.id,
            'recipent': to_id,
            'cc_list': cc_id,
            "sent": False,
            'report_type': report_type,
            'week': week,
            'from_date': from_date,
            'to_date': to_date,
            'month':month
        }
        
        serializer = WeeklystatusreportPostSerializer(data=work_status_data, partial=True)

        if serializer.is_valid():
            workstatus = serializer.save(timestamp=timezone.now(), updated=timezone.now())
            
            if request.data.get('data_completed'):
                for activity_completed in request.data.get('data_completed'):
                    activity_completed_data = {
                      'workstatus':workstatus.id,
                      'task': activity_completed['task'],
                      'description':activity_completed['description_of_effort']                        
                    }
                    activity_completedSerializer = ActivityCompletedSerializer(data=activity_completed_data)
                    if activity_completedSerializer.is_valid():
                        activity_completedSerializer.save()
                        
            if request.data.get('data_progress'):
                for data_progress in request.data.get('data_progress'):
                    data_progress_data = {
                        'workstatus': workstatus.id,
                        'current': data_progress['activities_in_progress'],
                        'next': data_progress['next_action'],
                        'due_date':data_progress['due_date']
                    }
                    data_progressSerializer = ActivityInProgressSerializer(data=data_progress_data)
                    if data_progressSerializer.is_valid():
                        data_progressSerializer.save()
                    else:
                        print(data_progressSerializer.errors,'lllllllllllll')
            if request.data.get('data_next_week'):
                for data_next_week in request.data.get('data_next_week'):
                    data_next_week_data = {
                                            'workstatus': workstatus.id,
                                            'task': data_next_week['task3'],
                                            'description':data_next_week['description_of_effort3']
                                        }
                    data_next_weekSerializer = ActivityNextWeekSerializer(data=data_next_week_data)
                    if data_next_weekSerializer.is_valid():
                        data_next_weekSerializer.save()
            if request.data.get('data_issue'):
                for data_issue in request.data.get('data_issue'):
                    data_issue_data = {
                       'workstatus': workstatus.id,
                       'name': data_issue['issue_name'],
                       'description':data_issue['description_of_issue']
                    }
                 
                    data_issueSerializer = IssueSerializer(data=data_issue_data)
                    if data_issueSerializer.is_valid():
                        data_issueSerializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   