from django.shortcuts import get_object_or_404, render, redirect
# from .models import Status, Acompleted, Progress, Anextweek, AIssue, Reply
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from uspl.models import Project, Task, Issue, Feedback
from uspl.models import Reply as Fd_reply
from django.db.models import Q
from itertools import chain
from operator import attrgetter
from django.http import JsonResponse
import datetime

# Create your views here.
@login_required(login_url='/login/')
def inbox(request):
    all_status = Status.objects.filter(recipent = request.user).filter(sent=True)
    own_task_feedbacks = Feedback.objects.filter(task__assigned_to=request.user)
    replies = Fd_reply.objects.filter(feedback__task__project__supervisor=request.user)
    messages = sorted(chain(all_status, own_task_feedbacks, replies), key=attrgetter('updated'), reverse=True)
    paginator = Paginator(messages, 30)
    page = request.GET.get('page')
    try:
        messages = paginator.page(page)
    except PageNotAnInteger:
        messages = paginator.page(1)
    except EmptyPage:
        messages = paginator.page(paginator.num_pages)
            
    context = {
        'messages': messages
    }
    return render(request, 'weekly_status/inbox.html', context)
    
@login_required(login_url='/login/')
def sent(request):
    all_status = Status.objects.filter(sender = request.user).filter(sent=True)
    feedbacks = Feedback.objects.filter(task__project__supervisor=request.user)
    replies = Fd_reply.objects.filter(feedback__task__assigned_to=request.user)
    messages = sorted(chain(all_status, feedbacks, replies), key=attrgetter('updated'), reverse=True)
    paginator = Paginator(messages, 30)
    page = request.GET.get('page')
    try:
        messages = paginator.page(page)
    except PageNotAnInteger:
        messages = paginator.page(1)
    except EmptyPage:
        messages = paginator.page(paginator.num_pages)
            
    context = {
        'messages': messages
    }
    return render(request, 'weekly_status/sent.html', context)
    
@login_required(login_url='/login/')
def status_report(request, status_id):
    status = Status.objects.get(id=status_id)
    if (request.user !=  status.recipent) and (request.user !=  status.sender) :
        raise PermissionDenied
    
    completed_tasks = Acompleted.objects.filter(status=status) 
    progresses = Progress.objects.filter(status=status)
    next_progresses = Anextweek.objects.filter(status=status)
    issues = AIssue.objects.filter(status=status)
    status.read = True
    status.save()
    context = {
        'status': status,
        'completed_tasks': completed_tasks,
        'progresses': progresses,
        'next_progresses': next_progresses,
        'issues': issues,
    }
    return render(request, 'weekly_status/status.html', context)
    
    
@login_required(login_url='/login/')
def feedback(request, feedback_id):
    feedback = Feedback.objects.get(id=feedback_id)
    if (request.user !=  feedback.task.assigned_to) and (request.user !=  feedback.task.project.supervisor):
        raise PermissionDenied
    replies = feedback.reply_set.all()
    
    if request.user == feedback.task.assigned_to:
        feedback.read = True
    elif request.user == feedback.task.project.supervisor:
        feedback.su_read = True
    feedback.save()
    
    if "send-reply" in request.POST:
        author = request.user
        target_id = request.POST.get("target")
        target = User.objects.get(id=target_id)
        body = request.POST.get("comment-body")
        reply = Fd_reply.objects.create(
                    feedback = feedback,
                    author = author,
                    target = target,
                    body = body,
                    timestamp = timezone.localtime(timezone.now()),
                    updated = timezone.localtime(timezone.now()),
                )
        feedback.updated = timezone.localtime(timezone.now())
        if request.user == feedback.task.assigned_to:
            feedback.su_read = False
        else:
            feedback.read = False
        feedback.save()
        return redirect('weekly_status:feedback', feedback_id)
    
    context = {
        'feedback': feedback,
        'replies': replies,
    }
    return render(request, 'weekly_status/feedback.html', context)
    
