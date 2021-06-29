from django.contrib import admin
from .models import WorkStatus, ActivityCompleted, ActivityInProgress, ActivityNextWeek, Issue, Reply

# Register your models here.
admin.site.register(WorkStatus)
admin.site.register(ActivityCompleted)
admin.site.register(ActivityInProgress)
admin.site.register(ActivityNextWeek)
admin.site.register(Issue)
admin.site.register(Reply)