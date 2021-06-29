from django.contrib.auth import logout
from django.conf import settings
from django.contrib import auth
import datetime
from django.utils import timezone

class ActiveUserMiddleware(object):
    def process_request(self, request):
        if not request.user.is_authenticated():
            return
        if not request.user.is_active:
           logout(request)