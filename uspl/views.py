from django.shortcuts import render

# Create your views here.
import datetime
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
#from django.contrib.sites.models import Site
from django.core.exceptions import PermissionDenied
from django.core.mail import send_mail
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate, login, logout
from .models import Project, Task, Profile, Issue, Kpi, Feedback, Comment, News, Teamleader, Designation, Notice
from .forms import AddProjectForm, SearchForm, AddEditTaskForm, UpdateProjectForm, AddTaskForm, UpdateTaskForm, CreateGroupForm, CreateUserForm, UpdateProfileForm, TaskKPIForm, UpdateGroupForm, UpdateGroupTeamleaderForm, UpdateProfileFormHR
#from todo.forms import AddTaskListForm, AddEditTaskForm, AddExternalTaskForm, SearchForm
#from todo.models import Task, TaskList, Comment
#from todo.utils import (send_notify_mail, send_email_to_thread_participants,)
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm

from django.views.generic.dates import YearArchiveView

from django.db.models import Avg


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

# paginator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


# importing static files
from django.contrib.staticfiles.templatetags.staticfiles import static


import hashlib

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from django.http import HttpResponseRedirect

from django.utils import timezone

from django.http import JsonResponse

# importing django-notify-x
from notification.signals import notify


def staff_only(function):
    """
    Custom view decorator allows us to raise 403 on insufficient permissions,
    rather than redirect user to login view.
    """
    def wrap(request, *args, **kwargs):
        if request.user.is_staff:
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


@login_required(login_url='/login/')
def home(request):

    # Make sure user belongs to at least to one group
    if request.user.groups.all().count() == 0:
        messages.warning(
            request, "You do not yet belong to any groups. Ask your administrator to add you to one.")

    # Superuser see all lists
    if request.user.is_staff:
        all_groups = Group.objects.exclude(
            name="HR").exclude(name="Management")
        project_exists = []
        for group in all_groups:
            project_exists.append(Project.objects.filter(
                group=group).filter(completed=0).exists())
        projects = Project.objects.filter(
            completed=0).order_by('-created_date')
        tasks = Task.objects.filter(completed=0)
        tasks_not_started_count_list = []
        tasks_ongoing_count_list = []
        tasks_waiting_for_review_count_list = []
        tasks_paused_count_list = []
        tasks_completed_count_list = []
        total_tasks_count_list = []
        for group in all_groups:
            tasks_not_started_count_list.append(tasks.filter(
                project__group=group).filter(started=False).count())
            tasks_ongoing_count_list.append(tasks.filter(project__group=group).filter(
                started=True).filter(submitted=False).filter(paused=False).count())
            tasks_waiting_for_review_count_list.append(tasks.filter(
                project__group=group).filter(submitted=True).count())
            tasks_paused_count_list.append(tasks.filter(
                project__group=group).filter(paused=True).count())
            tasks_completed_count_list.append(Task.objects.filter(project__in=projects).filter(
                project__group=group).filter(completed=True).count())
            total_tasks_count_list.append(Task.objects.filter(
                project__in=projects).filter(project__group=group).count())

        context = {
            "all_groups": all_groups,
            "projects": projects,
            "tasks_not_started_count_list": tasks_not_started_count_list,
            "tasks_ongoing_count_list": tasks_ongoing_count_list,
            "tasks_waiting_for_review_count_list": tasks_waiting_for_review_count_list,
            "tasks_paused_count_list": tasks_paused_count_list,
            "tasks_completed_count_list": tasks_completed_count_list,
            "total_tasks_count_list": total_tasks_count_list,
            "project_exists": project_exists,
        }
    else:
        supervised_projects = Project.objects.filter(group__in=request.user.groups.all(
        )).filter(supervisor=request.user).filter(completed=False)
        tasks = Task.objects.filter(
            assigned_to=request.user).filter(completed=0)
        task_projects = Project.objects.filter(task__in=tasks)
        projects = supervised_projects | task_projects
        projects = projects.order_by(
            'completed', '-completed_date', '-due_date').distinct()
        tasks_not_started = tasks.filter(started=False)
        tasks_ongoing = tasks.filter(started=True).filter(
            submitted=False).filter(paused=False)
        tasks_waiting_for_review = tasks.filter(submitted=True)
        tasks_paused = tasks.filter(paused=True)
        context = {
            "projects": projects,
            "tasks": tasks,
            "tasks_not_started": tasks_not_started,
            "tasks_ongoing": tasks_ongoing,
            "tasks_paused": tasks_paused,
            "tasks_waiting_for_review": tasks_waiting_for_review,
        }

    return render(request, 'uspl/home.html', context)


@staff_only
@login_required(login_url='/login/')
def GroupListViewHR(request):
    if not(request.user.is_staff):
        raise PermissionDenied
    groups = Group.objects.all()

    if 'add_group' in request.POST:
        create_group_form = CreateGroupForm(request.POST)
        if create_group_form.is_valid():
            try:
                new_group = create_group_form.save(commit=False)
                new_group.save()
                messages.success(request, "Group has been added")
                return redirect('uspl:hr_group_list')
            except IntegrityError:
                messages.warning(
                    request,
                    "There was a problem saving the new list. "
                    "Most likely a Group with the same name already exists.")
    else:
        if request.user.is_staff:
            create_group_form = CreateGroupForm()

    if 'update_group' in request.POST:
        group = Group.objects.get(id=request.POST.get('group_id', False))
        group.name = request.POST.get('new_name', False)
        if group.user_set.all().count() > 0:
            selected_users = request.POST.getlist('user_selected')
            teamleaders = User.objects.filter(id__in=selected_users)
            if Teamleader.objects.filter(group=group).exists():
                group.teamleader.employees = teamleaders
            else:
                new = Teamleader.objects.create(
                    group=group
                )
                new.employees = teamleaders
                new.save()
        group.save()
        return redirect('uspl:hr_group_list')

    if 'addTL' in request.POST:
        group = Group.objects.get(id=request.POST.get('group_id', False))
        if group.user_set.all().count() > 0:
            tl_selected = request.POST.getlist('tl_selected')
            teamleaders = User.objects.filter(id__in=tl_selected)
            if Teamleader.objects.filter(group=group).exists():
                group.teamleader.employees = teamleaders
            else:
                new = Teamleader.objects.create(
                    group=group
                )
                new.employees = teamleaders
                new.save()
        return redirect('uspl:hr_group_list')

    return render(request, 'uspl/hr_group_list.html', {'groups': groups, 'create_group_form': create_group_form, })


@login_required(login_url='/login/')
def UpdateGroupView(request, group_id):
    group = get_object_or_404(Group, pk=group_id)

    if group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    if request.POST:
        update_group_form = UpdateGroupForm(request.POST, instance=group)
        if group.teamleader.users.all().count > 0:
            update_teamleader_form = UpdateGroupTeamleaderForm(
                request.POST, instance=group.teamleader, initial={'group': group})
        else:
            update_teamleader_form = UpdateGroupTeamleaderForm(
                request.POST, initial={'group': group})
        if update_group_form.is_valid() and update_teamleader_form.is_valid():
            update_group = update_group_form.save(commit=False)
            update_group.save()
            teamleader = update_teamleader_form.save(commit=False)
            teamleader.group = group
            teamleader.save()
            messages.success(request, "Group has been updated")
            return redirect('uspl:hr_group_list')
    else:
        update_group_form = UpdateGroupForm(instance=group)
        if group.teamleader.users_set.all().count > 0:
            update_teamleader_form = UpdateGroupTeamleaderForm(
                instance=group.teamleader, initial={'group': group})
        else:
            update_teamleader_form = UpdateGroupTeamleaderForm(
                initial={'group': group})

    context = {
        "group": group,
        'update_group_form': update_group_form,
        'update_teamleader_form': update_teamleader_form,
    }

    return render(request, 'uspl/update_group.html', context)


