from django.contrib.auth.models import Group
from uspl.models import Issue, News, Notice
from django.contrib import messages
import datetime
from django.utils import timezone

def groups(request):
    return {
        'groups': Group.objects.all()
    }
    
#.filter(assigned_to = request.user).filter(task__project__supervisor = request.user).filter(raised_by = request.user).filter(solved=False),
def issues(request):
    if request.user.is_authenticated():
        raised_issues = Issue.objects.filter(raised_by = request.user).filter(solved=False)
        assigned_issues = Issue.objects.filter(assigned_to = request.user).filter(solved=False)
        all_supervised_isuues=Issue.objects.filter(task__project__supervisor = request.user).exclude(task__assigned_to=request.user)
        supervised_issues = Issue.objects.filter(task__project__supervisor = request.user).exclude(task__assigned_to =request.user).filter(solved=False)
    if request.user.is_authenticated():
        return {
            'raised_issues': raised_issues,
            'assigned_issues': assigned_issues,
            'supervised_issues': supervised_issues,
            'all_supervised_isuues': all_supervised_isuues,
        }
    else:
        return {}
        
def newses(request):
    if request.user.is_authenticated():
        if request.user.is_staff:
            newses = News.objects.all().order_by('-created_date')[:20]
        else:
            newses = News.objects.filter(group__in=request.user.groups.all())
            newses = newses.order_by('-created_date')
        return {
            'newses': newses[:20]
        }
    else:
        return {}
        
def just_logged_in(request):
    if request.user.is_authenticated():
        timediff = timezone.now() - request.user.last_login
        if request.user.last_login == (timezone.now() - timezone.timedelta(minutes=0)):
            return {
                'current_logged_in' : True,
                'dif_time': timediff.total_seconds(),
                }
        else:
            return {
                'current_logged_in' : False,
                'dif_time': timediff.total_seconds(),
                }
    else:
        return {}
        
def on_board_notices(request):
    if request.user.is_authenticated():
        return {
            'notices': Notice.boardObjects.all()
        }
    else:
        return {}
        