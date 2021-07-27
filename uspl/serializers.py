from rest_framework import serializers
# from uspl.models import *
from django.contrib.auth.models import User, Group
from .models import *
from django.contrib.auth import authenticate

# User Serializer


class GroupSmallListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class DesignationSerializer(serializers.ModelSerializer):
    title_name = serializers.CharField(source="title", required=False)
    job_description_details = serializers.CharField(
        source="job_description", required=False)
    # group_name = serializers.CharField(source="group.name", required=False)
    groups = serializers.SerializerMethodField(
        "get_groups_all", required=False)

    def get_groups_all(self, designation):
        # print(groups)
        serializer = GroupSmallListSerializer(
            designation.group, many=True)
        return serializer.data

    class Meta:
        model = Designation
        fields = ['id', 'title_name',
                  'job_description_details', 'group', 'groups']
        #fields = "__all__"

class ProfileSmallSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['reports_to']

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name")
    image = serializers.ImageField(source="profile.image",use_url=True)
    dsg = serializers.CharField(source="profile.dsg.title", required=False)
    is_teamleader = serializers.BooleanField(source="profile.is_temaleader")
    is_hr = serializers.BooleanField(source="profile.is_hr", required=False)
    is_fna = serializers.BooleanField(source="profile.is_fna", required=False)
    groups = GroupSmallListSerializer(
        source="profile.get_employee_groups", many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups',"full_name", 'is_staff', 'is_fna', 'is_hr', 'image','dsg', 'is_teamleader']

class ProfileSerializer(serializers.ModelSerializer):
    dsg = serializers.CharField(source="dsg.title", required=False)
    dsg_name = DesignationSerializer(source='dsg', required=False)
    is_teamleader = serializers.BooleanField(
        source="is_temaleader", required=False)
    groups = serializers.SerializerMethodField("get_user_groups", required=False)

    full_name = serializers.CharField(source="user.get_full_name", required=False)
    email = serializers.EmailField(source="user.email", required=False)
    firstname = serializers.CharField(source="user.first_name", required=False)
    lastname = serializers.CharField(source="user.last_name", required=False)
    # reports_to_user = UserSerializer(
    #     source="reports_to", required=False)
    reports_to = UserSerializer(required=False)
    # reports_to = serializers.CharField(source='reports_to.first_name', required=False)
    is_busy = serializers.BooleanField(source="is_busy_status", required=False)
    is_active_status = serializers.BooleanField(
        source="user.is_active", required=False)
    username = serializers.CharField(
        source="user", required=False)

    def get_user_groups(self, profile):
        groups = profile.user.groups.all()

        # print(groups)
        serializer = GroupSmallListSerializer(
            groups, many=True)
        return serializer.data

    class Meta:
        model = Profile
        fields = '__all__'
        ordering = ('date_of_joining')


class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    firstname = serializers.CharField(source="first_name", required=False)
    lastname = serializers.CharField(source="last_name", required=False)

    class Meta:
        model = User
        fields = ['profile', 'firstname', 'lastname']


class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(min_length=8)
    new_password = serializers.CharField(min_length=8)


class ProfilePhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField()


class UserListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name")
    image = serializers.ImageField(source="profile.image")
    dsg = serializers.CharField(source="profile.dsg.title", required=False)
    is_teamleader = serializers.BooleanField(source="profile.is_temaleader")
    is_busy = serializers.BooleanField(source="profile.is_busy_status")

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'image',
                  'dsg', 'is_teamleader', 'email', 'is_busy']


class FeedbackSerializer(serializers.ModelSerializer):
    author_user = UserListSerializer(source="author", required=False)
    gtype = serializers.CharField(source="get_type")
    supervisor = UserListSerializer(source="task.project.supervisor")
    class Meta:
        model = Feedback
        fields = "__all__"

class ReplySerializer(serializers.ModelSerializer):
    gtype = serializers.CharField(source="get_type")
    author_user = UserListSerializer(source="author", required=False)
    target_user = UserListSerializer(source="target", required=False)

    class Meta:
        model = Reply
        fields = "__all__"



