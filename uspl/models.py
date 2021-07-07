from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User, Group
import datetime
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.contrib.auth.signals import user_logged_in
from django.contrib import messages
from django.db.models import Avg
from weekly_status.models import WorkStatus
from django.template.defaultfilters import slugify
from notification.signals import notify

class Project(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(default="",)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    details = models.TextField(max_length=500)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_created_by', on_delete=models.CASCADE)
    created_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True, )
    completed = models.BooleanField(default=False)
    completed_date = models.DateField(blank=True, null=True)
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_supervisor', on_delete=models.CASCADE)
    #member = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_member', on_delete=models.CASCADE, blank=True, null=True)
    members = models.ManyToManyField(User)
    # blank=True, null=True,
    note = models.TextField(blank=True, null=True)
    priority = models.PositiveIntegerField(blank=True, null=True)
    
    # Has due date for an instance of this object passed?
    def overdue_status(self):
        "Returns whether the Tasks's due date has passed or not."
        if self.due_date and datetime.date.today() > self.due_date:
            return True
         
    def __str__(self):
        return self.name
        
    def get_absolute_url(self):
        return reverse('uspl:project_detail', kwargs={'project_id': self.id, })
        
    def get_user_completed_task(self, request):
        return self.task_set.filter(assigned_to=request.user).filter(completed=True)
        
    def get_users_total_task(self, request):
        return self.task_set.filter(assigned_to=request.user).filter(completed=True)
        
    def get_completeion_rate(self):
        all_tasks=self.task_set.all().order_by('-id').count()
        completed_tasks=self.task_set.filter(completed=True).count()
        if all_tasks > 0:
            return round(((float(completed_tasks)/float(all_tasks))*100), 2)
        else:
            return 0
            
    def get_completed_task(self):
        completed_tasks=self.task_set.filter(completed=True)
        return completed_tasks
            
    def get_not_started_task(self):
        not_started_tasks=self.task_set.filter(started=False)
        return not_started_tasks
        
    def get_ongoing_task(self):
        ongoing_tasks=self.task_set.filter(started=True).filter(submitted=False)
        return ongoing_tasks
            
    def get_waiting_for_review_task(self):
        waiting_for_review_tasks=self.task_set.filter(completed=False).filter(submitted=True)
        return waiting_for_review_tasks
        
    # Auto-set the Task creation / completed date
    def save(self, **kwargs):
        # If Task is being marked complete, set the completed_date
        if not self.created_date:
            self.created_date = timezone.now().date()
        if not self.slug:
            self.slug = slugify(self.name)
        if self.completed:
            self.completed_date = timezone.now().date()
        super(Project, self).save()

    def get_project_members(self):
        tasks = self.task_set.all()
        members = User.objects.filter(task_assigned_to__in = tasks).distinct()
        return members
    # def get_project_members(self):
    #     project = self.project.all()
    #     members = User.objects.filter(add_members__in = project).distinct()
    #     return members
        
    class Meta:
        ordering = ["-created_date"]
        
