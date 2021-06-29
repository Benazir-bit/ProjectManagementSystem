from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Notification
from uspl.models import Issue, Task, Project


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name")
    image = serializers.ImageField(source="profile.image")

    class Meta:
        model = User
        fields = ['id', 'full_name', 'image']


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ['id', 'name']


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'name']


class IssueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Issue
        fields = ['id', 'name']


class NotificationSerializer(serializers.ModelSerializer):
    # actor = UserSerializer(source="actor_obj")
    actor = serializers.SerializerMethodField(source="get_actor")
    target = serializers.SerializerMethodField(source="get_target")

    def get_actor(self, instance):
        if isinstance(instance.actor(), User):
            user = instance.actor()
            serializer = UserSerializer(user)
            return serializer.data
        else:
            return instance.actor()

    def get_target(self, instance):
        if isinstance(instance.target(), Project):
            project = instance.target()
            serializer = ProjectSerializer(project)
            return serializer.data
        elif isinstance(instance.target(), Task):
            task = instance.target()
            serializer = TaskSerializer(task)
            return serializer.data
        elif isinstance(instance.target(), Issue):
            issue = instance.target()
            serializer = IssueSerializer(issue)
            return serializer.data
        else:
            return instance.target()

    class Meta:
        model = Notification
        fields = ['id', 'actor', 'verb', 'target', 'nf_type', 'created']
