from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from django.utils import timezone

# Create your models here.


class WorkStatus(models.Model):
    # group = models.ForeignKey(Group, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="status_sender")
    recipent = models.ManyToManyField(User, related_name="recipent_list")
    cc_list = models.ManyToManyField(User, blank=True, related_name="cc_list")
    report_type = models.CharField(max_length=20, null=True, blank=True)
    week = models.CharField(max_length=20, null=True, blank=True)
    from_date = models.DateField(blank=True, null=True)
    to_date = models.DateField(blank=True, null=True)
    month = models.DateField(blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    updated = models.DateTimeField(blank=True, null=True)
    read = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)

    def __str__(self):
        return "Weekly Status-" + str(self.week)+"-(" + str(self.from_date) + " to " + str(self.to_date) + ")"

    def get_type(self):
        return "status"


class ActivityCompleted(models.Model):
    workstatus = models.ForeignKey(WorkStatus, on_delete=models.CASCADE)
    task = models.CharField(max_length=500, null=True, blank=True)
    description = models.CharField(max_length=2000, null=True, blank=True)


class ActivityInProgress(models.Model):
    workstatus = models.ForeignKey(WorkStatus, on_delete=models.CASCADE)
    current = models.CharField(max_length=1000, null=True, blank=True)
    next = models.CharField(max_length=1000, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)


class ActivityNextWeek(models.Model):
    workstatus = models.ForeignKey(WorkStatus, on_delete=models.CASCADE)
    task = models.CharField(max_length=500, null=True, blank=True)
    description = models.CharField(max_length=2000, null=True, blank=True)


class Issue(models.Model):
    workstatus = models.ForeignKey(WorkStatus, on_delete=models.CASCADE)
    name = models.CharField(max_length=500, null=True, blank=True)
    description = models.CharField(max_length=2000, null=True, blank=True)


class Reply(models.Model):
    workstatus = models.ForeignKey(
        WorkStatus, null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(blank=True, null=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reply_sender")
    recipent = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reply_recipent")
    body = models.CharField(max_length=2000, null=True, blank=True)
    read = models.BooleanField(default=False)