class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(blank=True, null=True,max_length=100)
    details = models.CharField(blank=True, null=True,max_length=500)
    created_date = models.DateField(blank=True, null=True, )
    created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    started = models.BooleanField(default=False)
    started_date = models.DateField(blank=True, null=True, )
    deadline = models.DateField(blank=True, null=True, )
    completed = models.BooleanField(default=False)
    completed_date = models.DateField(blank=True, null=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='task_assigned_to', on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)
    priority = models.PositiveIntegerField(default="999", null=True, blank=True)
    paused = models.BooleanField(default=False)
    paused_date = models.DateField(blank=True, null=True, )
    submitted = models.BooleanField(default=False)
    submitted_date = models.DateField(blank=True, null=True, )
    resumed = models.BooleanField(default=False)
    resumed_date = models.DateField(blank=True, null=True, )
    approved = models.BooleanField(default=False, null=True)
    requested = models.BooleanField(default=False, null=True)


    
    def __str__(self):
        return str(self.project.name) + "-" + str(self.name)
    # Has due date for an instance of this object passed?
    def overdue_status(self):
        "Returns whether the Tasks's due date has passed or not."
        if timezone.now().date() > self.deadline:
            return True

    def get_remaining_time(self):
        if self.completed:
            return None
        else:
            if timezone.now().date() > self.deadline:
                return (timezone.now().date() - self.deadline).days
            else:
                return (self.deadline - timezone.now().date()).days


            
    # Auto-set the Task creation / completed date
    def save(self, **kwargs):
        # If Task is being marked complete, set the completed_date
        if self.id is None:
            if self.created_by == self.project.supervisor:
                self.approved = True
        if self.started:
            self.started_date = timezone.now().date()
        if self.submitted:
            self.submitted_date = timezone.now().date()
        if self.completed:
            self.completed_date = timezone.now().date()
        super(Task, self).save()
    
    def get_absolute_url(self):
        return reverse('uspl:task_detail', kwargs={'task_id': self.id, })
    
    def get_unsolved_issues(self):
        return self.issue_set.filter(solved=False).count()

    def has_unresolved_issues(self):
       return self.issue_set.filter(solved=False).exists()

    def get_task_status(self):
        if self.requested:
            return "Waiting For Supervisor Approval"
        elif not self.started:
            return "Not Started"
        elif not self.completed and not self.paused and not self.submitted:
            return "Ongoing"
        elif self.paused:
            return "Paused"
        elif self.submitted and not self.completed:
            return "Waiting For Review"
        elif self.completed:
            return "Completed"
        
        
    class Meta:
        ordering = ["-created_date"]
        
class Feedback(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    body = models.TextField(max_length=1000)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='feedback_created_by', on_delete=models.CASCADE)
    created_date = models.DateTimeField(blank=True, null=True)
    updated = models.DateTimeField(blank=True, null=True)
    read = models.BooleanField(default=False)
    su_read = models.BooleanField(default=True)
    def __str__(self):
        return "Feedback: " + str(self.task.project.name) + "-" + str(self.task.name) 
        
    def get_type(self):
        return "feedback"
        
class Reply(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    body = models.TextField(max_length=1000, null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, related_name="reply_by",null=True, on_delete=models.CASCADE)
    target = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, related_name="reply_to", null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(blank=True, null=True)
    updated = models.DateTimeField(blank=True, null=True)
    
    def get_type(self):
        return "fdreply"

    
class Issue(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    name = models.CharField(blank=True, max_length=50)
    details = models.TextField(blank=True, max_length=250)
    solution = models.TextField(blank=True, null=True, max_length=20000, help_text="Null True Added") ##added
    raised_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='issue_raised_by', on_delete=models.CASCADE)
    raised_date = models.DateField(blank=True, null=True, )
    solved = models.BooleanField(default=False)
    solved_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='issue_solved_by', on_delete=models.CASCADE)
    solved_date = models.DateField(blank=True, null=True, )
    important = models.BooleanField(default=False)
    note = models.TextField(blank=True, null=True)
    
    def save(self, **kwargs):
        # If Task is being marked complete, set the completed_date
        if self.solved:
            self.solved_date = datetime.datetime.now().date() ##added
        super(Issue, self).save()
        
    def get_absolute_url(self):
        return reverse('uspl:issue_detail', kwargs={'issue_id': self.id, })
            
    def __str__(self):
        return str(self.task.name)+"- Issue -"+str(self.id)

    def get_related_users(self):
        users = []
        if self.raised_by !=  self.task.project.supervisor:
            users.append(self.task.project.supervisor)
        for comment in self.comment_set.all():
            if not comment.marked_as_solution:
                if comment.author not in users:
                    users.append(comment.author)
        return users

    def get_issue_solver(self):
        solution = self.comment_set.get(marked_as_solution=True)
        if solution.author != self.raised_by:
            return solution.author
        else:
            return None

    class Meta:
        ordering = ["solved"]
        
        
class Comment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='author', on_delete=models.CASCADE)
    posted_date = models.DateField(blank=True, null=True, )
    body = models.TextField(blank=True, null=True, )
    marked_as_solution = models.BooleanField(default=False)
    def __str__(self):
        return str(self.issue.name)+ "-Solution: " +str(self.id)
    
