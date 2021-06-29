import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from django.template.loader import get_template
from django.template import Context
from django.core.mail import EmailMultiAlternatives


def send_email(message):
    print("CONSUMER", message)
    message.send()