@login_required(login_url='/login/')
def DeleteGroupView(request, group_id):
    """Delete an entire list. Danger Will Robinson! Only staff members should be allowed to access this view.
    """
    group = get_object_or_404(Group, pk=group_id)

    # Ensure user has permission to delete list. Admins can delete all lists.
    # Get the group this list belongs to, and check whether current user is a member of that group.
    if group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'POST':
        Group.objects.get(id=group.id).delete()
        messages.success(request, "{group_title} is successfully deleted!.".format(
            group_title=group.name))
        return redirect('uspl:hr_group_list')
    else:
        user_count = User.objects.filter(groups__name=group.name).count()
        project_count = Project.objects.filter(group=group).count()

    context = {
        "group": group,
        "user_count": user_count,
        "project_count": project_count,
    }

    return render(request, 'uspl/delete_group.html', context)


@login_required(login_url='/login/')
def own_project_list(request):
    """Homepage view - list of project a user can view, and ability to add a list."""
    thedate = datetime.datetime.now()

    # Add search form here
    searchform = SearchForm(auto_id=False)

    # Make sure user belongs to at least to one group
    if request.user.groups.all().count() == 0:
        messages.warning(
            request, "You do not yet belong to any groups. Ask your administrator to add you to one.")

    # Superuser see all lists
    if request.user.is_superuser:
        projects = Project.objects.filter(
            completed=False).order_by('group', '-created_date')
    else:
        supervised_projects = Project.objects.filter(
            group__in=request.user.groups.all()).filter(supervisor=request.user)
        tasks = Task.objects.filter(assigned_to=request.user)
        task_projects = Project.objects.filter(task__in=tasks)
        projects = supervised_projects | task_projects
        projects = projects.order_by(
            'completed', '-completed_date', '-due_date').distinct()

        paginator = Paginator(projects, 20)
        page = request.GET.get('page')
        try:
            projects = paginator.page(page)
        except PageNotAnInteger:
            projects = paginator.page(1)
        except EmptyPage:
            projects = paginator.page(paginator.num_pages)

    if request.user.is_superuser:
        task_count = Task.objects.filter(completed=0).count()
    else:
        task_count = Task.objects.filter(completed=0).filter(
            project__group__in=request.user.groups.all()).count()

    context = {
        "projects": projects,
        'thedate': thedate,
        'searchform': searchform,
        "task_count": task_count,
    }
    return render(request, 'uspl/own_project_list.html', context)


@login_required(login_url='/login/')
def employee_project_list(request, employee_id):
    # Make sure user belongs to at least to one group
    if request.user.groups.all().count() == 0:
        messages.warning(
            request, "You do not yet belong to any groups. Ask your administrator to add you to one.")

    # Superuser see all lists
    employee = User.objects.get(id=employee_id)
    supervised_projects = Project.objects.filter(
        group__in=employee.groups.all()).filter(supervisor=employee)
    tasks = Task.objects.filter(assigned_to=employee)
    task_projects = Project.objects.filter(task__in=tasks)
    projects = supervised_projects | task_projects
    projects = projects.order_by(
        'completed', '-completed_date', '-due_date').distinct()
    task_count = Task.objects.filter(completed=0).filter(
        project__group__in=employee.groups.all()).count()

    paginator = Paginator(projects, 20)
    page = request.GET.get('page')
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(1)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)

    context = {
        "projects": projects,
        "task_count": task_count,
        "employee": employee,
    }
    return render(request, 'uspl/employee_project_list.html', context)


@login_required(login_url='/login/')
def GroupDetailsView(request, group_id=None):
    """Homepage view - list of project a user can view, and ability to add a list."""
    thedate = datetime.datetime.now()
    group = Group.objects.get(id=group_id)

    if group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied
    if request.user.profile.is_hr:
        raise PermissionDenied

    # Add search form here
    searchform = SearchForm(auto_id=False)

    # Superuser see all lists
    projects = Project.objects.filter(
        group__name=group.name).filter(completed=False)
    projects = projects.order_by('-created_date')
    projects_count = projects.count()
    users = User.objects.filter(groups__name=group.name).order_by('id')
    users_count = users.count()

    if request.POST:
        form = AddProjectForm(request.user, request.POST,
                              initial={'group': group})
        if form.is_valid():
            try:
                new_project = form.save(commit=False)
                new_project.group = group
                new_project.created_by = request.user
                new_project.slug = slugify(new_project.name)
                new_project.save()
                messages.success(request, "Project has been added")
                mng = list(User.objects.filter(is_staff=True))
                group_members = list(
                    group.user_set.all().exclude(id=request.user.id))
                notify.send(request.user, recipient_list=group_members, actor=request.user,
                            verb='created a new project: ', target=new_project, nf_type='new_project')
                notify.send(request.user, recipient_list=mng, actor=request.user,
                            verb='created a new project: ', target=new_project, obj=group, nf_type='new_project_staff')
                return redirect('uspl:home')
            except IntegrityError:
                messages.warning(
                    request,
                    "There was a problem saving the new list. "
                    "Most likely a list with the same name in the same group already exists.")
    else:
        form = AddProjectForm(request.user, initial={'group': group})

    total_tasks = Task.objects.filter(project__in=projects)
    tasks = total_tasks.filter(project__in=projects).filter(completed=0)
    completed_tasks = Task.objects.filter(
        project__in=projects).filter(completed=True).count()
    ongoing_tasks = tasks.filter(started=True).filter(
        paused=False).filter(submitted=False).count()
    paused_tasks = tasks.filter(paused=True).count()
    not_started_tasks = tasks.filter(started=False).count()
    waiting_for_review_tasks = tasks.filter(submitted=True).count()

    group_news = News.objects.filter(
        group=group).order_by('-created_date')[:20]

    status = []
    busy_members = 0
    for user in users:
        if Task.objects.filter(completed=0).filter(assigned_to=user).exists():
            busy_members += 1
        status.append(Task.objects.filter(
            completed=0).filter(assigned_to=user).exists())
    idle_members = group.user_set.all().count() - busy_members

    context = {
        "group": group,
        "projects": projects,
        "projects_count": projects_count,
        'thedate': thedate,
        'users': users,
        "users_count": users_count,
        'searchform': searchform,
        'completed_tasks': completed_tasks,
        'ongoing_tasks': ongoing_tasks,
        'paused_tasks': paused_tasks,
        'not_started_tasks': not_started_tasks,
        'waiting_for_review_tasks': waiting_for_review_tasks,
        'total_tasks': total_tasks,
        'status': status,
        'form': form,
        "group_news": group_news,
        "busy_members": busy_members,
        "idle_members": idle_members,
    }
    return render(request, 'uspl/group_details.html', context)


@login_required(login_url='/login/')
def GroupProjectList(request, group_id=None):
    """Homepage view - list of project a user can view, and ability to add a list."""
    group = Group.objects.get(id=group_id)

    if group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    # Superuser see all lists
    projects = Project.objects.filter(group__name=group.name)
    projects = projects.order_by(
        'completed', '-completed_date', 'created_date')

    paginator = Paginator(projects, 20)
    page = request.GET.get('page')
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(1)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)

    group_news = News.objects.filter(
        group=group).order_by('-created_date')[:20]

    context = {
        "group": group,
        "projects": projects,
        "group_news": group_news,
    }
    return render(request, 'uspl/group_project_list.html', context)


def ProjectMembers(request, project_id):
    members = []
    project = Project.objects.get(id=project_id)
    tasks = Task.objects.filter(project=project.id)
    for task in tasks:
        if task.assigned_to not in members:
            members.append(task.assigned_to)
    return render(request, 'uspl/project_members.html', {'project': project, 'members': members})