class Kpi(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE)
    created = models.DateField(blank=True, null=True, )
    # Skill
    skill = models.DecimalField(max_digits=11, decimal_places=2)
    
    # Attitude
    attitude = models.DecimalField(max_digits=11, decimal_places=2)
    
    # Motivation
    motivation = models.DecimalField(max_digits=11, decimal_places=2)
    
    # Communication
    communication = models.DecimalField(max_digits=11, decimal_places=2)
    
    # Time management
    time_management = models.DecimalField(max_digits=11, decimal_places=2)
    
    # Reliability
    reliability = models.DecimalField(max_digits=11, decimal_places=2)
    
    comment = models.TextField(blank=True, null= True, max_length=250)
    # Auto-set the Task creation / completed date
    """
    def save(self, **kwargs):
        self.skill = (self.domain_knowledge + self.tool_knowledge + self.work_quality + self.supervision_or_individual_working_capability + self.debugging_capability)/5.0
        self.attitude = (self.personal_behavior + self.initiative_taking_capability + self.stress_handling + self.inquisitiveness + self.leadership_ability)/5.0
        self.motivation = (self.self_motivation + self.dedication_towards_work + self.ability_to_motivate_others + self.commitment_towards_companys_goal + self.adaptability)/5.0
        self.communication = (self.responsive_courteous_to_customer_or_team_inquries + self.documentation_and_presentation_skill + self.email_writing_skill + self.english_speaking_fluency + self.feedback)/5.0
        self.time_management = (self.time_utilization + self.resource_utilization + self.office_attendance + self.productivity)/4.0
        self.reliability = (self.commitments_towards_deadline + self.minimum_supervision_req + self.effort + self.judgement_and_decision_making)/4.0
        super(Kpi, self).save()
    """
        
    def get_kpi_average(self, **kwargs):
        average = ((
            self.skill + self.attitude
            + self.motivation + self.communication
            + self.time_management + self.reliability)/60)*100
        return round(average, 2)
        
    def __str__(self):
        return self.task.name
        
class News(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True,)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, blank=True, null=True,)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, blank=True, null=True,)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True, )
    def __str__(self):
        return self.group.name +"-" +self.project.name + "-" + str(self.id)

    def news_date(self):
        return self.created_date.date()

    def news_time(self):
        return self.created_date.time()
        
class NoticeManager(models.Manager):
    def get_queryset(self):
        now = timezone.now()
        return super(NoticeManager, self).get_queryset().filter(expires_on__gt=now)
        
class Notice(models.Model):
    title = models.CharField(blank=True, max_length=100)
    body = models.TextField(blank=True, max_length=10000)
    created_on = models.DateTimeField(blank=True, null=True, )
    expires_on = models.DateTimeField(blank=True, null=True, )
    created_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    important = models.BooleanField(default=False)
    objects = models.Manager()
    boardObjects = NoticeManager()
    
    def __str__(self):
        return str(self.created_on.date) +"-" +self.title+"-" 

        
