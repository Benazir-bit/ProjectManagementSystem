from django.conf.urls import url, include
from . import views
from rest_framework import routers
from .api import *
from knox import views as knox_views
from django.urls import path

app_name = 'uspl'

#router = routers.DefaultRouter()
#router.register('api/users', UserViewSet, 'api_users')

urlpatterns = [
    # Auth API
    path('api/auth', include('knox.urls')),
    path('api/auth/login', LoginAPI.as_view(), name="login"),
    path('api/auth/password/', PasswordAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    #path('api/auth/user/profilefunc/<int:user_id>', ProfileFuncAPI),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),

    # Profile API
    path('api/<int:user_id>/profile/', ProfileAPI.as_view()),
    path('api/reset-password/', ChangePasswordAPI.as_view()),

    # Group API
    path('api/group/<int:group_id>/', GroupAPI.as_view()),
    path('api/groups/', GroupListAPI.as_view()),
    path('api/groups-all/', GroupListAllAPI.as_view()),
    path('api/groups/teamleader/', TeamleaderAPI.as_view()),

    # Summury API
    path('api/summary/', SummaryAPI.as_view()),
    # Generic API
    path('api/<slug:type>/projects/<slug:filter>/<int:id>', ProjectTableAPI),
    path('api/project/<int:id>', ProjectDetailAPI),
    path('api/task/<int:id>', TaskDetailAPI),
    path('api/issue/<int:id>', IssueDetailAPI),
    path('api/<slug:type>/members/<int:id>', UsersAPI),
    path('api/<slug:type>/tasks/<slug:filter>/<int:id>', TaskTableAPI),

    # KPI API
    path('api/<int:user_id>/kpi_avg/<int:year>/', AvgKPIAPI),
    path('api/<int:user_id>/kpi_list/<int:year>/', EmployeeKPITable),
    path('api/kpi/<int:kpi_id>/', KPIDetailsAPI),

    # Issue API
    path('api/<slug:type>/issues/<slug:filter>/<int:id>',
         IssueInfiniteView.as_view()),
    path('api/<slug:type>/issues/<int:id>', IssueTableAPI),

    #path('api/issues/', IssueInfiniteView.as_view()),

    # ADD, UPDATE & DELETA
    path('api/projects/', ProjectAPI.as_view()),
    path('api/tasks/', TaskAPI.as_view()),
    path('api/issue/', IssueAPI.as_view()),
    path('api/issuecomment/', IssueCommentAPI.as_view()),
    path('api/taskfeedback/', TaskFeedbackAPI.as_view()),
    path('api/user/', UserProfileAPI.as_view()),
    path('api/user/all/', UserProfileAllAPI.as_view()),

    # Project Gantt Chart
    path('api/project-chart/<int:id>', ProjectChartAPI.as_view()),

    # DASHBOARD PANEL API
    path('api/dashboard/panel/', DashboardPanelDataAPI.as_view()),

    # TASK COMPLETE API
    path('api/task/mark-as-done/', TaskCompleteAPI.as_view()),


    # NEWS API
    path('api/news/<slug:type>/<int:id>', NewsAPI.as_view()),

    # NOTICE API
    path('api/notices/<slug:type>/', NoticeTableAPI.as_view()),
    path('api/notice/', NoticeAPI.as_view()),


    # Admin
    path('api/admin/all/projects/', AdminDashProjectsAPI.as_view()),
    path('api/designations/', DesignationAPI.as_view())
]

#urlpatterns += router.urls


"""
urlpatterns = [

    url(r'^$', views.home, name="home"),

    url(r'^api/auth/login', LoginAPI.as_view(), name="login"),

    # Groups
    url(r'^group_details/(?P<group_id>[0-9]+)/',
        views.GroupDetailsView, name="group_details"),
    url(r'^group_projects/(?P<group_id>[0-9]+)/',
        views.GroupProjectList, name="group_project_list"),
    url(r'^project_list/$', views.own_project_list, name="own_project_list"),
    url(r'^project_list/(?P<employee_id>[0-9]+)/$',
        views.employee_project_list, name="employee_project_list"),
    url(r'^(?P<project_id>[0-9]+)/project_members/$',
        views.ProjectMembers, name="project_members"),

    # HR Pages
    url(r'hr/dsg_list/$', views.DesignationListViewHR, name="hr_dsg_list"),
    url(r'hr/delete_dsg/(?P<dsg_id>[0-9]+)/$',
        views.DeleteDesignationView, name="delete_dsg"),
    url(r'hr/group_list/$', views.GroupListViewHR, name="hr_group_list"),
    url(r'hr/delete_group/(?P<group_id>[0-9]+)/$',
        views.DeleteGroupView, name="delete_group"),
    # Members
    url(r'^group_members/(?P<group_id>[0-9]+)/$',
        views.GroupMembersView, name="group_members"),
    url(r'^group_members/all/$', views.GroupMembersView,
        {'view_all': True},  name="group_members_all"),
    url(r'^ajax/toggle_user_status/$',
        views.toggle_user_status, name='toggle_user_status'),
    url(r'^ajax/get_profile_modal/$', views.ajax_get_profile_modal,
        name='ajax_get_profile_modal'),
    url(r'^ajax/get_update_profile_modal/$',
        views.ajax_get_update_profile_modal, name='ajax_get_update_profile_modal'),


    # Three paths into `project_detail` view
    url('^projects/(?P<project_id>[0-9]+)/not_started/', views.project_detail, {
        'view_not_started': True}, name='project_detail_not_started'),
    url('^projects/(?P<project_id>[0-9]+)/ongoing/', views.project_detail, {
        'view_started': True}, name='project_detail_started'),
    url('^projects/(?P<project_id>[0-9]+)/paused/', views.project_detail,
        {'view_paused': True}, name='project_detail_paused'),
    url('^projects/(?P<project_id>[0-9]+)/waiting_for_review/', views.project_detail, {
        'view_submitted': True}, name='project_detail_waiting_for_review'),
    url('^projects/(?P<project_id>[0-9]+)/completed/', views.project_detail, {
        'view_completed': True}, name='project_detail_completed'),
    url('^projects/(?P<project_id>[0-9]+)/$',
        views.project_detail,  name='project_detail'),
    url(r'^(?P<project_id>[0-9]+)/delete_project',
        views.DeleteProjectView, name="delete_project"),
    url(r'^project_toggle_complete/(?P<project_id>[0-9]+)/$',
        views.project_toggle_complete, name="project_toggle_complete"),

    # Task detail, task edit, delete, Add task, toggle submit and Mark Done
    url(r'^tasks/current/(?P<user_id>[0-9]+)/',
        views.UserCurrentTaskView, name="user_task_list_current"),
    url(r'^tasks/current/ongoing/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_ongoing': True}, name="user_task_list_ongoing"),
    url(r'^tasks/current/not_started/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_not_started': True}, name="user_task_list_not_started"),
    url(r'^tasks/current/submitted/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_submitted': True}, name="user_task_list_submitted"),
    url(r'^tasks/current/paused/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_paused': True}, name="user_task_list_paused"),
    url(r'^tasks/current/overdue/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_overdue': True}, name="user_task_list_overdue"),
    url(r'^tasks/current/close_to_deadline/(?P<user_id>[0-9]+)/', views.UserCurrentTaskView, {
        'view_cld': True}, name="user_task_list_cld"),
    url(r'^tasks/submitted/', views.SubmittedTasks, name="submitted_tasks"),
    url(r'^tasks/waiting/', views.TasksAwaitingReview, name="tasks_waiting"),

    # User's completed tasks
    url(r'^tasks/completed/(?P<user_id>[0-9]+)/',
        views.UserCompletedTaskView, name="user_task_list_completed"),

    url(r'^task/(?P<task_id>[0-9]+)/$', views.task_detail, name="task_detail"),
    url(r'(?P<task_id>[0-9]+)/delete_task',
        views.DeleteTaskView, name="delete_task"),
    url(r'^task_toggle_started/(?P<task_id>[0-9]+)/$',
        views.task_toggle_started, name="task_toggle_started"),
    url(r'^task_toggle_submit/(?P<task_id>[0-9]+)/$',
        views.task_toggle_submit, name="task_toggle_submit"),
    url(r'^task_toggle_done/(?P<task_id>[0-9]+)/$',
        views.task_toggle_done, name="task_toggle_done"),
    url(r'^task_toggle_resumed/(?P<task_id>[0-9]+)/$',
        views.task_toggle_resumed, name="task_toggle_resumed"),

    # Issue
    url(r'^issue/(?P<issue_id>[0-9]+)/',
        views.issue_detail, name="issue_detail"),
    url(r'^issue/solved/(?P<issue_id>[0-9]+)/(?P<comment_id>[0-9]+)/',
        views.issue_toggle_solved, name="issue_toggle_solved"),

    # raised issues
    url(r'^issue/user_issues/(?P<user_id>[0-9]+)/',
        views.user_issues, name="user_issues"),
    # supervised issues
    url(r'^issue/supervised_issues/(?P<user_id>[0-9]+)/',
        views.supervised_issues, name="supervised_issues"),
    # group issues
    url(r'^issue/users_group_issues/(?P<user_id>[0-9]+)/',
        views.group_issues, name="users_group_issues"),
    # Group issues for staff
    url(r'^issue/group_issues/(?P<group_id>[0-9]+)/',
        views.group_issues, name="group_issues"),
    # solved issues
    url(r'^issue/solved_issues/(?P<user_id>[0-9]+)/',
        views.solved_issues, name="solved_issues"),
    # project issues
    url(r'^issue/project_issues/(?P<project_id>[0-9]+)/',
        views.project_issues, name="project_issues"),


    # KPI
    url(r'^user_kpi/(?P<employee_id>[0-9]+)/(?P<year>[0-9]+)',
        views.EmployeeKPIView, name="user_kpi"),

    # news
    url(r'^all_news/(?P<group_id>[0-9]+)/$',
        views.news_list, name="news_list"),
    url(r'^group_news/(?P<group_id>[0-9]+)/$',
        views.group_news_all, name="group_news_all"),
    url(r'^project_news/(?P<project_id>[0-9]+)/$',
        views.project_news_all, name="project_news_all"),
    url(r'^task_news/(?P<task_id>[0-9]+)/$',
        views.task_news_all, name="task_news_all"),
    url(r'^profile_news/(?P<employee_id>[0-9]+)/$',
        views.employee_news_all, name="employee_news_all"),


    #User & Profile
    url(r'^create_user/$', views.CreateUserView, name="create_user"),
    url(r'^ajax/load-cities/', views.load_dsgs, name='ajax_load_dsgs'),
    url(
        r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.activate, name='activate'),
    url(r'^(?P<employee_id>[0-9]+)/update_employee_profile',
        views.UpdateEmployeeProfile, name="update_employee_profile"),
    url(r'^(?P<employee_id>[0-9]+)/employee_profile',
        views.EmployeeProfileView, name="employee_profile"),
    url(r'^employee_profile/reset_password/',
        views.ResetPasswordView, name="reset_password"),

    # Notice
    url(r'^notice/(?P<notice_id>[0-9]+)/',
        views.NoticeDetail, name="notice_details"),
    url(r'^hr/notice/board/', views.NoticeListViewHR, name="hr_notice_list"),
    url(r'^hr/notice/all/', views.NoticeListAll, name="hr_notice_list_all"),

    # Contact Us
    url(r'^contact_us/$', views.ContactUsView, name='contact_us'),

    # logout view
    url(r'^logout/$', views.logoutView, name='logout'),

]
"""