@login_required(login_url='/login/')
def project_detail(request, project_id=None, project_slug=None, view_not_started=False, view_completed=False, view_started=False, view_submitted=False, view_paused=False):
    """Display and manage tasks in a project list."""

    timenow = datetime.datetime.now(tz=timezone.utc)

    # Which tasks to show on this list view?
    if project_slug == "mine":
        tasks = Task.objects.filter(assigned_to=request.user)
    else:
        # Show a specific list, ensuring permissions.
        project = get_object_or_404(Project, id=project_id)
        if project.group not in request.user.groups.all() and not request.user.is_staff:
            raise PermissionDenied
        if request.user.profile.is_hr:
            raise PermissionDenied
        tasks = Task.objects.filter(project=project.id)
        filter = 'all'
        issues = Issue.objects.filter(task__project=project)

    # Project members
    members = []
    for task in tasks:
        if task.assigned_to not in members:
            members.append(task.assigned_to)

    # Additional filtering
    if view_not_started:
        tasks = tasks.filter(started=False)
        filter = 'notstarted'

    if view_paused:
        tasks = tasks.filter(started=True).filter(paused=True).filter(
            submitted=False).filter(completed=False)
        filter = 'paused'

    if view_started:
        tasks = tasks.filter(started=True).filter(paused=False).filter(
            submitted=False).filter(completed=False)
        filter = 'ongoing'

    if view_submitted:
        tasks = tasks.filter(submitted=True).filter(completed=False)
        filter = 'submitted'

    if view_completed:
        tasks = tasks.filter(completed=True)
        filter = 'completed'

    tasks = tasks.order_by("started", "submitted", "completed")

    incomplete_task = Task.objects.filter(
        project=project.id).filter(completed=False)

    project_newses = News.objects.filter(
        project=project).order_by('-created_date')[:20]

    if 'add_task' in request.POST:
        add_task_form = AddTaskForm(request.user, request.POST, initial={
            'assigned_to': request.user.id,
            'priority': 999,
            'project': project
        })
        hashstring = hashlib.sha1(str(request.POST.get('csrf_token')))
        if request.session.get('sesionform') != hashstring:
            if add_task_form.is_valid():
                new_task = add_task_form.save(commit=False)
                name = add_task_form.cleaned_data['name']
                details = add_task_form.cleaned_data['details']
                deadline = add_task_form.cleaned_data['deadline']
                assigned_to = add_task_form.cleaned_data['assigned_to']
                note = add_task_form.cleaned_data['note']
                priority = 999
                task = Task.objects.create(
                    name=name,
                    project=project,
                    details=details,
                    deadline=deadline,
                    assigned_to=assigned_to,
                    note=note,
                    created_date=datetime.datetime.now(),
                    priority=priority,
                )
                messages.success(request, "Task has been added")
                current_site = get_current_site(request)
                mail_subject = 'New Task: '+str(name)
                template = get_template('email/new_task_email.html')
                context = {
                    'task_created_by': request.user,
                    'task': task,
                    'project': project,
                    'domain': current_site.domain,
                }
                html_content = template.render(context)
                txt_content = render_to_string(
                    'email/new_task_email.txt', context)
                to_email = new_task.assigned_to.email
                email = EmailMultiAlternatives(
                    mail_subject, txt_content, to=[to_email]
                )
                email.attach_alternative(html_content, "text/html")
                email.send()
                cr_task = Task.objects.get(id=task.id)
                notify.send(request.user, recipient=assigned_to, actor=request.user,
                            verb='assigned you to a task called ', target=cr_task, nf_type='new_task')
                return redirect('uspl:project_detail', project_id=project_id)
    else:
        add_task_form = AddTaskForm(request.user, initial={'project': project})

    if 'update_project' in request.POST:
        update_project_form = UpdateProjectForm(request.POST, instance=project)
        if update_project_form.is_valid():
            mod_project = update_project_form.save()
            mod_project.save()
            messages.success(request, "The project has been edited.")
            return redirect('uspl:project_detail', project_id=project.id)
    else:
        update_project_form = UpdateProjectForm(instance=project)

    context = {
        "project_id": project_id,
        "project_slug": project_slug,
        "project": project,
        "tasks": tasks,
        "members": members,
        "issues": issues,
        "incomplete_task": incomplete_task,
        "view_completed": view_completed,
        "project_newses": project_newses,
        "add_task_form": add_task_form,
        "update_project_form": update_project_form,
        "timenow": timenow,
        "filter": filter,
    }
    return render(request, 'uspl/project_detail.html', context)


