from rest_framework import serializers
# from uspl.models import *
from django.contrib.auth.models import User, Group
from uspl.serializers import UserSerializer
from .models import *
from django.contrib.auth import authenticate


# class UserSerializer(serializers.ModelSerializer):
#     full_name = serializers.CharField(source="get_full_name")
#     image = serializers.ImageField(source="profile.image")
#     groups = GroupSmallListSerializer(
#         source="profile.get_employee_groups", many=True)
#     class Meta:
#         model = User
#         fields = ['id', 'username',"full_name",  'image']

class WeeklystatusreportPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkStatus
        fields = '__all__'
        
        
class WeeklystatusreportSerializer(serializers.ModelSerializer):
    gtype = serializers.CharField(source="get_type")
    recipent = UserSerializer(many=True)
    sender = UserSerializer()
    cc_list= UserSerializer(many=True)
    class Meta:
        model = WorkStatus
        fields = '__all__'

class ActivityCompletedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityCompleted
        fields = '__all__'

class ActivityInProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityInProgress
        fields = '__all__'

class ActivityNextWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityNextWeek
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