class IssueCommentSerializer(serializers.ModelSerializer):
    #author = UserListSerializer()
    #solution_details = serializers.CharField(source="issue.solution")
    author_user = UserListSerializer(source="author", required=False)

    class Meta:
        model = Comment
        # fields = ['id','solution_details','issue', 'author', 'posted_date',
        #            'body', 'marked_as_solution','author_user']
        fields = "__all__"


class IssueListSerializer(serializers.ModelSerializer):
    total_comments = serializers.CharField(source="comment_set.count")
    task_name = serializers.CharField(source="task.name")
    raised_by = UserListSerializer()
    solved_by = UserListSerializer()

    class Meta:
        model = Issue
        fields = ['id', 'name',
                  'raised_date', 'task_name', 'task', 'solved_date', 'solved', 'total_comments', 'raised_by', 'solved_by']


class IssueDetailsSerializer(serializers.ModelSerializer):
    total_comments = serializers.CharField(source="comment_set.count")
    raised_by_name = UserListSerializer(source="raised_by")
    solved_by_name = UserListSerializer(source="solved_by")
    supervisor = UserListSerializer(source="task.project.supervisor")
    comment_set = IssueCommentSerializer(many=True)
    task_name = serializers.CharField(source="task.name")
    project = serializers.CharField(source="task.project.id")
    project_name = serializers.CharField(source="task.project.name")

    # paused_task = serializers.BooleanField(source="task.paused")
    # resumed_task = serializers.BooleanField(source="task.resumed")

    class Meta:
        model = Issue
        fields = '__all__'


class TaskListSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name')
    issue_count = serializers.CharField(source="issue_set.count")
    status = serializers.CharField(source="get_task_status")
    assigned_to = UserListSerializer()
    time_remaining = serializers.CharField(
        source="get_remaining_time", required=False)
    overdue = serializers.BooleanField(source="overdue_status", required=False)

    class Meta:
        model = Task
        fields = ['id', 'project_name', 'name', 'project', 'overdue','wbs_number',
                  'created_date', 'deadline', 'status', 'assigned_to', 'time_remaining', 'issue_count']


class TaskDetailsSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', required=False)
    supervisor = UserListSerializer(
        source="project.supervisor", required=False)
    owner = UserListSerializer(source="assigned_to", required=False)
    status = serializers.CharField(source="get_task_status", required=False)
    issue_set = IssueListSerializer(many=True, required=False)
    feedback_set = FeedbackSerializer(many=True, required=False)
    time_remaining = serializers.CharField(
        source="get_remaining_time", required=False)
    overdue = serializers.BooleanField(source="overdue_status", required=False)
    unresolved_issues = serializers.BooleanField(
        source="has_unresolved_issues", required=False)

    class Meta:
        model = Task
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    proj_completeion_rate = serializers.FloatField(
        source='get_completeion_rate')
    group_name = serializers.CharField(source="group.name")

    class Meta:
        model = Project
        fields = ['proj_completeion_rate', 'group_name',
                  'group', 'name', 'id', 'created_date', 'due_date', 'completed', 'completed_date']


class ProjectDetailsSerializer(serializers.ModelSerializer):
    proj_completeion_rate = serializers.FloatField(
        source='get_completeion_rate', required=False)
    supervisor_user = UserListSerializer(
        source="supervisor", required=False)
    group_name = serializers.CharField(source="group.name", required=False)

    project_members = serializers.SerializerMethodField("get_members")

    def get_members(self, project):
        serializer = UserListSerializer(instance=project.members, many=True)
        return serializer.data
    # task_set = TaskListSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Project
        fields = '__all__'


class KPIListSerializer(serializers.ModelSerializer):
    task_name = serializers.CharField(source="task.name")
    task_id = serializers.CharField(source="task.id")
    average = serializers.FloatField(source="get_kpi_average")

    class Meta:
        model = Kpi
        fields = ['id', 'task_id', 'task_name', 'average', 'created']


class KPIDetailsSerializer(serializers.ModelSerializer):
    employee = UserListSerializer(source="task.assigned_to", required=False)
    task_name = serializers.CharField(source="task.name", required=False)
    task_id = serializers.CharField(source="task.id", required=False)
    rated_by = UserListSerializer(
        source="task.project.supervisor", required=False)
    average = serializers.FloatField(source="get_kpi_average", required=False)

    class Meta:
        model = Kpi
        fields = "__all__"


