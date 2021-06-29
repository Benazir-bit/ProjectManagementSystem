from django.contrib import admin
from .models import Project, Task, Profile, Issue, Kpi, Feedback, Comment, News, Teamleader, Designation, Notice, Reply

# Register your models here.
admin.site.register(Profile)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Issue)
admin.site.register(Kpi)
admin.site.register(Feedback)
admin.site.register(Comment)
admin.site.register(News)
admin.site.register(Teamleader)
admin.site.register(Designation)
admin.site.register(Notice)
admin.site.register(Reply)


admin.site.site_header = 'Ulkasemi EMS Admin'