class Teamleader(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    employees = models.ManyToManyField(User)
    def __str__(self):
        return str(self.group.name)
        
class Designation(models.Model):
    title = models.CharField(max_length = 100)
    job_description = models.TextField(max_length = 5000, null=True, blank=True)
    group = models.ManyToManyField(Group)
    def __str__(self):
        return str(self.title)

class Profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    dsg = models.ForeignKey(Designation, on_delete=models.CASCADE, null=True)
    phone_number = models.CharField(max_length = 11, blank=True)
    present_address = models.CharField(max_length = 100, blank=True)
    highest_degree = models.CharField(max_length = 100, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=3, blank=True)
    emergency_contact = models.CharField(max_length = 11, blank=True)
    image = models.ImageField(upload_to='profile_image', blank=True)
    is_hr = models.BooleanField(default=False, blank=True)
    is_fna = models.BooleanField(default=False, blank=True)
    reports_to = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="reports_to")
    
    def __str__(self):
        return self.user.first_name + str(" ")+ self.user.last_name + str(self.user.id)

    def get_employee_groups(self):
        # if self.user.is_staff or self.is_hr:
        #     return Group.objects.all().exclude(name='Management').exclude(name="HR")
        # else:
        return self.user.groups.all()
        
    def get_employee_overall_kpi(self, year):
        kpis = Kpi.objects.filter(task__assigned_to = self.user).filter(created__year = year)
        avg = kpis.aggregate(Avg('skill'), Avg('attitude'), Avg('motivation'), Avg('communication'), Avg('time_management'), Avg('reliability'))
        if kpis:
            overall_avg= (
                (float(avg['skill__avg'])
                + float(avg['attitude__avg'])
                + float(avg['motivation__avg'])
                + float(avg['communication__avg'])
                + float(avg['time_management__avg'])
                + float(avg['reliability__avg'])
            )/60)*100
            return overall_avg
        else:
            return None

        
    def is_project_supervisor(self, project_id):
        project = Project.objects.get(id=project_id)
        if self.user == project.supervisor:
            return True
        else:
            return False

    def is_project_member(self, project_id):
        project = Project.objects.get(id=project_id)
        if self.user == project.members:
            return True
        else:
            return False


    def is_group_teamleader(self, group_id):
        group = Group.objects.get(id=group_id)
        print(group)
        if self.user in group.teamleader.employees.all():
            return True

        

    def get_employee_kpi_average(self, year):
        kpis = Kpi.objects.filter(task__assigned_to = self.user).filter(created__year = year)
        if kpis:
            avg = kpis.aggregate(Avg('skill'), Avg('attitude'), Avg('motivation'), Avg('communication'), Avg('time_management'), Avg('reliability'))
            avg_dict = {
                "avg_skill": round(avg['skill__avg'], 2),
                "avg_attitude": round(avg['attitude__avg'], 2),
                "avg_motivation": round(avg['motivation__avg'], 2),
                "avg_communication": round(avg["communication__avg"], 2),
                "avg_time_management": round(avg["time_management__avg"], 2),
                "avg_reliability": round(avg["reliability__avg"], 2)
            }
            return avg_dict
        else:
            return None

    def get_employee_kpis(self, year):
        kpis = Kpi.objects.filter(task__assigned_to = self.user).filter(created__year = year).order_by('-id')
        return kpis
    
    def is_temaleader(self):
        groups = self.user.groups.all()
        
        for group in groups:
            if hasattr(group, 'teamleader'):
                if self.user in group.teamleader.employees.all():
                    return True

    def get_groups(self):
        groups = self.user.groups.all()
        return groups



    def get_submitted_tasks(self):
        tasks = Task.objects.filter(assigned_to=self.user).filter(completed=False).filter(submitted=True)
        return tasks.count()
        
    def get_wfr_tasks(self):
        tasks = Task.objects.filter(project__supervisor = self.user).filter(completed=False).filter(submitted=True)
        return tasks.count()
    
        
    def get_overdue_tasks(self):
        tasks = Task.objects.filter(assigned_to=self.user).filter(completed=False)
        overdue_tasks = 0
        for task in tasks:
            if task.overdue_status():
                overdue_tasks = overdue_tasks + 1
        return overdue_tasks
        
        
    def get_cld_tasks_count(self):
        tasks = Task.objects.filter(assigned_to=self.user).filter(completed=False).filter(deadline__gte=timezone.localtime(timezone.now()).date())
        count = 0
        for task in tasks:
            duration = task.deadline - task.created_date
            if task.created_date == task.deadline:
                duration_mins = 24*60
                time_delta = datetime.datetime.combine(timezone.localtime(timezone.now()).date() + datetime.timedelta(days=1), datetime.datetime.strptime("0000", "%H%M").time()) - timezone.localtime(timezone.now()).replace(tzinfo=None)
                rem_mins = (time_delta.seconds)/60
            else:
                duration_mins, duration_secs = divmod(duration.days * 86400 + duration.seconds, 60)
                time_ramianing = task.deadline - timezone.now().date()
                rem_mins, rem_secs = divmod(time_ramianing.days * 86400 + time_ramianing.seconds, 60)
            
            if rem_mins <= (duration_mins/4):
                count += 1
        return count
        
    def get_cld_tasks(self):
        tasks = Task.objects.filter(assigned_to=self.user).filter(completed=False).filter(deadline__gte=timezone.localtime(timezone.now()).date())
        task_list = []
        for task in tasks:
            duration = task.deadline - task.created_date
            if task.created_date == task.deadline:
                duration_mins = 24*60
                time_delta = datetime.datetime.combine(timezone.localtime(timezone.now()).date() + datetime.timedelta(days=1), datetime.datetime.strptime("0000", "%H%M").time()) - timezone.localtime(timezone.now()).replace(tzinfo=None)
                rem_mins = (time_delta.seconds)/60
            else:
                duration_mins, duration_secs = divmod(duration.days * 86400 + duration.seconds, 60)
                time_ramianing = task.deadline - timezone.now().date()
                rem_mins, rem_secs = divmod(time_ramianing.days * 86400 + time_ramianing.seconds, 60)
            if rem_mins <= (duration_mins/4):
                task_list.append(task)
        return task_list
        
        
    def get_status(self):
        if Task.objects.filter(submitted=False).filter(started=True).filter(assigned_to=self.user).exists():
            return "Busy"
        else:
            return "Idle"

    def is_busy_status(self):
        if Task.objects.filter(submitted=False).filter(started=True).filter(assigned_to=self.user).exists():
            return True
        else:
            return False

    def get_raised_issues(self, year):
        raised_issues = Issue.objects.filter(raised_by = self.user).filter(raised_date__year = year)
        return raised_issues.count()

    def get_solved_issues(self, year):
        solved_issues = Issue.objects.filter(solved_by = self.user).filter(solved_date__year = year)
        return solved_issues.count()
                