@login_required(login_url='/login/')
def new_status(request):
    recipent = request.user.profile.reports_to
    
    if Status.objects.filter(sender=request.user).filter(sent=False).exists():
        temp_status = Status.objects.filter(sender=request.user).filter(sent=False)[0]
        saved_data_found = True
        week = temp_status.week
    else:
        temp_status = None
        saved_data_found = False
        year, week, dw = timezone.localtime(timezone.now()).isocalendar()
        week = str(year) + "-W" + str('{0:02d}'.format(week))
    
    if "submit_status_report" in request.POST:
        if "temp_status_id" in request.POST:
            temp_status_o = Status.objects.get(id=request.POST.get('temp_status_id'))
            temp_status_o.delete()
        group = Group.objects.get(id=request.POST.get("group_id"))
        recipent = User.objects.get(id=request.POST.get("recipent_id"))
        week = request.POST.get("week")
        from_date = request.POST.get("from_date")
        to_date = request.POST.get("to_date")
        
        completed_tasks_list = request.POST.getlist("a_comp_week_task")
        completed_tasks_desc_list = request.POST.getlist("a_comp_week_descrip")
        
        current_progress_list = request.POST.getlist("a_progress_inprogress")
        next_action_list = request.POST.getlist("a_progress_nxt_action")
        progress_due_date_list=request.POST.getlist("a_progress_due_date")
        
        anext_week_list = request.POST.getlist("a_started_nxt_week_task")
        anext_week_desc_list = request.POST.getlist("a_started_nxt_week_descrip")
        
        issue_list = request.POST.getlist("a_issue_action_name")
        issue_desc_list = request.POST.getlist("a_issue_action_descrip")
        
        status = Status.objects.create(
            group = group,
            sender = request.user,
            recipent = recipent,
            week = week,
            from_date = from_date,
            to_date = to_date,
            timestamp = timezone.localtime(timezone.now()),
            updated = timezone.localtime(timezone.now()),
            read = False,
            sent = True,
        )
        if len(completed_tasks_list) > 0:
            for index, each_task in enumerate(completed_tasks_list):
                completed = Acompleted.objects.create(
                    status = status,
                    task = each_task,
                    description = completed_tasks_desc_list[index]
                )
        if len(current_progress_list) > 0:
            for index, each_task in enumerate(current_progress_list):
                progress = Progress.objects.create(
                    status = status,
                    current = each_task,
                    next = next_action_list[index],
                    due_date = progress_due_date_list[index]
                )
        if len(anext_week_list) > 0:
            for index, each_task in enumerate(anext_week_list):
                next = Anextweek.objects.create(
                    status = status,
                    task = each_task,
                    description = anext_week_desc_list[index]
                )
        
        if len(issue_list) > 0:
            for index, each_issue in enumerate(issue_list):
                next = AIssue.objects.create(
                    status = status,
                    name = each_issue,
                    description = issue_desc_list[index]
                )
        return redirect('uspl:home')
        
    if "save_status_report" in request.POST:
        if "temp_status_id" in request.POST:
            temp_status_o = Status.objects.get(id=request.POST.get('temp_status_id'))
            temp_status_o.delete()
        group = Group.objects.get(id=request.POST.get("group_id"))
        recipent = User.objects.get(id=request.POST.get("recipent_id"))
        week = request.POST.get("week")
        from_date = request.POST.get("from_date")
        to_date = request.POST.get("to_date")
        
        completed_tasks_list = request.POST.getlist("a_comp_week_task")
        completed_tasks_desc_list = request.POST.getlist("a_comp_week_descrip")
        
        current_progress_list = request.POST.getlist("a_progress_inprogress")
        next_action_list = request.POST.getlist("a_progress_nxt_action")
        progress_due_date_list=request.POST.getlist("a_progress_due_date", None)
        
        anext_week_list = request.POST.getlist("a_started_nxt_week_task")
        anext_week_desc_list = request.POST.getlist("a_started_nxt_week_descrip")
        
        issue_list = request.POST.getlist("a_issue_action_name")
        issue_desc_list = request.POST.getlist("a_issue_action_descrip")
        
        status = Status.objects.create(
            group = group,
            sender = request.user,
            recipent = recipent,
            week = week,
            from_date = from_date,
            to_date = to_date,
            timestamp = timezone.localtime(timezone.now()),
            updated = timezone.localtime(timezone.now()),
            read = False,
            sent = False,
        )
        if len(completed_tasks_list) > 0:
            for index, each_task in enumerate(completed_tasks_list):
                completed = Acompleted.objects.create(
                    status = status,
                    task = each_task,
                    description = completed_tasks_desc_list[index]
                )
        if len(current_progress_list) > 0:
            for index, each_task in enumerate(current_progress_list):
                progress = Progress.objects.create(
                    status = status,
                    current = each_task,
                    next = next_action_list[index],
                    due_date = progress_due_date_list[index]
                )
        if len(anext_week_list) > 0:
            for index, each_task in enumerate(anext_week_list):
                next = Anextweek.objects.create(
                    status = status,
                    task = each_task,
                    description = anext_week_desc_list[index]
                )
        
        if len(issue_list) > 0:
            for index, each_issue in enumerate(issue_list):
                next = AIssue.objects.create(
                    status = status,
                    name = each_issue,
                    description = issue_desc_list[index]
                )
        return redirect('uspl:home')
    
    context = {
        'recipent': recipent,
        'temp_status': temp_status,
        'saved_data_found': saved_data_found,
        'week': week
    }
    return render(request, 'weekly_status/new_status_form.html', context)
    
    