class TeamLeaderSerializer(serializers.ModelSerializer):
    #employee_name = UserProfileSerializer(many=True, required=False)
    teamleaders = serializers.SerializerMethodField(
        'get_employees')

    def get_employees(self, obj):
        employees = obj.employees.all()
        print(employees, "EMPLOYEES", obj.group.name)
        serializer = UserProfileSerializer(employees, many=True)
        return serializer.data

    class Meta:
        model = Teamleader
        #fields = ['employees']
        fields = "__all__"


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class GroupSerializer(serializers.ModelSerializer):
    teamleader = TeamLeaderSerializer()
    project_set = serializers.SerializerMethodField("get_ongoing_projects")
    user_set = serializers.SerializerMethodField("get_members")

    def get_ongoing_projects(self, group):
        qs = Project.objects.filter(group=group).filter(
            completed=False).order_by('-id')
        serializer = ProjectListSerializer(instance=qs, many=True)
        return serializer.data

    def get_members(self, group):
        qs = group.user_set.all().order_by('username')
        serializer = UserListSerializer(instance=qs, many=True)
        return serializer.data

    class Meta:
        model = Group
        fields = "__all__"

class GroupLeaderSerializer(serializers.ModelSerializer):
    teamleader = TeamLeaderSerializer()
    class Meta:
        model = Group
        fields = ['id', 'name','teamleader']

class GroupListSerializer(serializers.ModelSerializer):
    teamleader = TeamLeaderSerializer()
    user_set = serializers.SerializerMethodField("get_members")

    def get_members(self, group):
        qs = group.user_set.all().order_by('username')
        serializer = UserListSerializer(instance=qs, many=True)
        return {"total_employees": qs.count(),
                "employees": serializer.data
                }

    class Meta:
        model = Group
        fields = "__all__"


class GroupProjectListSerializer(serializers.ModelSerializer):
    project_set = serializers.SerializerMethodField("get_ongoing_projects")
    overview = serializers.SerializerMethodField("get_task_overview")

    def get_ongoing_projects(self, group):
        qs = Project.objects.filter(group=group).filter(
            completed=False).order_by('-id')
        serializer = ProjectListSerializer(instance=qs, many=True)
        return serializer.data

    def get_task_overview(self, group):
        projects = Project.objects.filter(group=group).filter(completed=False)
        tasks = Task.objects.filter(project__in=projects)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(completed=True).count()
        ongoing_tasks = tasks.filter(started=True).filter(
            paused=False).filter(submitted=False).count()
        paused_tasks = tasks.filter(paused=True).count()
        not_started_tasks = tasks.filter(started=False).count()
        waiting_for_review_tasks = tasks.filter(
            submitted=True).filter(completed=False).count()

        return {"total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "ongoing_tasks": ongoing_tasks,
                "paused_tasks": paused_tasks,
                "not_started_tasks": not_started_tasks,
                "waiting_for_review_tasks": waiting_for_review_tasks}

    class Meta:
        model = Group
        fields = ['id', 'name', 'project_set', 'overview']


class NewsLisSerializer(serializers.ModelSerializer):
    owner = UserProfileSerializer()
    date = serializers.CharField(source="news_date")
    time = serializers.TimeField(source="news_time")

    class Meta:
        model = News
        fields = "__all__"


class NoticeListSerializer(serializers.ModelSerializer):

    created_by_name = serializers.CharField(
        source="created_by.get_full_name", required=False)

    created_by_image = serializers.ImageField(
        source="created_by.profile.image", required=False)

    class Meta:
        model = Notice
        fields = ['id', 'title',  'created_on',
                  'expires_on', 'created_by_name', 'created_by_image', 'important']


class NoticeDetailsSerializer(serializers.ModelSerializer):
    owner = UserProfileSerializer(required=False)

    created_by_name = serializers.CharField(
        source="created_by.get_full_name", required=False)

    created_by_image = serializers.ImageField(
        source="created_by.profile.image", required=False)

    class Meta:
        model = Notice
        fields = "__all__"


# class TeamleaderSerializer2(serializers.ModelSerializer):
#     class Meta:
#         model = Teamleader
#         fields = "__all__"


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