@login_required(login_url='/login/')
def project_toggle_complete(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    # Permissions
    if not (
        (project.supervisor == request.user) or
        (request.user.is_staff) or
        (request.user.profile.teamleader)
    ):
        raise PermissionDenied
    project.completed = True
    project.save()
    messages.success(
        request, "Project: '{}' marked as completed.".format(project.name))
    return redirect(reverse('uspl:project_detail', kwargs={"project_id": project.id}))


@login_required(login_url='/login/')
def UserCurrentTaskView(request, user_id, view_ongoing=False, view_paused=False, view_submitted=False, view_not_started=False, view_overdue=False, view_cld=False):
    user = User.objects.get(id=user_id)

    # Raising Permission Denied
    Found = False
    for group in request.user.groups.all():
        if group in user.groups.all():
            Found = True
    if not Found and not request.user.is_staff:
        raise PermissionDenied

    # Superuser see all lists
    tasks = Task.objects.filter(assigned_to=user).filter(completed=False)
    filter = ''
    incomplete_tasks = tasks.count()
    tasks_not_started = tasks.filter(started=False).count()
    tasks_ongoing = tasks.filter(started=True).filter(
        submitted=False).filter(paused=False).count()
    tasks_submitted = tasks.filter(submitted=True).count()
    tasks_paused = tasks.filter(paused=True).count()

    # Additional filtering
    if view_ongoing:
        tasks = tasks.filter(started=True).filter(
            paused=False).filter(submitted=False)
        filter = "ongoing"
    if view_not_started:
        tasks = tasks.filter(started=False)
        filter = "notstarted"
    if view_paused:
        tasks = tasks.filter(paused=True)
        filter = "paused"
    if view_submitted:
        tasks = tasks.filter(submitted=True)
        filter = "submitted"
    if view_overdue:
        tasks = tasks.filter(
            deadline__lt=timezone.localtime(timezone.now()).date())
        filter = "overdue"
    if view_cld:
        tasks = user.profile.get_cld_tasks()
        filter = "close_to_deadline"

    context = {
        'tasks': tasks,
        'user': user,
        'filter': filter,
        'incomplete_tasks': incomplete_tasks,
        'tasks_not_started': tasks_not_started,
        'tasks_ongoing': tasks_ongoing,
        'tasks_submitted': tasks_submitted,
        'tasks_paused': tasks_paused,
    }
    return render(request, 'uspl/user_tasks.html', context)


@login_required(login_url='/login/')
def UserCompletedTaskView(request, user_id):
    user = User.objects.get(id=user_id)

    # Raising Permission Denied
    Found = False
    for group in request.user.groups.all():
        if group in user.groups.all():
            Found = True

    if not Found and not request.user.is_staff:
        raise PermissionDenied

    tasks = Task.objects.filter(assigned_to=user).filter(
        completed=True).order_by('-completed_date')
    paginator = Paginator(tasks, 20)
    page = request.GET.get('page')
    try:
        tasks = paginator.page(tasks)
    except PageNotAnInteger:
        tasks = paginator.page(1)
    except EmptyPage:
        tasks = paginator.page(paginator.num_pages)

    context = {'tasks': tasks, 'user': user}

    return render(request, 'uspl/user_completed_stasks.html', context)


@login_required(login_url='/login/')
def SubmittedTasks(request):
    submitted_tasks = Task.objects.filter(assigned_to=request.user).filter(
        completed=False).filter(submitted=True).order_by('submitted_date')
    context = {
        'submitted_tasks': submitted_tasks
    }
    return render(request, 'uspl/submitted_tasks.html', context)


@login_required(login_url='/login/')
def TasksAwaitingReview(request):
    submitted_tasks = Task.objects.filter(project__supervisor=request.user).filter(
        completed=False).filter(submitted=True).order_by('submitted_date')
    context = {
        'submitted_tasks': submitted_tasks
    }
    return render(request, 'uspl/awaiting_tasks.html', context)


@login_required(login_url='/login/')
def task_detail(request, task_id):
    """View task details. Allow task details to be edited. Process new comments on task.
    """

    task = get_object_or_404(Task, pk=task_id)
    issues = Issue.objects.filter(task=task_id)
    solved_issues = issues.filter(solved=True)
    unsolved_issues = issues.filter(solved=False)
    thedate = datetime.datetime.now()
    feedbacks = Feedback.objects.filter(task=task_id)

    # Ensure user has permission to view task. Admins can view all tasks.
    # Get the group this task belongs to, and check whether current user is a member of that group.
    if task.project.group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied
    if request.user.profile.is_hr:
        raise PermissionDenied

    # Save submitted feedback
    if request.POST.get('add_feedback'):
        Feedback.objects.create(
            author=request.user,
            created_date=timezone.localtime(timezone.now()),
            updated=timezone.localtime(timezone.now()),
            task=task,
            body=request.POST['feedback-body'],
        )
        task.submitted = False

        task.save()
        current_site = get_current_site(request)
        mail_subject = 'Task Review: ' + str(task.name)
        template = get_template('email/task_reassigned_email.html')
        context = {
            'author': request.user,
            'feedback_body': request.POST['feedback-body'],
            'task': task,
            'domain': current_site.domain,
        }
        html_content = template.render(context)
        txt_content = render_to_string('email/task_started_email.txt', context)
        to_email = task.assigned_to.email
        email = EmailMultiAlternatives(
            mail_subject, txt_content, to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        notify.send(request.user, recipient=task.assigned_to, actor=request.user,
                    verb='sent feedback for your submitted task called ', target=task, nf_type='task_feedback')

        messages.success(
            request, "Feedback posted. Notification email sent to thread participants.")
        return redirect('uspl:task_detail', task_id=task.id,)

    # Raise submitted issue
    if request.POST.get('raise_issue'):

        Issue.objects.create(
            raised_by=request.user,
            raised_date=datetime.datetime.now(),
            task=task,
            name=request.POST['issue-name'],
            details=request.POST['issue-details'],
        )
        issue_effect = request.POST.get('issue-effect', False)
        if issue_effect:
            task.paused = True
            task.resumed = False
            task.save()
        current_site = get_current_site(request)
        mail_subject = 'Issue Raised For ' + str(task.name)
        template = get_template('email/issue_raised_email.html')
        context = {
            'raised_by': request.user,
            'issue_name': request.POST['issue-name'],
            'issue_details': request.POST['issue-details'],
            'issue_effect': issue_effect,
            'task': task,
            'domain': current_site.domain,
        }
        html_content = template.render(context)
        txt_content = render_to_string('email/issue_raised_email.txt', context)
        to_email = task.project.supervisor.email
        email = EmailMultiAlternatives(
            mail_subject, txt_content, to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        notify.send(request.user, recipient=task.project.supervisor, actor=request.user,
                    verb='raised an issue for the task called ', target=task, nf_type='raised_issue')
        messages.success(
            request, "Feedback posted. Notification email sent to thread participants.")
        return redirect('uspl:task_detail', task_id=task.id,)

    # Assign Issue
    if request.POST.get('assign'):
        issue = Issue.objects.get(id=request.POST.get('issue_id', False))
        assigned_to = User.objects.get(id=request.POST['issue_assignment'])
        issue.assigned_to = assigned_to
        issue.assigned_date = datetime.datetime.now()
        issue.save()
        current_site = get_current_site(request)
        mail_subject = 'Issue Assigned: ' + \
            str(issue.task.name)+': '+str(issue.name)
        template = get_template('email/issue_assigned_email.html')
        context = {
            'issue': issue,
            'assigned_to': assigned_to,
            'task': task,
            'domain': current_site.domain,
        }
        html_content = template.render(context)
        txt_content = render_to_string(
            'email/issue_assigned_email.txt', context)
        to_email = assigned_to.email
        email = EmailMultiAlternatives(
            mail_subject, txt_content, to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        return redirect('uspl:task_detail', task_id=task.id,)

    if request.POST.get('submit_solution'):
        issue = Issue.objects.get(id=request.POST.get('issue_id', False))
        issue.solution = request.POST.get('issue-solution')
        issue.solved_by = request.user
        issue.solved = True
        issue.save()
        return redirect('uspl:task_detail', task_id=task.id,)

    if "kpi_form" in request.POST:
        kpi_form = TaskKPIForm(request.POST, initial={'task': task})
        if kpi_form.is_valid():
            kpi = kpi_form.save(commit=False)
            kpi.task = task
            kpi.created = datetime.datetime.now()
            kpi.save()
            return redirect('uspl:task_toggle_done', task.id)
    else:
        kpi_form = TaskKPIForm(initial={'task': task})

    if "edit_task" in request.POST:
        edit_task_form = UpdateTaskForm(request.POST, instance=task, initial={
                                        'project': task.project})
        if edit_task_form.is_valid():
            mod_task = edit_task_form.save(commit=False)
            mod_task.name = edit_task_form.cleaned_data['name']
            mod_task.details = edit_task_form.cleaned_data['details']
            mod_task.deadline = edit_task_form.cleaned_data['deadline']
            mod_task.assigned_to = edit_task_form.cleaned_data['assigned_to']
            mod_task.note = edit_task_form.cleaned_data['note']
            mod_task.priority = edit_task_form.cleaned_data['priority']
            mod_task.save()
            messages.success(request, "The Task has been edited.")
            current_site = get_current_site(request)
            return redirect('uspl:task_detail', task_id=task.id)
    else:
        edit_task_form = UpdateTaskForm(
            instance=task, initial={'project': task.project})

    task_news = News.objects.filter(task=task).order_by('-created_date')

    context = {
        "task": task,
        "issues": issues,
        "solved_issues": solved_issues,
        "unsolved_issues": unsolved_issues,
        "feedbacks": feedbacks,
        "thedate": thedate,
        "kpi_form": kpi_form,
        "edit_task_form": edit_task_form,
        "task_news": task_news,
    }

    return render(request, 'uspl/task_detail.html', context)


@login_required(login_url='/login/')
def task_toggle_started(request, task_id):
    """Toggle the submit status of a task from done to undone, or vice versa.
    Redirect to the list from which the task came.
    """
    task = get_object_or_404(Task, pk=task_id)
    supervisor = task.project.supervisor

    # Permissions
    if not task.assigned_to == request.user:
        raise PermissionDenied

    task.started = True
    task.resumed = False
    task.save()
    current_site = get_current_site(request)
    mail_subject = 'Task Started: ' + str(task.name)
    template = get_template('email/task_started_email.html')
    context = {
        'user': request.user,
        'supervisor': supervisor,
        'task_started_by': request.user,
        'task': task,
        'domain': current_site.domain,
    }
    html_content = template.render(context)
    txt_content = render_to_string('email/task_started_email.txt', context)
    to_email = supervisor.email
    email = EmailMultiAlternatives(
        mail_subject, txt_content, to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    notify.send(request.user, recipient=task.project.supervisor, actor=request.user,
                verb='started a task called ', target=task, nf_type='started_task')
    messages.success(
        request, "Task started status changed for '{}'".format(task.name))
    return redirect(reverse('uspl:task_detail', kwargs={"task_id": task.id}))


@login_required(login_url='/login/')
def task_toggle_resumed(request, task_id):
    """Toggle the submit status of a task from done to undone, or vice versa.
    Redirect to the list from which the task came.
    """
    task = get_object_or_404(Task, pk=task_id)
    supervisor = task.project.supervisor
    unsolved_issues = Issue.objects.filter(task=task).filter(solved=False)

    # Permissions
    if not task.assigned_to == request.user:
        raise PermissionDenied

    task.paused = False
    task.resumed = True
    task.save()
    current_site = get_current_site(request)
    mail_subject = 'Task Resumed: ' + str(task.name)
    template = get_template('email/task_resumed_email.html')
    context = {
        'user': request.user,
        'supervisor': supervisor,
        'task_started_by': request.user,
        'task': task,
        'domain': current_site.domain,
        'unsolved_issues': unsolved_issues,
    }
    html_content = template.render(context)
    txt_content = render_to_string('email/task_resumed_email.txt', context)
    to_email = supervisor.email
    email = EmailMultiAlternatives(
        mail_subject, txt_content, to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    notify.send(request.user, recipient=task.project.supervisor, actor=request.user,
                verb='resumed a paused task called ', target=task, nf_type='resumed_task')
    messages.success(
        request, "Task started status changed for '{}'".format(task.name))
    return redirect(reverse('uspl:task_detail', kwargs={"task_id": task.id}))


@login_required(login_url='/login/')
def task_toggle_submit(request, task_id):
    """Toggle the submit status of a task from done to undone, or vice versa.
    Redirect to the list from which the task came.
    """
    task = get_object_or_404(Task, pk=task_id)
    supervisor = task.project.supervisor
    prev_status = task.submitted
    supervisor_perm = False
    owner_perm = False
    if request.user == supervisor:
        supervisor_perm = True
    if request.user == task.assigned_to:
        owner_perm = True

    # Permissions
    if not(supervisor_perm or owner_perm):
        raise PermissionDenied

    task.submitted = not task.submitted
    task.save()

    current_site = get_current_site(request)
    if not prev_status:
        mail_subject = 'Task Submitted: ' + str(task.name)
    else:
        mail_subject = 'Submission Cancelled: ' + str(task.name)
    template = get_template('email/task_submitted_email.html')
    context = {
        'user': request.user,
        'supervisor': supervisor,
        'task_submitted_by': request.user,
        'task': task,
        'submitted': prev_status,
        'domain': current_site.domain,
    }
    html_content = template.render(context)
    txt_content = render_to_string('email/task_submitted_email.txt', context)
    to_email = supervisor.email
    email = EmailMultiAlternatives(
        mail_subject, txt_content, to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    notify.send(request.user, recipient=task.project.supervisor, actor=request.user,
                verb='submitted a task called ', target=task, nf_type='submitted_task')
    messages.success(
        request, "Task submit status changed for '{}'".format(task.name))
    return redirect(reverse('uspl:task_detail', kwargs={"task_id": task.id}))


@login_required(login_url='/login/')
def task_toggle_done(request, task_id):
    """Toggle the submit status of a task from done to undone, or vice versa.
    Redirect to the list from which the task came.
    """
    task = get_object_or_404(Task, pk=task_id)
    task_owner = task.assigned_to

    # Permissions
    if not task.project.supervisor == request.user:
        raise PermissionDenied
    task.completed = True
    task.submitted = True

    task.save()
    kpi = get_object_or_404(Kpi, task=task)
    current_site = get_current_site(request)
    mail_subject = 'Task Completed: ' + str(task.name)
    template = get_template('email/task_completed_email.html')
    context = {
        'task_owner': task_owner,
        'supervisor': task.project.supervisor,
        'task': task,
        'kpi': kpi,
        'domain': current_site.domain,
    }
    html_content = template.render(context)
    txt_content = render_to_string('email/task_completed_email.txt', context)
    to_email = task_owner.email
    email = EmailMultiAlternatives(
        mail_subject, txt_content, to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    notify.send(request.user, recipient=task.assigned_to, actor=request.user,
                verb='marked your following task as completed: ', target=task, nf_type='completed_task')
    messages.success(request, "Task status changed for '{}'".format(task.name))
    return redirect(reverse('uspl:task_detail', kwargs={"task_id": task.id}))


@login_required(login_url='/login/')
def DeleteProjectView(request, project_id):
    """Delete an entire list. Danger Will Robinson! Only staff members should be allowed to access this view.
    """
    project = get_object_or_404(Project, pk=project_id)

    # Ensure user has permission to delete list. Admins can delete all lists.
    # Get the group this list belongs to, and check whether current user is a member of that group.
    if project.group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'POST':
        Project.objects.get(id=project.id).delete()
        messages.success(request, "{project_title} is successfully deleted!.".format(
            project_title=project.name))
        return redirect('uspl:home')
    else:
        task_count_done = Task.objects.filter(
            project=project.id, completed=True).count()
        task_count_undone = Task.objects.filter(
            project=project.id, completed=False).count()
        task_count_total = Task.objects.filter(project=project.id).count()

    project_newses = News.objects.filter(
        project=project).order_by('-created_date')[:20]

    context = {
        "project": project,
        "task_count_done": task_count_done,
        "task_count_undone": task_count_undone,
        "task_count_total": task_count_total,
        "project_newses": project_newses,
    }

    return render(request, 'uspl/delete_project.html', context)


@login_required(login_url='/login/')
def DeleteTaskView(request, task_id):
    """Delete a task. Danger Will Robinson! Only staff members should be allowed to access this view.
    """
    task = get_object_or_404(Task, pk=task_id)

    # Ensure user has permission to delete list. Admins can delete all lists.
    # Get the group this list belongs to, and check whether current user is a member of that group.
    if task.project.group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'POST':
        Task.objects.get(id=task.id).delete()
        messages.success(
            request, "{task_title} is successfully deleted!.".format(task_title=task.name))
        return redirect('uspl:project_detail', task.project.id)
    task_news = News.objects.filter(task=task).order_by('-created_date')
    context = {
        "task": task,
        "task_news": task_news,
    }

    return render(request, 'uspl/delete_task.html', context)


"""
View for Issue Detail and Solved Toggle

"""
@login_required(login_url='/login/')
def issue_detail(request, issue_id=None):
    """Display and manage issue in a Task."""

    # Show a specific issue, ensuring permissions.
    issue = get_object_or_404(Issue, id=issue_id)
    comments = issue.comment_set.all()
    if issue.task.project.group not in request.user.groups.all() and not request.user.is_staff:
        raise PermissionDenied

    # Save submitted feedback
    if request.POST.get('add_comment'):
        Comment.objects.create(
            author=request.user,
            posted_date=datetime.datetime.now(),
            issue=issue,
            body=request.POST['comment-body'],
        )
        current_site = get_current_site(request)
        mail_subject = 'New comment on your issue: ' + str(issue.name)
        template = get_template('email/comment_email.html')
        context = {
            'author': request.user,
            'comment_body': request.POST['comment-body'],
            'issue': issue,
            'domain': current_site.domain,
        }
        html_content = template.render(context)
        txt_content = render_to_string('email/comment_email.txt', context)
        to_email = issue.raised_by.email
        email = EmailMultiAlternatives(
            mail_subject, txt_content, to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        all_comments = issue.comment_set.all()
        user_list = []
        for comment in all_comments:
            if comment.author not in user_list and comment.author != issue.raised_by:
                user_list.append(comment.author)
        if request.user != issue.raised_by:
            if request.user in user_list:
                user_list.remove(request.user)
            notify.send(request.user, recipient=issue.raised_by, actor=request.user,
                        verb='commented on your issue: ', target=issue, nf_type='one_new_comment')
            if user_list:
                notify.send(request.user, recipient_list=user_list, actor=request.user,
                            verb='also commented on the issue called ', target=issue, nf_type='new_comment_group')
        else:
            if user_list:
                notify.send(request.user, recipient_list=user_list, actor=request.user,
                            verb='also commented on the issue called ', target=issue, nf_type='new_comment_group')
        messages.success(
            request, "Comment posted. Notification email sent to thread participants.")
        return redirect('uspl:issue_detail', issue_id=issue.id,)

    context = {
        "issue": issue,
        "comments": comments,
    }
    return render(request, 'uspl/issue_detail.html', context)


@login_required(login_url='/login/')
def user_issues(request, user_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    user = User.objects.get(id=user_id)
    issues = Issue.objects.filter(raised_by__id=user_id).order_by(
        'solved', '-solved_date', '-raised_date')
    paginator = Paginator(issues, 20)
    page = request.GET.get('page')
    try:
        issues = paginator.page(page)
    except PageNotAnInteger:
        issues = paginator.page(1)
    except EmptyPage:
        issues = paginator.page(paginator.num_pages)
    return render(request, 'uspl/user_issues.html', {"issues": issues, 'user': user})


@login_required(login_url='/login/')
def supervised_issues(request, user_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    issues = Issue.objects.filter(task__project__supervisor__id=user_id).exclude(
        task__assigned_to=request.user).order_by('solved', '-solved_date', '-raised_date')
    paginator = Paginator(issues, 20)
    page = request.GET.get('page')
    try:
        issues = paginator.page(page)
    except PageNotAnInteger:
        issues = paginator.page(1)
    except EmptyPage:
        issues = paginator.page(paginator.num_pages)
    return render(request, 'uspl/supervised_issues.html', {"issues": issues})


@login_required(login_url='/login/')
def solved_issues(request, user_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    user = User.objects.get(id=user_id)
    solved_issues = Issue.objects.filter(
        solved_by__id=user_id).order_by('-solved_date')
    paginator = Paginator(solved_issues, 20)
    page = request.GET.get('page')
    try:
        solved_issues = paginator.page(page)
    except PageNotAnInteger:
        solved_issues = paginator.page(1)
    except EmptyPage:
        solved_issues = paginator.page(paginator.num_pages)
    return render(request, 'uspl/solved_issues.html', {"solved_issues": solved_issues, 'user': user})


@login_required(login_url='/login/')
def group_issues(request, user_id=None, group_id=None):
    if request.user.profile.is_hr:
        raise PermissionDenied
    if not request.user.is_staff:
        issues = Issue.objects.filter(task__project__group__in=request.user.groups.all(
        )).order_by('solved', '-solved_date', '-raised_date')
    else:
        issues = Issue.objects.filter(task__project__group__id=group_id).order_by(
            'solved', '-solved_date', '-raised_date')
    paginator = Paginator(issues, 20)
    page = request.GET.get('page')
    try:
        issues = paginator.page(page)
    except PageNotAnInteger:
        issues = paginator.page(1)
    except EmptyPage:
        issues = paginator.page(paginator.num_pages)
    return render(request, 'uspl/group_issues.html', {"issues": issues})


@login_required(login_url='/login/')
def project_issues(request, project_id):
    project = Project.objects.get(id=project_id)
    issues = Issue.objects.filter(task__project__id=project_id).order_by(
        'solved', '-solved_date', '-raised_date')
    paginator = Paginator(issues, 20)
    page = request.GET.get('page')
    try:
        issues = paginator.page(page)
    except PageNotAnInteger:
        issues = paginator.page(1)
    except EmptyPage:
        issues = paginator.page(paginator.num_pages)
    return render(request, 'uspl/project_issues.html', {"issues": issues, 'project': project})


@login_required(login_url='/login/')
def issue_toggle_solved(request, issue_id, comment_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    solution = get_object_or_404(Comment, pk=comment_id)

    # Permissions
    issue.solved = True
    issue.solved_by = solution.author
    issue.solution = solution.body
    issue.solved_date = datetime.datetime.now()
    issue.save()
    solution.marked_as_solution = True
    solution.save()
    all_comments = issue.comment_set.all()
    user_list = []
    for comment in all_comments:
        if comment.author not in user_list and comment.author != issue.solved_by and comment.author != issue.raised_by:
            user_list.append(comment.author)

    if request.user != issue.solved_by:
        notify.send(request.user, recipient=issue.solved_by, actor=request.user,
                    verb='marked your comment as the solution for the issue called ', target=issue, nf_type='marked_solution')
    if user_list:
        notify.send(request.user, recipient_list=user_list, actor=issue.solved_by,
                    verb='solved the issue called ', target=issue, nf_type='marked_solution_group')
    """
    kpi = get_object_or_404(Kpi, task=task)
    current_site = get_current_site(request)
    mail_subject = 'Task Completed: ' + str(task.name)
    template = get_template('email/task_completed_email.html')
    context = {
        'task_owner': task_owner,
        'supervisor': task.project.supervisor,
        'task': task,
        'kpi': kpi,
        'domain': current_site.domain,
    }
    html_content = template.render(context)
    txt_content = render_to_string('email/task_completed_email.txt', context)
    to_email = task_owner.email
    email = EmailMultiAlternatives(
        mail_subject, txt_content, to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    """
    messages.success(
        request, "Issue status changed for '{}'".format(issue.name))
    return redirect(reverse('uspl:issue_detail', kwargs={"issue_id": issue.id}))


"""
Views for News with pagination
"""


def news_list(request, group_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    if request.user.is_staff:
        all_news = News.objects.all().order_by('-created_date')
    else:
        all_news = News.objects.filter(
            group__in=request.user.groups.all()).order_by('-created_date')
    paginator = Paginator(all_news, 20)
    page = request.GET.get('page')
    try:
        all_news = paginator.page(page)
    except PageNotAnInteger:
        all_news = paginator.page(1)
    except EmptyPage:
        all_news = paginator.page(paginator.num_pages)
    return render(request, 'uspl/news_list.html', {'all_news': all_news})


def group_news_all(request, group_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    news_group = Group.objects.get(id=group_id)
    all_news = News.objects.filter(group=news_group).order_by('-created_date')
    paginator = Paginator(all_news, 20)
    page = request.GET.get('page')
    try:
        all_news = paginator.page(page)
    except PageNotAnInteger:
        all_news = paginator.page(1)
    except EmptyPage:
        all_news = paginator.page(paginator.num_pages)
    context = {
        'news_group': news_group,
        'all_news': all_news
    }
    return render(request, 'uspl/group_news_all.html', context)


def project_news_all(request, project_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    project = Project.objects.get(id=project_id)
    project_name = project.name
    all_news = News.objects.filter(project=project).order_by('-created_date')
    paginator = Paginator(all_news, 20)
    page = request.GET.get('page')
    try:
        all_news = paginator.page(page)
    except PageNotAnInteger:
        all_news = paginator.page(1)
    except EmptyPage:
        all_news = paginator.page(paginator.num_pages)

    context = {
        'all_news': all_news,
        'project_name': project_name,
    }
    return render(request, 'uspl/project_news_all.html', context)


def task_news_all(request, task_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    task = Task.objects.get(id=task_id)
    all_news = News.objects.filter(task_id=task_id).order_by('-created_date')
    paginator = Paginator(all_news, 20)
    page = request.GET.get('page')
    try:
        all_news = paginator.page(page)
    except PageNotAnInteger:
        all_news = paginator.page(1)
    except EmptyPage:
        all_news = paginator.page(paginator.num_pages)

    context = {
        'all_news': all_news,
        'task': task,
    }
    return render(request, 'uspl/task_news_all.html', context)


def employee_news_all(request, employee_id):
    if request.user.profile.is_hr:
        raise PermissionDenied
    employee = User.objects.get(id=employee_id)
    all_news = News.objects.filter(owner=employee).order_by('-created_date')
    paginator = Paginator(all_news, 20)
    page = request.GET.get('page')
    try:
        all_news = paginator.page(page)
    except PageNotAnInteger:
        all_news = paginator.page(1)
    except EmptyPage:
        all_news = paginator.page(paginator.num_pages)

    context = {
        'all_news': all_news,
        'employee': employee,
    }
    return render(request, 'uspl/employee_news_all.html', context)


"""
Views for User creation, individual profile, group lists
"""


def EmployeeListView(request):
    employee_list = User.objects.all()
    context = {
        'employee_list': employee_list,
    }
    return render(request, "uspl/employee_list.html", context)


@staff_only
@login_required(login_url='/login/')
def CreateUserView(request):
    if request.method == 'POST':
        form = CreateUserForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            password = User.objects.make_random_password(length=8)
            user.refresh_from_db()  # load the profile instance created by the signal
            user.set_password(password)
            for group in form.cleaned_data.get('group'):
                user.groups.add(group)
            get_group = form.cleaned_data.get('group')
            selected_group = Group.objects.get(id=get_group)
            if selected_group.name == 'HR':
                user.profile.is_hr = True
                user.is_staff = True

            if selected_group.name == 'Management':
                user.is_staff = True

            dsg = Designation.objects.get(id=request.POST.get('dsg'))
            user.profile.dsg = dsg
            user.profile.birth_date = form.cleaned_data.get('birth_date')
            user.profile.phone_number = form.cleaned_data.get('phone_number')
            user.profile.present_address = form.cleaned_data.get(
                'present_address')
            user.profile.highest_degree = form.cleaned_data.get(
                'highest_degree')
            user.profile.date_of_joining = form.cleaned_data.get(
                'date_of_joining')
            #user.profile.designation = form.cleaned_data.get('designation')
            #user.profile.teamleader = form.cleaned_data.get('teamleader')
            user.profile.date_of_birth = form.cleaned_data.get('date_of_birth')
            user.profile.blood_group = form.cleaned_data.get('blood_group')
            user.profile.emergency_contact = form.cleaned_data.get(
                'emergency_contact')
            user.profile.report_to = User.objects.get(
                id=request.POST.get('reports_to'))
            user.profile.image = static('uspl/img/default_image.jpg')
            user.save()
            current_site = get_current_site(request)
            mail_subject = 'Welcome to Ulkasemi EMS'
            message = render_to_string('uspl/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'password': password,
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()
            return redirect('uspl:home')
    else:
        form = CreateUserForm()
    return render(request, 'uspl/create_user.html', {'form': form})


@staff_only
@login_required(login_url='/login/')
def load_dsgs(request):
    group_id = request.GET.get('group')
    group = Group.objects.get(id=group_id)

    dsgs = Designation.objects.filter(group__id=group_id)
    managers = group.teamleader.employees.all()
    return render(request, 'uspl/dsg_dropdown_list_options.html', {'dsgs': dsgs, 'managers': managers})


# View for activating new account
def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')


@login_required(login_url='/login/')
def UpdateEmployeeProfile(request, employee_id):
    employee = User.objects.get(id=employee_id)
    profile_news = News.objects.filter(
        owner=employee).order_by('-created_date')[:20]
    if request.user != employee:
        raise PermissionDenied
    employee_profile = User.objects.get(id=employee_id).profile
    if request.method == 'POST':
        # if request.user.is_staff:
            # update user info
        form = UpdateProfileForm(request.POST, instance=employee_profile)
        if form.is_valid():
            user_profile = form.save()
            user_profile.refresh_from_db()  # load the profile instance created by the signal
            user_profile.phone_number = form.cleaned_data.get('phone_number')
            user_profile.present_address = form.cleaned_data.get(
                'present_address')
            user_profile.highest_degree = form.cleaned_data.get(
                'highest_degree')
            user_profile.emergency_contact = form.cleaned_data.get(
                'emergency_contact')
            user_profile.save()
            return redirect(reverse('uspl:employee_profile', kwargs={"employee_id": employee_id}))
    else:
        form = UpdateProfileForm(instance=employee_profile)
    context = {
        'employee': employee,
        'employee_profile': employee_profile,
        'profile_news': profile_news,
        'form': form,
    }
    return render(request, 'uspl/update_profile.html', context)


@login_required(login_url='/login/')
def EmployeeProfileView(request, employee_id):
    employee = User.objects.get(id=employee_id)
    current_tasks = Task.objects.filter(
        assigned_to=employee).filter(completed=False)
    profile_news = News.objects.filter(
        owner=employee).order_by('-created_date')[:20]

    supervised_projects = Project.objects.filter(
        supervisor__id=employee_id).filter(completed=False)
    tasks = Task.objects.filter(assigned_to=employee).filter(completed=False)
    task_projects = Project.objects.filter(task__in=tasks)
    projects = supervised_projects | task_projects
    projects = projects.distinct()
    raised_issues = Issue.objects.filter(
        raised_by=employee).filter(solved=False)

    if request.user.is_staff or request.user.teamleader_set.all() or request.user == employee:
        employee_kpi = Kpi.objects.filter(task__assigned_to=employee).filter(
            created__year=datetime.datetime.now().year).annotate(Avg('skill'))
        if employee_kpi:
            avg = employee_kpi.aggregate(Avg('skill'), Avg('attitude'), Avg(
                'motivation'), Avg('communication'), Avg('time_management'), Avg('reliability'))
            overall_avg = ((float(avg['skill__avg'])
                            + float(avg['attitude__avg'])
                            + float(avg['motivation__avg'])
                            + float(avg['communication__avg'])
                            + float(avg['time_management__avg'])
                            + float(avg['reliability__avg']))/60)*100
        else:
            avg = []
            employee_kpi = []
            overall_avg = 0
    else:
        avg = []
        overall_avg = 0
        employee_kpi = []

    if request.POST.get('upload_image') and request.user == employee:
        if employee.profile.image != static('uspl/img/default_image.jpg'):
            employee.profile.image.delete()
        employee.profile.image = request.FILES['new_pic']
        employee.profile.save()
        return redirect(reverse('uspl:employee_profile', kwargs={"employee_id": employee_id}))

    context = {
        'employee': employee,
        'current_tasks': current_tasks,
        'avg': avg,
        'profile_news': profile_news,
        'overall_avg': overall_avg,
        'projects': projects,
        'tasks': tasks,
        'raised_issues': raised_issues,
        'employee_kpi': employee_kpi,
    }
    return render(request, 'uspl/employee_profile.html', context)


@login_required(login_url='/login/')
def EmployeeKPIView(request, employee_id, year):
    if year == None:
        year = datetime.datetime.now().year
    employee = User.objects.get(id=employee_id)

    filter = int(year)

    # ==employee:
    if not(request.user.is_staff or request.user.teamleader_set.all() or request.user == employee):
        raise PermissionDenied

    years_kpi_created = Kpi.objects.filter(
        task__assigned_to=employee).dates('created', 'year')
    year_list = []
    for each_year in years_kpi_created:
        year_list.append(each_year.year)

    year_list = reversed(year_list)

    tasks_this_year = Task.objects.filter(
        assigned_to=employee).filter(completed_date__year=year)
    project_count = Project.objects.filter(task__assigned_to=employee).filter(
        task__started_date__year=year).distinct().count()
    tasks_count = tasks_this_year.count()
    raised_issues_count = Issue.objects.filter(
        raised_by=employee).filter(raised_date__year=year).count()
    solved_issues_count = Issue.objects.filter(
        solved_by=employee).filter(solved_date__year=year).count()
    supervised_project_count = Project.objects.filter(
        supervisor=employee).filter(created_date__year=year).count()

    kpis = Kpi.objects.filter(
        task__assigned_to=employee).filter(created__year=year)
    avg = kpis.aggregate(Avg('skill'), Avg('attitude'), Avg('motivation'), Avg(
        'communication'), Avg('time_management'), Avg('reliability'))
    if kpis:
        overall_avg = (
            (float(avg['skill__avg'])
             + float(avg['attitude__avg'])
             + float(avg['motivation__avg'])
             + float(avg['communication__avg'])
             + float(avg['time_management__avg'])
             + float(avg['reliability__avg'])
             )/60)*100
    else:
        overall_avg = 0

    kpis = kpis.order_by('-task__completed_date')
    paginator = Paginator(kpis, 15)
    page = request.GET.get('page')
    try:
        kpis = paginator.page(page)
    except PageNotAnInteger:
        kpis = paginator.page(1)
    except EmptyPage:
        kpis = paginator.page(paginator.num_pages)

    context = {
        'employee': employee,
        'kpis': kpis,
        'year': year,
        'avg': avg,
        'year_list': year_list,
        'overall_avg': overall_avg,
        'project_count': project_count,
        'tasks_count': tasks_count,
        'raised_issues_count': raised_issues_count,
        'solved_issues_count': solved_issues_count,
        'supervised_project_count': supervised_project_count,
        'filter': filter,
    }

    return render(request, 'uspl/employee_kpi.html', context)


@login_required(login_url='/login/')
def ResetPasswordView(request):
    profile_news = News.objects.filter(
        owner=request.user).order_by('-created_date')[:20]
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(
                request, 'Your password was successfully updated!')
            return redirect('uspl:employee_profile', request.user.id)
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'uspl/reset_password.html', {'form': form, 'profile_news': profile_news, })


@login_required(login_url='/login/')
def GroupMembersView(request, group_id=None, view_all=False):
    if view_all:
        group = []
        users = User.objects.all()
        filter = "all"
        if not request.user.is_staff:
            raise PermissionDenied
    else:
        group = Group.objects.get(id=group_id)
        filter = str(group.name)
        users = group.user_set.all()
        if group not in request.user.groups.all() and not request.user.is_staff:
            raise PermissionDenied
    #users = users.filter(is_staff = False)
    users = users.order_by('profile__date_of_joining')

    average_kpi = []
    for user in users:
        average_kpi.append(user.profile.get_employee_kpi_average())

    if "update_employee" in request.POST and request.user.is_staff:
        user = User.objects.get(id=request.POST.get('user_id', False))
        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')

        dsg = Designation.objects.get(
            id=request.POST.get('dsg_selected', False))
        user.profile.dsg = dsg
        user.groups = request.POST.getlist('group_selected')
        user.profile.phone_number = request.POST.get('phone_number')
        user.profile.date_of_joining = request.POST.get('date_of_joining')
        user.profile.date_of_birth = request.POST.get('date_of_birth')
        user.profile.present_address = request.POST.get('present_address')
        user.profile.highest_degree = request.POST.get('highest_degree')
        user.profile.blood_group = request.POST.get('blood_group')
        user.profile.emergency_contact = request.POST.get('emergency_contact')
        if request.POST.get('reports_to'):
            user.profile.reports_to = User.objects.get(
                id=request.POST.get('reports_to'))
        user.save()
        user.profile.save()
        return HttpResponseRedirect(request.path_info)

    context = {
        'group': group,
        'users': users,
        'view_all': view_all,
        'filter': filter
    }
    return render(request, 'uspl/group_members.html', context)


@login_required(login_url='/login/')
def ajax_get_profile_modal(request):
    user_id = request.GET.get('user_id')
    user = User.objects.get(id=user_id)
    context = {
        'employee': user
    }
    return render(request, 'uspl/get_profile_modal.html', context)


@staff_only
@login_required(login_url='/login/')
def ajax_get_update_profile_modal(request):
    user_id = request.GET.get('user_id')
    user = User.objects.get(id=user_id)

    if user.profile.is_temaleader():
        manager_list = User.objects.filter(
            is_staff=True).exclude(first_name__iexact="admin")
    else:
        manager_list = []
        for group in user.groups.all():
            for teamleader in group.teamleader.employees.all():
                manager_list.append(teamleader)
    context = {
        'employee': user,
        'manager_list': manager_list,
    }
    return render(request, 'uspl/get_update_profile_form.html', context)


@staff_only
@login_required(login_url='/login/')
def DesignationListViewHR(request):
    if not(request.user.is_staff):
        raise PermissionDenied

    designations = Designation.objects.all().order_by('group')

    if 'update_dsg' in request.POST:
        dsg = Designation.objects.get(id=request.POST.get('dsg_id', False))
        if request.POST.get('new_name'):
            dsg.title = request.POST.get('new_name')
        if request.POST.get('new_jd'):
            dsg.job_description = request.POST.get('new_jd')
        dsg.save()
        return redirect('uspl:hr_dsg_list')

    if 'add_dsg' in request.POST:
        group = Group.objects.get(id=request.POST.get('group_id', False))
        title = request.POST.get('title')
        jd = request.POST.get('jd')
        Designation.objects.create(
            group=group,
            title=title,
            job_description=jd,
        )
        return redirect('uspl:hr_dsg_list')

    return render(request, 'uspl/hr_designation_list.html', {'designations': designations})


@login_required(login_url='/login/')
def DeleteDesignationView(request, dsg_id):
    """Delete an entire list. Danger Will Robinson! Only staff members should be allowed to access this view.
    """
    dsg = get_object_or_404(Designation, pk=dsg_id)

    # Ensure user has permission to delete list. Admins can delete all lists.
    # Get the group this list belongs to, and check whether current user is a member of that group.
    if not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'POST':
        Designation.objects.get(id=dsg.id).delete()
        messages.success(
            request, "{dsg_title} is successfully deleted!.".format(dsg_title=dsg.title))
        return redirect('uspl:hr_dsg_list')
    else:
        user_count = Profile.objects.filter(dsg=dsg).count()

    context = {
        "dsg": dsg,
        "user_count": user_count,
    }

    return render(request, 'uspl/delete_dsg.html', context)


@staff_only
@login_required(login_url='/login/')
def NoticeListViewHR(request):
    if not(request.user.is_staff):
        raise PermissionDenied
    current_notices = Notice.boardObjects.all()
    timenow = datetime.datetime.now(tz=timezone.utc)

    if 'add_notice' in request.POST:
        title = request.POST.get('title')
        body = request.POST.get('body')
        created_on = datetime.datetime.now(tz=timezone.utc)
        expires_on_date = request.POST.get('expires_on_date')
        expires_on_time = request.POST.get('expires_on_time')
        expires_on = str(expires_on_date) + " " + str(expires_on_time)
        if request.POST.get('important'):
            important = request.POST.get('important')
        else:
            important = False
        Notice.objects.create(
            title=title,
            body=body,
            created_on=created_on,
            expires_on=expires_on,
            important=important,
        )
        return redirect('uspl:hr_notice_list')

    if 'update_notice' in request.POST:
        notice = Notice.objects.get(id=request.POST.get('notice_id', False))
        notice.title = request.POST.get('new_title')
        notice.body = request.POST.get('new_body')
        expires_on_date = request.POST.get('expires_on_date')
        expires_on_time = request.POST.get('expires_on_time')
        expires_on = str(expires_on_date) + " " + str(expires_on_time)
        notice.expires_on = expires_on
        if request.POST.get('new_important'):
            notice.important = request.POST.get('new_important')
        else:
            notice.important = False
        notice.save()
        return redirect('uspl:hr_notice_list')

    if 'delete_notice' in request.POST:
        notice = Notice.objects.get(id=request.POST.get('notice_id', False))
        notice.delete()
        return redirect('uspl:hr_notice_list')

    return render(request, 'uspl/hr_notice_list.html', {'current_notices': current_notices, 'timenow': timenow})


@login_required(login_url='/login/')
def NoticeListAll(request):
    notices = Notice.objects.all().order_by('-created_on')
    paginator = Paginator(notices, 20)
    page = request.GET.get('page')
    try:
        notices = paginator.page(page)
    except PageNotAnInteger:
        notices = paginator.page(1)
    except EmptyPage:
        notices = paginator.page(paginator.num_pages)

    if 'delete_notice' in request.POST:
        notice = Notice.objects.get(id=request.POST.get('notice_id', False))
        notice.delete()
        return redirect('uspl:hr_notice_list_all')

    context = {
        'notices': notices
    }
    return render(request, 'uspl/notice_list_all.html', context)


@login_required(login_url='/login/')
def NoticeDetail(request, notice_id):

    notice = get_object_or_404(Notice, pk=notice_id)

    context = {
        'notice': notice
    }

    return render(request, 'uspl/notice_detail.html', context)


@login_required(login_url='/login/')
def toggle_user_status(request):
    get_req = request.GET.get('id')
    employee = User.objects.get(id=get_req)
    employee.is_active = not employee.is_active
    employee.save()
    if employee.is_active:
        data = {'message': 'user activated!'}
    else:
        data = {'message': 'user deactivated!'}
    return JsonResponse(data)


@login_required(login_url='/login/')
def ContactUsView(request):
    if "send_feedback" in request.POST:
        name = request.POST.get("name")
        reply_to = request.POST.get("email")
        feedback = request.POST.get("text")
        mail_subject = 'EMS Feedback: '+name
        message = "Sender: "+name+"\nEmail: "+reply_to+"\nMessage:\n"+feedback
        email = EmailMessage(
            mail_subject, message, to=['simul@ulkasemi.com', 'benazir@ulkasemi.com', 'rashik@ulkasemi.com'], reply_to=[reply_to],
        )
        email.send()
        return redirect('uspl:home')
    return render(request, 'uspl/contact_us.html')


def logoutView(request):
    logout(request)
    return redirect('/login/')
