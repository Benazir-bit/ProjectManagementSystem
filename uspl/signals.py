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
                    verb='created a new project: '+str(instance.name), target=instance, nf_type='new_project')
        manager_list = list(User.objects.filter(is_staff=True))
        recipient_list = group_members + manager_list
        print(recipient_list)
        notify.send(instance.created_by, recipient_list=recipient_list, actor=instance.created_by,
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
    if created:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="assigned to a new task called "+str(instance.name),
            created_date=timezone.now()
        )
        notify.send(instance, recipient=instance.assigned_to, actor=instance.created_by,
                    verb="assigned you to a new task called " + str(instance.name), target=instance, nf_type='task')
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
        notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="started a task called " + str(instance.name), target=instance, nf_type='task')
    elif instance.started and instance.paused and not instance.submitted:
        News.objects.create(
            task=instance,
            project=instance.project,
            group=instance.project.group,
            owner=instance.assigned_to,
            message="paused the task " +
            str(instance.name)+" due to a raised issue.",
            created_date=timezone.now()
        )
        supervisor = instance.project.supervisor
        notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="paused a task called " + str(instance.name) + " due to a raised issue.", target=instance, nf_type='task')

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
        notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="resumed a paused task called "+str(instance.name), target=instance, nf_type='task')

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
        notify.send(instance, recipient=supervisor, actor=instance.assigned_to,
                    verb="submitted a task called "+str(instance.name), target=instance, nf_type='task')

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
        notify.send(instance, recipient=instance.assigned_to, actor=supervisor,
                    verb="marked your submitted task " + str(instance.name) + " as completed.", target=instance, nf_type='task')


@receiver(post_save, sender=Issue)
def issue_activity(sender, instance, created, **kwargs):
    if created:
        News.objects.create(
            task=instance.task,
            project=instance.task.project,
            group=instance.task.project.group,
            owner=instance.raised_by,
            message="raised an issue for the task  "+str(instance.task.name),
            created_date=timezone.now()
        )
        group_members = list(instance.task.project.group.user_set.all().exclude(
            id=instance.raised_by.id))
        notify.send(instance, recipient_list=group_members, actor=instance.raised_by,
                    verb="raised a new issue", target=instance, nf_type='issue')
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
        related_users = issue.get_related_users()
        if related_users:
            notify.send(instance, recipient_list=related_users, actor=instance.author,
                        verb="commented on an issue you followed.", target=instance.issue, nf_type='issue')
        if instance.author !=  issue.raised_by:
            notify.send(instance, recipient_list=related_users, actor=instance.author,
                        verb="commented on your raised issue.", target=instance.issue, nf_type='issue')


@receiver(post_save, sender=Feedback)
def feedback_activity(sender, instance, created, **kwargs):
    if created:
        owner = instance.task.assigned_to
        notify.send(instance, recipient=owner, actor=instance.author,
                    verb="sent you feedback for your submitted task " + str(instance.task.name), target=instance.task, nf_type='task')