@login_required(login_url='/login/')
def get_week_date_range(request):
    week = request.GET.get("week")
    
    
@login_required(login_url='/login/')
def summary(request):
    if request.user.profile.is_hr:
        raise PermissionDenied
    if request.user.is_staff:
        groups = Group.objects.all()
    elif request.user.profile.is_temaleader:
        groups = request.user.groups.all()
    
    context = {
        'groups': groups,
    }
    return render(request, 'weekly_status/summary.html', context)
    
@login_required(login_url='/login/')
def get_employee_list(request):
    group_id = request.GET.get("group_id")
    group = Group.objects.get(id=group_id)
    users = group.user_set.all()
    context = {
        'users':users
    }
    return render(request, 'weekly_status/get_employee_list.html', context)
    
@login_required(login_url='/login/')
def get_summary(request):
    group_id = request.GET.get("group_id")
    user_id = request.GET.get('emp_id')
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    group = Group.objects.get(id=group_id)
    if user_id:
        user = User.objects.get(id=user_id)
        user_q = True
        completed_tasks=Task.objects.filter(assigned_to=user).filter(completed=True).filter(completed_date__gte=from_date).filter(completed_date__lte=to_date).order_by("completed_date")
        ongoing_tasks=Task.objects.filter(assigned_to=user).filter(started=True).filter(started_date__lte=to_date).filter(Q(completed_date__isnull=True) | Q(completed_date__gt=to_date)).order_by("started_date")
        pending_tasks = Task.objects.filter(assigned_to=user).filter(created_date__lte=to_date).filter(Q(started_date__isnull=True) | Q(started_date__gt=to_date)).order_by("created_date")
        issues = Issue.objects.filter(raised_by=user).filter(raised_date__gte=from_date).filter(raised_date__lte=to_date)
        context = {
            'group': group,
            'user': user,
            'from_date': from_date,
            'to_date': to_date,
            'user_q': user_q,
            'completed_tasks': completed_tasks,
            'ongoing_tasks': ongoing_tasks,
            'pending_tasks': pending_tasks,
            'issues': issues,
        }
    else:
        user_q = False
        completed_tasks=Task.objects.filter(project__group=group).filter(completed=True).filter(completed_date__gte=from_date).filter(completed_date__lte=to_date).order_by("completed_date")
        ongoing_tasks=Task.objects.filter(project__group=group).filter(started=True).filter(started_date__lte=to_date).filter(Q(completed_date__isnull=True) | Q(completed_date__gt=to_date)).order_by("started_date")
        pending_tasks = Task.objects.filter(project__group=group).filter(created_date__lte=to_date).filter(Q(started_date__isnull=True) | Q(started_date__gt=to_date)).order_by("created_date")
        issues = Issue.objects.filter(task__project__group=group).filter(raised_date__gte=from_date).filter(raised_date__lte=to_date)
        context = {
            'group': group,
            'from_date': from_date,
            'to_date': to_date,
            'user_q': user_q,
            'completed_tasks': completed_tasks,
            'ongoing_tasks': ongoing_tasks,
            'pending_tasks': pending_tasks,
            'issues': issues,
        }
    
    return render(request, 'weekly_status/get_summary.html', context)
    
    
@login_required(login_url='/login/')
def get_unread_mail(request):
    unread_status = Status.objects.filter(recipent = request.user).filter(sent=True).filter(read=False).count()
    unread_feedbacks = Feedback.objects.filter(task__assigned_to=request.user).filter(read=False).count()
    feedback_reply = Fd_reply.objects.filter(target=request.user).filter(feedback__su_read=False).count()
    unread_mail = unread_status + unread_feedbacks + feedback_reply
    data = {
        'unread_mail': unread_mail
    }
    return JsonResponse(data)
    