@receiver(pre_save, sender=Profile)
def delete_file_on_change_extension(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_image = Profile.objects.get(pk=instance.pk).image
        except Profile.DoesNotExist:
            return
        else:
            new_image = instance.image
            if old_image and old_image.url !=  new_image.url:
                old_image.delete(save=False)

@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

        
def logged_in_message(sender, user, request, **kwargs):
    messages.error(request, messages.ERROR, "You have login successfully!")

user_logged_in.connect(logged_in_message)

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Task, Project, Issue, Comment, News, Feedback
from notification.signals import notify
from django.utils import timezone


@receiver(post_save, sender=Project)
def project_activity(sender, instance, created, **kwargs):
    if created:
        print("CREATED")
        group = instance.group
        News.objects.create(
            project=instance,
            group=group,
            owner=instance.created_by,
            message="created a new project called "+str(instance.name),
            created_date=timezone.now()
        )
        group_members = list(
            group.user_set.all().exclude(id=instance.created_by.id))
        notify.send(instance.created_by, recipient_list=group_members, actor=instance.created_by,
                    verb='created a new project: ' + str(instance.name), target=instance, nf_type='project')
        manager_list = list(User.objects.filter(is_staff=True))
        notify.send(instance.created_by, recipient_list=manager_list, actor=instance.created_by,
                    verb='created a new project called ' + str(instance.name), target=instance, nf_type='project')
    elif instance.completed:
        group = instance.group
        News.objects.create(
            project=instance,
            group=group,
            owner=instance.supervisor,
            message="marked the project "+str(instance.name)+" as completed",
            created_date=timezone.now()
        )
        group_members = list(
            group.user_set.all().exclude(id=instance.created_by.id))
        notify.send(instance.created_by, recipient_list=group_members, actor=instance.created_by,
                    verb="marked the project "+str(instance.name)+" as completed", target=instance, nf_type='project')
        manager_list = list(User.objects.filter(is_staff=True))
        notify.send(instance.created_by, recipient_list=manager_list, actor=instance.created_by,
                    verb="marked the project "+str(instance.name)+" as completed", target=instance, nf_type='project')


@receiver(post_save, sender=Task)
def task_activity(sender, instance, created, **kwargs):
    # Create
    if created:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="assigned to a new task called "+str(instance.name),
            created_date=timezone.now()
        )
        if (instance.assigned_to !=  instance.created_by):
            notify.send(instance, recipient=instance.assigned_to, actor=instance.created_by,
                    verb="assigned you to a new task called " + str(instance.name), target=instance, nf_type='task')
    # Started
    elif instance.started and not instance.paused and not instance.resumed and not instance.submitted:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="started a task called "+str(instance.name),
            created_date=timezone.now()
        )
        supervisor = instance.project.supervisor
        if supervisor !=  instance.assigned_to:
            notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="started a task called " + str(instance.name), target=instance, nf_type='task')
    # Paused
    # elif instance.started and instance.paused and not instance.submitted:
    #     News.objects.create(
    #         task=instance,
    #         project=instance.project,
    #         group=instance.project.group,
    #         owner=instance.assigned_to,
    #         message="paused the task " +
    #         str(instance.name)+" due to a raised issue.",
    #         created_date=timezone.now()
    #     )
    #     supervisor = instance.project.supervisor
    #     notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
    #                 verb="paused a task called " + str(instance.name) + " due to a raised issue.", target=instance, nf_type='task')

    # Resumed
    elif instance.started and not instance.paused and instance.resumed and not instance.submitted:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="resumed a paused task called "+str(instance.name),
            created_date=timezone.now()
        )
        supervisor = instance.project.supervisor
        if supervisor !=  instance.assigned_to:
            notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="resumed a paused task called "+str(instance.name), target=instance, nf_type='task')

    # Submitted
    elif instance.submitted and instance.started and not instance.paused and not instance.completed:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="submitted task called "+str(instance.name),
            created_date=timezone.now()
        )
        supervisor = instance.project.supervisor
        if supervisor !=  instance.assigned_to:
            notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="submitted a task called "+str(instance.name), target=instance, nf_type='task')

    # Completed
    elif instance.completed:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="completed a task called "+str(instance.name),
            created_date=timezone.now()
        )
        supervisor = instance.project.supervisor
        if supervisor !=  instance.assigned_to:
            notify.send(instance, recipient=instance.assigned_to, actor=supervisor,
                    verb="marked your submitted task " + str(instance.name) + " as completed.", target=instance, nf_type='task')


