from django.contrib.auth.models import User, Group
# from .models import Profile, Task, Project
from .models import *
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken
from .serializers import *
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# Pagination for REST FRAMEWORK TAKEN
from rest_framework.pagination import LimitOffsetPagination

# Email includes
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from django.template.loader import get_template
from django.template import Context
from django.core.mail import EmailMultiAlternatives
from .async_send_email import send_mail


# Channel
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# INFINITE FILTER


def infinite_filter(request, queryset_obj):
    limit = request.GET.get('limit')
    offset = request.GET.get('offset')
    return queryset_obj[int(offset): int(offset) + int(limit)]
# hasMore Data


def is_there_more_data(request, queryset_obj):
    offset = request.GET.get('offset')
    if int(filter) > queryset_obj.count():
        return False
    else:
        return True

# User Viewset


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class IsSameGroupOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.user in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user


# class ProfileAPI(generics.RetrieveAPIView):
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]
#     serializer_class = ProfileSerializer

#     def get_object(self):
#         id = self.kwargs.get("user_id")
#         user = User.objects.get(id=id)
#         for group in self.request.user.groups.all():
#             if group in user.groups.all():
#                 return Profile.objects.get(user__id=id)
#         raise PermissionDenied

class SummaryAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        group_id = request.GET.get("group_id")
        user_id = request.GET.get('emp_id')
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        group = Group.objects.get(id=group_id)
        group_serializer = GroupLeaderSerializer(group)
        if user_id:
            user = User.objects.get(username=user_id)
            user_serializer = UserSerializer(user)
            completed_tasks = Task.objects.filter(assigned_to=user).filter(completed=True).filter(
                completed_date__gte=from_date).filter(completed_date__lte=to_date).order_by("completed_date")
            completed_tasks_serializer = TaskListSerializer(
                completed_tasks, many=True)
            ongoing_tasks = Task.objects.filter(assigned_to=user).filter(started=True).filter(started_date__lte=to_date).filter(
                Q(completed_date__isnull=True) | Q(completed_date__gt=to_date)).order_by("started_date")
            ongoing_tasks_serializer = TaskListSerializer(
                ongoing_tasks, many=True)
            pending_tasks = Task.objects.filter(assigned_to=user).filter(created_date__lte=to_date).filter(
                Q(started_date__isnull=True) | Q(started_date__gt=to_date)).order_by("created_date")
            pending_tasks_serializer = TaskListSerializer(
                pending_tasks, many=True)
            issues = Issue.objects.filter(raised_by=user).filter(
                raised_date__gte=from_date).filter(raised_date__lte=to_date)
            issues_serializer = IssueListSerializer(issues, many=True)
            return Response(
                {
                    'group': group_serializer.data,
                    'completed_tasks': completed_tasks_serializer.data,
                    'ongoing_tasks': ongoing_tasks_serializer.data,
                    'pending_tasks': pending_tasks_serializer.data,
                    'issues': issues_serializer.data
                }
            )

        else:
            completed_tasks = Task.objects.filter(project__group=group).filter(completed=True).filter(
                completed_date__gte=from_date).filter(completed_date__lte=to_date).order_by("completed_date")
            ongoing_tasks = Task.objects.filter(project__group=group).filter(started=True).filter(started_date__lte=to_date).filter(
                Q(completed_date__isnull=True) | Q(completed_date__gt=to_date)).order_by("started_date")
            pending_tasks = Task.objects.filter(project__group=group).filter(created_date__lte=to_date).filter(
                Q(started_date__isnull=True) | Q(started_date__gt=to_date)).order_by("created_date")
            issues = Issue.objects.filter(task__project__group=group).filter(
                raised_date__gte=from_date).filter(raised_date__lte=to_date)
            completed_tasks_serializer = TaskListSerializer(
                completed_tasks, many=True)
            ongoing_tasks_serializer = TaskListSerializer(
                ongoing_tasks, many=True)
            pending_tasks_serializer = TaskListSerializer(
                pending_tasks, many=True)
            issues_serializer = IssueListSerializer(issues, many=True)
            return Response(
                {
                    'group': group_serializer.data,
                    'completed_tasks': completed_tasks_serializer.data,
                    'ongoing_tasks': ongoing_tasks_serializer.data,
                    'pending_tasks': pending_tasks_serializer.data,
                    'issues': issues_serializer.data
                }
            )


class GroupAPI(generics.RetrieveAPIView):
    # Uncomment Later
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    serializer_class = GroupSerializer

    def get_object(self):
        id = self.kwargs.get("group_id")
        group = Group.objects.get(id=id)
        return group


class TeamleaderAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        serializer = TeamLeaderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            groups = Group.objects.all().order_by('id')
            serializer = GroupListSerializer(groups, many=True)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class GroupListAllAPI(APIView):
    # Uncomment Later
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]

    def get(self, request):
        groups = Group.objects.all().order_by('id')
        serializer = GroupListSerializer(groups, many=True)
        return Response(serializer.data)


class GroupListAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        group_name = request.data.get('name')
        try:
            group = Group.objects.create(name=group_name)
            group.save()
            groups = Group.objects.all().order_by('id')
            serializer = GroupListSerializer(groups, many=True)
            message = 'Group Successfully Created'
            return Response({"groupall": serializer.data, "message": message})
        except:
            groups = Group.objects.all().order_by('id')
            serializer = GroupListSerializer(groups, many=True)
            message = 'Same Group already exists'
            return Response({"groupall": serializer.data, "message": message})

    def get(self, request):
        groups = Group.objects.all().order_by('id')
        serializer = GroupListSerializer(groups, many=True)
        return Response(serializer.data)

    def put(self, request):
        group = Group.objects.get(id=request.data.get('id'))
        data = {
            'id': request.data.get('id'),
            'name': request.data.get('name')
        }
        teamleader = Teamleader.objects.get(
            id=request.data.get('teamleader_id'))
        data_teamleader = {
            'employees': request.data.get('employees')
        }
        # teamleader update
        serializer_teamleader = TeamLeaderSerializer(
            instance=teamleader, data=data_teamleader, partial=True)
        if serializer_teamleader.is_valid():
            serializer_teamleader.save()

        serializer = GroupListSerializer(
            instance=group, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            groups = Group.objects.all().order_by('id')
            AllGroupSerializer = GroupListSerializer(groups, many=True)
            return Response(AllGroupSerializer.data)

    def delete(self, request):
        id = request.GET.get('id')
        group = get_object_or_404(Group, id=id)

        if not(request.user.is_staff or request.user.is_hr):
            raise PermissionDenied

        group.delete()
        groups = Group.objects.all().order_by('id')
        AllGroupSerializer = GroupListSerializer(groups, many=True)
        return Response(AllGroupSerializer.data)
        # return Response({"message": "Group Deleted Successfully"})


# class AdminWorkAPI(APIView):
class DesignationAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        if request.GET.get('qtype') == 'all':
            designations = Designation.objects.all()
            serializer = DesignationSerializer(designations, many=True)
            return Response(serializer.data)

        else:
            if str(request.GET.get('qtype')):
                value = str(request.GET.get('qtype'))
                groupList = value.split(",")

                # designations = Designation.objects.filter(group__in = [request.GET.get('qtype')])
                designations = Designation.objects.filter(group__in=groupList)
                serializer = DesignationSerializer(designations, many=True)
                return Response(serializer.data)
            else:
                return Response({'message': 'Please Insert Group Name'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if not(request.user.is_staff or request.user.profile.is_hr):
            raise PermissionDenied

        serializer = DesignationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            designations = Designation.objects.all()
            serializer = DesignationSerializer(designations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            # return Response({'message': "Designation Successfully Created"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not(request.user.is_staff or request.user.profile.is_hr):
            raise PermissionDenied

        designation = Designation.objects.get(id=request.data.get('id'))
        serializer = DesignationSerializer(
            instance=designation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            designations = Designation.objects.all()
            serializer = DesignationSerializer(designations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            # return Response({'message': "Designation Successfully Created"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        id = request.GET.get('id')
        designation = get_object_or_404(Designation, id=id)
        designation.delete()
        designations = Designation.objects.all()
        serializer = DesignationSerializer(designations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminDashProjectsAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        if not request.user.is_staff:
            raise PermissionDenied
        groups = Group.objects.all().exclude(
            name='Management').exclude(name="HR").exclude(name="Finance & Accounts").order_by('id')
        serializer = GroupProjectListSerializer(groups, many=True)
        return Response(serializer.data)


class DashboardPanelDataAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        if request.user.profile.is_hr:
            profile = Profile.objects.all()
            return Response({"Manage_Members": profile.count(),
                             # "Notice": waiting_for_review_tasks
                             })
        else:
            tasks = Task.objects.filter(
                assigned_to=request.user).filter(completed=False)
            current_tasks = tasks.filter(submitted=False).count()
            submitted_tasks = tasks.filter(submitted=True).count()
            waiting_for_review_tasks = request.user.profile.get_wfr_tasks()
            overdue_tasks = request.user.profile.get_overdue_tasks()
            cld_tasks = request.user.profile.get_cld_tasks_count()
            unresolved_issues = Issue.objects.filter(
                raised_by=request.user).filter(solved=False).count()
            return Response({"current_tasks": current_tasks,
                             "submitted_tasks": submitted_tasks,
                             "waiting_for_review_tasks": waiting_for_review_tasks,
                             "overdue_tasks": overdue_tasks,
                             "cld_tasks": cld_tasks,
                             "unresolved_issues": unresolved_issues})


@api_view(['GET'])
def ProfileFuncAPI(requestr, user_id):
    profile = Profile.objects.get(user__id=user_id)
    serializer = ProfileSerializer(profile)
    return Response({"profile": serializer.data,
                     "is_teamleader": profile.is_temaleader()})


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def AvgKPIAPI(request, user_id, year):
    if year == None:
        year = timezone.now().year
    profile = Profile.objects.get(user__id=user_id)
    overall_kpi = profile.get_employee_overall_kpi(year)
    avg_kpi_dict = profile.get_employee_kpi_average(year)
    return Response({"overall_kpi": overall_kpi,
                     "avg_kpi_dict": avg_kpi_dict})


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def TaskTableAPI(request, type, filter, id):
    fullName = None
    if (type == "group"):
        projects = Project.objects.filter(group__id=id).filter(completed=False)
        tasks = Task.objects.filter(project__in=projects).order_by('-id')
    elif (type == "project"):
        tasks = Task.objects.filter(project__id=id).order_by('-id')
    elif (type == "user"):
        tasks = Task.objects.filter(assigned_to__id=id).order_by('-id')

    if (filter == "overview"):
        if (type != "user"):
            completed_tasks = tasks.filter(completed=True).count()

        else:
            tasks = tasks.filter(completed=False)
            completed_tasks = 0
            fullName = User.objects.get(id=id).get_full_name()
        ongoing_tasks = tasks.filter(started=True).filter(
            paused=False).filter(submitted=False).count()
        paused_tasks = tasks.filter(paused=True).count()
        not_started_tasks = tasks.filter(started=False).count()
        waiting_for_review_tasks = tasks.filter(
            submitted=True).filter(completed=False).count()
        total_tasks = tasks.count()

        return Response({"total_tasks": total_tasks,
                         "completed_tasks": completed_tasks,
                         "ongoing_tasks": ongoing_tasks,
                         "paused_tasks": paused_tasks,
                         "not_started_tasks": not_started_tasks,
                         "waiting_for_review_tasks": waiting_for_review_tasks,
                         "full_name": fullName
                         })
    elif (filter == "current"):
        tasks = tasks.filter(completed=False)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    elif (filter == "ongoing"):
        tasks = tasks.filter(started=True).filter(completed=False).filter(
            submitted=False).filter(paused=False)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)

    elif (filter == "paused"):
        tasks = tasks.filter(paused=True)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    elif (filter == "not-started"):
        tasks = tasks.filter(started=False)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    elif (filter == "waiting-for-review"):
        tasks = tasks.filter(submitted=True).filter(completed=False)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    elif (filter == "completed"):
        tasks = tasks.filter(completed=True)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    elif (filter == "all"):
        # serializer = TaskListSerializer(tasks, many=True)
        # return Response(serializer.data)

        if request.GET.get('offset'):
            paginator = LimitOffsetPagination()
            result_page = paginator.paginate_queryset(tasks, request)
            serializer = TaskListSerializer(
                result_page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = TaskListSerializer(
                tasks, many=True, context={'request': request})
            return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def IssueTableAPI(request, type, id, filter=None):
    if (type == "group"):
        if not request.user.is_staff:
            raise PermissionDenied
        group = Group.objects.get(id=id)
        issues = Issue.objects.filter(
            task__project__group=group).order_by('-id')
        if (filter == "all"):
            issues = issues
        elif (filter == "unresolved"):
            issues = issues.filter(solved=False)
        elif (filter == "solved"):
            issues = issues.filter(solved=True)
    elif (type == "project"):
        project = Project.objects.get(id=id)
        if not(request.user.is_staff or (project.group in request.user.groups.all())):
            raise PermissionDenied
        issues = Issue.objects.filter(task__project__id=id).order_by('-id')
    elif (type == "user"):
        if (filter == "group"):
            groups = request.user.groups.all()
            issues = Issue.objects.filter(
                task__project__group__in=groups).order_by('-id')
        if (filter == "raised"):
            issues = Issue.objects.filter(raised_by__id=id).order_by('-id')
        elif (filter == "solved"):
            issues = Issue.objects.filter(solved_by__id=id).order_by('-id')
        elif (filter == "unresolved"):
            issues = Issue.objects.filter(raised_by__id=id).filter(
                solved=False).order_by('-id')
    serializer = IssueListSerializer(issues, many=True)

    return Response(serializer.data)


@permission_classes((permissions.IsAuthenticated, ))
class IssueInfiniteView(APIView):
    # serializer_class = IssueListSerializer
    # pagination_class = LimitOffsetPagination

    def get(self, request,  type, id, filter=None, format=None):
        if (type == "group"):
            group = Group.objects.get(id=id)
            if not(request.user.is_staff or (group in request.user.groups.all())):
                raise PermissionDenied
            issues = Issue.objects.filter(
                task__project__group=group).order_by('-id')
            if (filter == "all"):
                issues = issues
            elif (filter == "unresolved"):
                issues = issues.filter(solved=False)
            elif (filter == "solved"):
                issues = issues.filter(solved=True)
        elif (type == "project"):
            project = Project.objects.get(id=id)
            if not(request.user.is_staff or (project.group in request.user.groups.all())):
                raise PermissionDenied
            issues = Issue.objects.filter(task__project__id=id).order_by('-id')
        elif (type == "user"):
            if (filter == "group"):
                groups = request.user.groups.all()
                issues = Issue.objects.filter(
                    task__project__group__in=groups).order_by('-id')
            if (filter == "raised"):
                issues = Issue.objects.filter(raised_by__id=id).order_by('-id')
            elif (filter == "solved"):
                issues = Issue.objects.filter(solved_by__id=id).order_by('-id')
            elif (filter == "unresolved"):
                issues = Issue.objects.filter(raised_by__id=id).filter(
                    solved=False).order_by('-id')
        if request.GET.get('offset'):
            paginator = LimitOffsetPagination()
            result_page = paginator.paginate_queryset(issues, request)
            serializer = IssueListSerializer(
                result_page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = IssueListSerializer(
                issues, many=True, context={'request': request})
            return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def TaskDetailAPI(request, id):
    task = Task.objects.get(id=id)
    serializer = TaskDetailsSerializer(task)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def IssueDetailAPI(request, id):
    issue = Issue.objects.get(id=id)
    serializer = IssueDetailsSerializer(issue)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def ProjectTableAPI(request, type, filter, id):
    if (type == "group"):
        projects = Project.objects.filter(group__id=id)

    elif (type == "user"):
        user = User.objects.get(id=id)
        # supervised_projects = Project.objects.filter(
        #     group__in=user.groups.all()).filter(supervisor=request.user)
        # supervised_projects = Project.objects.filter(
        #     group__in=user.groups.all()).filter(supervisor=user)
        # tasks = Task.objects.filter(assigned_to=request.user)
        # tasks = Task.objects.filter(assigned_to=user)
        # task_projects = Project.objects.filter(task__in=tasks)
        # projects = supervised_projects | task_projects
        req_user = User.objects.get(id=id)
        mem_projects = Project.objects.filter(
            group__in=user.groups.all()).filter(members=req_user)
        projects = mem_projects
        projects = projects.distinct()

    if filter == "all":
        projects = projects.order_by('-id', '-completed')
  
    elif filter == "completed":
        projects = projects.filter(
            completed=True).order_by('-id')
    elif filter == "ongoing":
        projects = projects.filter(
            completed=False).order_by('-id')
    if request.GET.get('offset'):
        paginator = LimitOffsetPagination()
        result_page = paginator.paginate_queryset(projects, request)
        serializer = ProjectListSerializer(
            result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    else:
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def EmployeeKPITable(request, user_id, year):
    employee = Profile.objects.get(user__id=user_id)
    if year == None:
        year = timezone.now().year
    if not(request.user.is_staff or request.user.teamleader_set.all() or request.user == employee.user):
        raise PermissionDenied
    raised_issues = employee.get_raised_issues(year)
    solved_issues = employee.get_solved_issues(year)

    # limit = request.GET.get('limit')
    # offset = request.GET.get('offset')
    kpis = employee.get_employee_kpis(year)
    # if int(offset) > kpis.count():
    #     has_more = False
    # else:
    #     has_more = True
    # kpis = kpis[int(offset): int(offset+limit)]

    tasks = Task.objects.filter(kpi__in=kpis)
    projects = Project.objects.filter(task__in=tasks).distinct()
    serializer = KPIListSerializer(kpis, many=True)
    user_serializer = UserListSerializer(employee.user)
    # added
    years_kpi_created = Kpi.objects.filter(
        task__assigned_to=employee.user).dates('created', 'year')
    year_list = []
    for each_year in years_kpi_created:
        year_list.append(each_year.year)

    year_list = reversed(year_list)

    return Response({
        "kpis": serializer.data,
        "assisted_projects": projects.count(),
        "completed_tasks": tasks.count(),
        "raised_issues": raised_issues,
        "solved_issues": solved_issues,
        "user": user_serializer.data,
        "year_list": year_list
    })


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def KPIDetailsAPI(request, kpi_id):
    kpi = Kpi.objects.get(id=kpi_id)
    if not(request.user.is_staff or request.user.teamleader_set.all() or request.user == kpi.task.assigned_to):
        raise PermissionDenied
    serializer = KPIDetailsSerializer(kpi)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def ProjectDetailAPI(request, id):
    project = Project.objects.get(id=id)
    members = project.get_project_members()
    project_serializer = ProjectDetailsSerializer(project)
    member_serializer = UserListSerializer(members, many=True)
    return Response({'details': project_serializer.data,
                     'members': member_serializer.data})


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated, ))
def UsersAPI(request, type, id):
    if (type == "member-group"):
        task = Task.objects.get(id=id)
        members = task.project.group.user_set.all().order_by('id')
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

    # if (type == "project-member"):
    #     #task = Task.objects.get(id=id)

    #     project = Project.objects.get(id=id)
    #     members = project.get_project_members().order_by('id')
    #     #members = project.get_project_members().order_by('id')
    #     print(members)
    #     serializer = UserSerializer(members, many=True)
    #     return Response(serializer.data)

    if (type == "project-group"):
        project = Project.objects.get(id=id)
        members = project.group.user_set.all().order_by('id')
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

    if (type == "project"):
        project = Project.objects.get(id=id)
        members = project.get_project_members()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

    if (type == "group"):
        group = Group.objects.get(id=id)
        members = group.user_set.all().order_by('id')
        serializer = UserProfileSerializer(members, many=True)
        return Response(serializer.data)

    if (type == "all"):
        members = User.objects.all().order_by('id')
        serializer = UserProfileSerializer(members, many=True)
        return Response(serializer.data)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })
        else:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# For POST, UPDATE & DELETE Project
class ProjectAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        # print(request.data)
        group = request.data.get('group')
        if not(request.user.is_staff or request.user.profile.is_group_teamleader(group)):
            raise PermissionDenied
        serializer = ProjectDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            projects = Project.objects.filter(
                group=group).filter(completed=False).order_by('-id')
            projects_serializer = ProjectListSerializer(projects, many=True)

            # project_mem_serializer = ProjectWriteSerializer(data= )

            return Response(projects_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        project = get_object_or_404(Project, id=request.data.get('id'))
        serializer = ProjectDetailsSerializer(
            instance=project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            members = project.get_project_members().order_by('username')
            member_serializer = UserListSerializer(members, many=True)
            return Response({'details': serializer.data,
                             'members': member_serializer.data,
                             'message': "Project Updated Successfully",
                             "type": "success"
                             })

    def delete(self, request, *args, **kwargs):
        id = request.GET.get('id')
        project = get_object_or_404(Project, id=id)
        project.delete()
        return Response({"message": "Project Deleted Successfully"})


class TaskAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        project_id = request.data.get('project')
        project = Project.objects.get(id=project_id)
        group = project.group
        if not(request.user.is_staff or request.user or request.user.profile.is_group_teamleader(group.id) or request.user.profile.is_project_supervisor(project_id)):
            raise PermissionDenied

        serializer = TaskDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_date=timezone.now(),
                            created_by=request.user)
            project_tasks = project.task_set.all().order_by('-completed', '-id')
            tasks_serializer = TaskListSerializer(project_tasks, many=True)
            project_serializer = ProjectDetailsSerializer(project)
            members = project.get_project_members().order_by('username')
            member_serializer = UserListSerializer(members, many=True)
            return Response({"details": project_serializer.data, "members": member_serializer.data, "tasks": tasks_serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        task = get_object_or_404(Task, id=request.data.get('id'))
        group = task.project.group

        if not(request.user.is_staff or request.user or request.user.profile.is_group_teamleader(group.id) or request.user.profile.is_project_supervisor(task.project.id)):
            raise PermissionDenied
        serializer = TaskDetailsSerializer(
            instance=task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({"message": "Task Not Updated"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        task = get_object_or_404(Task, id=request.GET.get('id'))
        group = task.project.group
        if not(request.user.is_staff or request.user.profile.is_group_teamleader(group.id) or request.user.profile.is_project_supervisor(task.project.id)):
            raise PermissionDenied
        task.delete()
        return Response({"message": "Task Deleted Successfully"})


class TaskCompleteAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        task = get_object_or_404(Task, id=request.data.get('task'))
        if not request.user.profile.is_project_supervisor(task.project.id):
            raise PermissionDenied

        serializer = KPIDetailsSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(created=timezone.now().date())
            task.completed = True
            task.save()
            serializer = TaskDetailsSerializer(task)
            return Response(serializer.data)
        else:
            print(serializer.errors)


class TaskFeedbackAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        task_id = request.data.get('task')
        serializer = FeedbackSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(created_date=timezone.now())

            task = Task.objects.get(id=task_id)
            serializer = TaskDetailsSerializer(task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueCommentAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        issue_id = request.data.get('issue')

        serializer = IssueCommentSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(posted_date=timezone.now())

            issue = Issue.objects.get(id=issue_id)
            serializer = IssueDetailsSerializer(issue)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        task_id = request.data.get('task')
        # task = Task.objects.filter(task__id = task_id)
        task = Task.objects.get(id=task_id)

        serializer = IssueDetailsSerializer(data=request.data, partial=True)
        # serializer_task = TaskDetailsSerializer(instance=task, partial=True)

        if serializer.is_valid():
            serializer.save(raised_date=timezone.now().date())
            # serializer_task.save()

            serializer = TaskDetailsSerializer(task)
            # issue_serializer = TaskListSerializer(project_tasks, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        comment = get_object_or_404(Comment, id=request.data.get('id'))
        serializer = IssueCommentSerializer(
            instance=comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # issue_id = request.data.get('issue')
            # issue = Issue.objects.get(id=issue_id)
            # serializer = IssueDetailsSerializer(issue)
            # return Response(serializer.data)

        issue = get_object_or_404(Issue, id=request.data.get('issue'))
        serializerissue = IssueDetailsSerializer(
            instance=issue, data=request.data, partial=True)
        if serializerissue.is_valid():
            serializerissue.save()

            return Response(serializerissue.data)


class NewsAPI(APIView):
    serializer_class = NewsLisSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = [
        permissions.IsAuthenticated
    ]
    # , filter=None, format=None

    def get(self, request, type, id):

        if type == "all":
            if request.user.is_staff:
                groups = Group.objects.all().exclude(name='Management').exclude(name="HR")
            else:
                groups = request.user.groups.all()
            all_news = News.objects.filter(
                group__in=groups).order_by('-created_date')

        if type == "group":
            group = Group.objects.get(id=id)
            if not(request.user.is_staff or group in request.user.groups.all()):
                raise PermissionDenied
            all_news = News.objects.filter(
                group=group).order_by('-created_date')

        elif type == "project":
            project = Project.objects.get(id=id)
            if not(request.user.is_staff or project.group in request.user.groups.all()):
                raise PermissionDenied
            all_news = News.objects.filter(
                project=project).order_by('-created_date')

        elif type == "task":
            task = Task.objects.get(id=id)
            if not(request.user.is_staff or task.project.group in request.user.groups.all()):
                raise PermissionDenied
            all_news = News.objects.filter(task=task).order_by('-created_date')

        elif type == "user":
            owner = User.objects.get(id=id)
            if not(request.user.is_staff or request.user.groups.all() in owner.groups.all() or request.user == owner):
                raise PermissionDenied
            all_news = News.objects.filter(
                owner=owner).order_by('-created_date')

        paginator = LimitOffsetPagination()
        result_page = paginator.paginate_queryset(all_news, request)
        serializer = NewsLisSerializer(
            result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class AggregateNewsAPI(APIView):
    def get(self, request, type, id):
        if type == "all":
            if request.user.is_staff:
                groups = Group.objects.all().exclude(name='Management').exclude(name="HR")
            else:
                groups = request.user.groups.all()
            all_news = News.objects.filter(
                group__in=groups).order_by('-created_date')


class NoticeTableAPI(APIView):
    serializer_class = NoticeListSerializer
    # pagination_class = LimitOffsetPagination
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, type):
        if type == "onboard":
            notices = Notice.boardObjects.all().order_by('-id')
            serializer = NoticeListSerializer(
                notices, many=True, context={'request': request})
            return Response(serializer.data)
        elif type == "all":
            notices = Notice.objects.all().order_by('-id')
            paginator = LimitOffsetPagination()
            result_page = paginator.paginate_queryset(notices, request)
            serializer = NoticeListSerializer(
                result_page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)


class NoticeAPI(APIView):
    serializer_class = NoticeDetailsSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        notice = get_object_or_404(Notice, id=request.GET.get('id'))
        serializer = NoticeDetailsSerializer(notice)
        return Response(serializer.data)

    def post(self, request):
        if not(request.user.is_staff or request.user.profile.is_hr or request.user.profile.is_group_teamleader):
            raise PermissionDenied
        serializer = NoticeDetailsSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(created_on=timezone.now(), created_by=request.user)
            notices = Notice.boardObjects.all().order_by('-id')
            notice_serializer = NoticeListSerializer(notices, many=True)
            return Response(notice_serializer.data)

    def put(self, request):
        notice = get_object_or_404(Notice, id=request.data.get('id'))
        if not(request.user.is_staff or request.user.profile.is_hr or request.user.profile.is_group_teamleader):
            raise PermissionDenied
        serializer = NoticeDetailsSerializer(
            instance=notice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Notice Not Updated"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # if not(request.user.is_staff or request.user.profile.is_hr or request.user.profile.is_group_teamleader):
        #     raise PermissionDenied
        notice = get_object_or_404(Notice, id=request.GET.get('id'))
        if not (request.user.is_staff or request.user.profile.is_hr or request.user.profile.is_group_teamleader(notice.id)):
            raise PermissionDenied
        notice.delete()
        return Response({"message": "Notice Deleted Successfully"})

# Update Employee Info
# @api_view(['PUT'])
# @permission_classes((permissions.IsAuthenticated, ))
# def EmployeeProfilePhoto(request, user_id):
#     profile = Profile.objects.get(user__id=user_id)
#     if request.user != profile.user:
#         raise PermissionDenied
#     serializer = ProfilePhotoSerializer(data=request.data)
#     if serializer.is_valid():
#         if employee.profile.image != static('uspl/img/default_image.jpg'):
#             employee.profile.image.delete()
#         serializer.save()
#     employee.profile.image = request.FILES['new_pic']
#     employee.profile.save()
#     return redirect(reverse('uspl:employee_profile', kwargs={"employee_id": employee_id}))
# class RoleListAPI(APIView):
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]
#     def get(self, request):
#         Profile.objects.filter(is_hr=True)


class UserProfileAllAPI(APIView):
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    # serializer_class = ProfileSerializer

    def post(self, request):
        # if not(request.user.is_staff or request.user.profile.is_hr):
        #     raise PermissionDenied
        # data = request.data

        for user_data in request.data:
            print("USER", user_data)
            print('User Name', user_data['username'])
            if User.objects.filter(username=user_data['username']).exists():
                print("USER iffffffffffffffff")
                user = User.objects.get(username=user_data['username'])
                user.email = user_data['email']
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']

                if Group.objects.filter(name=user_data['group']).exists():
                    print(user_data['group'], 'lllllllllllllllllllllllll')
                    user_group = Group.objects.get(name=user_data['group'])
                    group = user_group.id
                else:
                    print('None lllllllllllllllllllllllll')
                    group = None
                user.groups.add(group)
                user.save()
                # teamleader_data = {
                #     'group':group.id,
                #     'employees': [user.id]
                # }
                # serializer = TeamLeaderSerializer(data=teamleader_data)
                # if serializer.is_valid():
                #     serializer.save()
                # else:
                #     print(serializer.errors)

            else:
                print("USER elseeeeeeeeeeeeeeeee")
                username = user_data['username']
                email = user_data['email']
                user = User.objects.create(
                    username=username, email=email)
                # password = User.objects.make_random_password(length=8)
                password = 'ulkasemi#' + str(user_data['username'])
                user.set_password(password)
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']

                if Group.objects.filter(name=user_data['group']).exists():
                    user_group = Group.objects.get(name=user_data['group'])
                    group = user_group.id
                    user.groups.add(group)
                
                # group = Group.objects.get(name=user_data['group'])
                
                user.save()

            print("designation ", user_data['dsg'])
            profile = user.profile
            designation = Designation.objects.get(title=user_data['dsg'])
            if user_data['reports_to']:

                if User.objects.filter(username=user_data['reports_to']).exists():
                    print('reportsssss', user_data['reports_to'])
                    userr = User.objects.get(
                        username=user_data['reports_to'])
                    reports_to_user = userr.id
                else:
                    print('else   reportsssss', user_data['reports_to'])
                    username = user_data['reports_to']
                    user = User.objects.create(username=username)
                    # password = User.objects.make_random_password(length=8)
                    password = 'ulkasemi#' + str(user_data['reports_to'])
                    user.set_password(password)
                    user.save()
                    reports_to_user = user.id
            else:
                print('hereeeeeeeeeeeeeee')
                reports_to_user = None

            data = {
                'blood_group': user_data['blood_group'],
                'highest_degree': user_data['highest_degree'],
                'dsg': designation.id,
                'present_address': user_data['present_address'],
                'emergency_contact': user_data['emergency_contact'],
                'phone_number': user_data['phone_number'],
                'date_of_birth': user_data['date_of_birth'],
                'date_of_joining': user_data['date_of_joining'],
                'reports_to': reports_to_user
            }

            if Group.objects.filter(name="HR").exists():
                hr = Group.objects.get(name="HR")
                if hr in user.groups.all():
                    data['is_hr'] = True
            if Group.objects.filter(name="Finance & Accounts").exists():
                fna = Group.objects.get(name="Finance & Accounts")
                if fna in user.groups.all():
                    data['is_fna'] = True

            serializer = CreateUserSerializer(
                instance=profile, data=data, partial=True)
            print("DATAAAAAAAAAAAAAAAAAA", data)
            if serializer.is_valid():
                serializer.save()
                print("SAVED")

                # current_site = get_current_site(request)
                # mail_subject = 'Welcome to Ulkasemi EMS'
                # message = render_to_string('uspl/acc_active_email.html', {
                #     'user': user,
                #     'domain': current_site.domain,
                #     'password': password,
                # })
                # print("MESSAGE", message)
                # to_email = user.email
                # send_mail(subject=mail_subject, body=message,
                #           recipient_list=[to_email], from_email="ems@ulkasemi.com")
            else:
                print('ERORRRRRR', serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': "Users Successfully Created"}, status=status.HTTP_200_OK)


class UserProfileAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    # serializer_class = ProfileSerializer

    def post(self, request):
        if not(request.user.is_staff or request.user.profile.is_hr):
            raise PermissionDenied

        username = request.data.get('username')
        email = request.data.get('email')
        user = User.objects.create(
            username=username, email=email)
        password = User.objects.make_random_password(length=8)
        user.set_password(password)
        user.first_name = request.data.get('first_name')
        user.last_name = request.data.get('last_name')
        user.groups.add(request.data.get('group'))
        user.save()
        print(user.password)
        profile = user.profile
        data = {
            'blood_group': request.data.get('blood_group'),
            'highest_degree': request.data.get('highest_degree'),
            'dsg': request.data.get('dsg'),
            'present_address': request.data.get('present_address'),
            'emergency_contact': request.data.get('emergency_contact'),
            'phone_number': request.data.get('phone_number'),
            'date_of_birth': request.data.get('date_of_birth'),
            'date_of_joining': request.data.get('date_of_joining'),
            'reports_to': request.data.get('reports_to')
        }
        if Group.objects.filter(name="HR").exists():
            hr = Group.objects.get(name="HR")
            if hr in user.groups.all():
                data['is_hr'] = True
        if Group.objects.filter(name="Finance & Accounts").exists():
            fna = Group.objects.get(name="Finance & Accounts")
            if fna in user.groups.all():
                data['is_fna'] = True

        serializer = CreateUserSerializer(
            instance=profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("SAVED")

            current_site = get_current_site(request)
            mail_subject = 'Welcome to Ulkasemi EMS'
            message = render_to_string('uspl/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'password': password,
            })
            print("MESSAGE", message)
            to_email = user.email
            send_mail(subject=mail_subject, body=message,
                      recipient_list=[to_email], from_email="ems@ulkasemi.com")
            return Response({'message': "User Successfully Created"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        uid = request.data.get('user_id')
        user = get_object_or_404(User, id=uid)
        if not(request.user.is_staff or request.user.profile.is_hr or request.user == user):
            raise PermissionDenied

        print(request.data.get('group_id'),'llllllllllllllllll')
        if request.data.get('group_id') == 'all':
            members = User.objects.all().order_by('id')
            user_serializer = UserProfileSerializer(members, many=True).data

        else:
            group = Group.objects.get(id=request.data.get('group_id'))
            members = group.user_set.all().order_by('id')
            user_serializer = UserProfileSerializer(members, many=True).data
        
        # serializer = ProfileSerializer(instance=user, data=request.data, partial=True)
        if request.data.get('username'):
            user.username = request.data.get('username')
            user.first_name = request.data.get('first_name')
            user.last_name = request.data.get('last_name')
            user.groups.set(request.data.get('groups'))
            user.save()
            message = "User Successfully Updated"
            return Response({'userall': user_serializer, 'message': message}, status=status.HTTP_200_OK)

        if request.data.get('setActive'):
            user.is_active = request.data.get('active')
            user.save()
            if request.data.get('active'):
                message = "User Successfully Activated"
            else:
                message = "User Successfully Inactivated"

            return Response({'userall': user_serializer, 'message': message}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        profile = user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not(request.user.is_staff or request.user.profile.is_hr or request.user == user):
            raise PermissionDenied
        profile = user.profile

        serializer = CreateUserSerializer(
            instance=profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            profile_serializer = ProfileSerializer(profile)
            user_serializer = UserSerializer(user)
            return Response({"user": user_serializer.data, "profile": profile_serializer.data})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    model = User

    def post(self, request):
        user = request.user
        if not user.check_password(request.data.get('password')):
            return Response({'message': "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "Success"}, status=status.HTTP_200_OK)


class ChangePasswordAPI(generics.UpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = PasswordSerializer
    model = User

    def update(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'message': "Incorrect Old Password"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'message': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
