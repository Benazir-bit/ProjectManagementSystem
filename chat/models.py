from django.db import models
import json
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your models here.
class Thread(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    users = models.ManyToManyField(User)
    is_group = models.BooleanField(default=False, null=True)

    def __str__(self):
        return str(self.id)

    def get_last_updated(self):
        latest_chat = self.chat_set.latest('timestamp')
        return latest_chat.timestamp


class Chat(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name="chat_sender")
    message = models.CharField(max_length=1000, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return str(self.thread.id) + " " + str(self.sender) + " " + str(self.id)

    class Meta:
        ordering = ('-id',)


class Image(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='chat_image', blank=True)

    def __str__(self):
        return str(self.chat.sender) + " to " + str(self.chat.recipient)


@receiver(post_save, sender=Chat)
def send_chat_message(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        thread_id = instance.thread.id
        for user in instance.thread.users.all():
            group_name = f"chat_{user.id}"
            obj = {
                "thread_id": thread_id,
                "user_id": user.id
            }
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    "type": "message.send",
                    "text": json.dumps(obj)
                }
            )