@receiver(post_save, sender=Issue)
def issue_activity(sender, instance, created, **kwargs):
    if created:
        verb =""
        if instance.important:
            verb = "raised a high priority issue for the task: " + str(instance.task.name)
        else:
            verb = "raised an issue for the task: " + str(instance.task.name)
        News.objects.create(
            task=instance.task,
            project=instance.task.project,
            group=instance.task.project.group,
            owner=instance.raised_by,
            message=verb,
            created_date=timezone.now()
        )
        group_members = list(instance.task.project.group.user_set.all().exclude(
            id=instance.raised_by.id))
        notify.send(instance, recipient_list=group_members, actor=instance.raised_by,
                    verb=verb, target=instance, nf_type='issue')
    if instance.solved:
        News.objects.create(
            task=instance.task,
            project=instance.task.project,
            group=instance.task.project.group,
            owner=instance.solved_by,
            message="solved an issue for the task "+str(instance.task.name),
            created_date=timezone.now()
        )
        related_users = instance.get_related_users()
        if related_users:
            notify.send(instance, recipient_list=related_users, actor=instance.raised_by,
                        verb="marked an issue you followed as solved", target=instance, nf_type='issue')
        solver = instance.get_issue_solver()
        if solver:
            notify.send(instance, recipient=solver, actor=instance.raised_by,
                        verb="marked your comment as the solution of an issue.", target=instance, nf_type='issue')


@receiver(post_save, sender=Comment)
def comment_activity(sender, instance, created, **kwargs):
    if created:
        issue = instance.issue
        all_comments = issue.comment_set.all()
        related_users = []
        if all_comments.exists():
            for comment in all_comments:
                related_users.append(comment.author)
        if (issue.task.project.supervisor !=  issue.raised_by):
            if issue.task.project.supervisor not in related_users:
                related_users.append(issue.task.project.supervisor)
        recipient_list = list(set(related_users))
        if instance.author in recipient_list:
            recipient_list.remove(instance.author)
        if issue.raised_by in recipient_list:
            recipient_list.remove(issue.raised_by)
    
        if recipient_list:
            notify.send(instance, recipient_list=recipient_list, actor=instance.author,
                        verb="commented on an issue you followed.", target=instance.issue, nf_type='issue')
        if instance.author != issue.raised_by:
            notify.send(instance, recipient=issue.raised_by, actor=instance.author,
                        verb="commented on your raised issue.", target=instance.issue, nf_type='issue')


@receiver(post_save, sender=Feedback)
def feedback_activity(sender, instance, created, **kwargs):
    if created:
        owner = instance.task.assigned_to
        notify.send(instance, recipient=owner, actor=instance.author,
                    verb="sent you feedback for your submitted task " + str(instance.task.name), target=instance.task, nf_type='task')
