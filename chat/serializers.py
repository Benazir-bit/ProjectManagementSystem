from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Thread, Chat
from uspl.models import Issue, Task, Project


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name")
    image = serializers.ImageField(source="profile.image")

    class Meta:
        model = User
        fields = ['id', 'full_name', 'image']


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"


class ThreadSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField(
        source="get_messages", required=False)
    other_user = serializers.SerializerMethodField(
        source="get_other_user", required=False)
    last_updated = serializers.DateTimeField(source="get_last_updated")

    def get_messages(self, instance):
        if self.context['new'] == True:
            messages = instance.chat_set.all()[:1]
        else:
            messages = instance.chat_set.all()[:10]
        serializer = ChatSerializer(messages, many=True)
        return serializer.data

    def get_other_user(self, instance):
        owner = self.context['user']
        thread_users = instance.users.all().exclude(id=owner.id)
        if instance.is_group:
            serializer = UserSerializer(thread_users, many=True)
        else:
            serializer = UserSerializer(thread_users[0])
        return serializer.data

    class Meta:
        model = Thread
        fields = ["id", "is_group", "other_user",
                  "last_updated", "messages", "name"]


# class ChatSerializer(serializers.ModelSerializer):
#     # actor = UserSerializer(source="actor_obj")
#     actor = serializers.SerializerMethodField(source="get_actor")
#     target = serializers.SerializerMethodField(source="get_target")

#     def get_actor(self, instance):
#         if isinstance(instance.actor(), User):
#             user = instance.actor()
#             serializer = UserSerializer(user)
#             return serializer.data
#         else:
#             return instance.actor()

#     def get_target(self, instance):
#         if isinstance(instance.target(), Project):
#             project = instance.target()
#             serializer = ProjectSerializer(project)
#             return serializer.data
#         elif isinstance(instance.target(), Task):
#             task = instance.target()
#             serializer = TaskSerializer(task)
#             return serializer.data
#         elif isinstance(instance.target(), Issue):
#             issue = instance.target()
#             serializer = IssueSerializer(issue)
#             return serializer.data
#         else:
#             return instance.target()

#     class Meta:
#         model = Chat
#         fields = ['id', 'actor', 'verb', 'target', 'nf_type', 'created']
