from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import QuerySet
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.utils import timezone
# Serializer to serialize websocket data
# from .serializers import NotificationSerializer

# Create your models here.


# class NotificationQueryset(QuerySet):

#     """
#     Chain-able QuerySets using ```.as_manager()``.
#     """

#     def prefetch(self):
#         """
#         Marks the current queryset to prefetch all generic relations.
#         """
#         qs = self.select_related()
#         qs._prefetch_relations = True
#         return qs

#     def _fetch_all(self):
#         if self._result_cache is None:
#             if hasattr(self, '_prefetch_relations'):
#                 # removes the flag since prefetch_relations is recursive
#                 del self._prefetch_relations
#                 prefetch_relations(self)
#                 self._prefetch_relations = True
#         return super(NotificationQueryset, self)._fetch_all()

#     def _clone(self, **kwargs):
#         clone = super(NotificationQueryset, self)._clone(**kwargs)
#         if hasattr(self, '_prefetch_relations'):
#             clone._prefetch_relations = True
#         return clone

#     def active(self):
#         """
#         QuerySet filter() for retrieving both read and unread notifications
#         which are not soft-deleted.

#         :return: Non soft-deleted notifications.
#         """
#         return self.filter(deleted=False)

#     def read(self):
#         """
#         QuerySet filter() for retrieving read notifications.

#         :return: Read and active Notifications filter().
#         """
#         return self.filter(deleted=False, read=True)

#     def unread(self):
#         """
#         QuerySet filter() for retrieving unread notifications.

#         :return: Unread and active Notifications filter().
#         """
#         return self.filter(deleted=False, read=False)

#     def unread_all(self, user=None):
#         """
#         Marks all notifications as unread for a user (if supplied)

#         :param user: Notification recipient.

#         :return: Updates QuerySet as unread.
#         """
#         qs = self.read()
#         if user:
#             qs = qs.filter(recipient=user)
#         qs.update(read=False)

#     def read_all(self, user=None):
#         """
#         Marks all notifications as read for a user (if supplied)

#         :param user: Notification recipient.

#         :return: Updates QuerySet as read.
#         """
#         qs = self.unread()
#         if user:
#             qs = qs.filter(recipient=user)
#         qs.update(read=True)

#     def delete_all(self, user=None):
#         """
#         Method to soft-delete all notifications of a User (if supplied)

#         :param user: Notification recipient.

#         :return: Updates QuerySet as soft-deleted.
#         """
#         qs = self.active()
#         if user:
#             qs = qs.filter(recipient=user)

#         soft_delete = getattr(settings, 'NOTIFY_SOFT_DELETE', True)

#         if soft_delete:
#             qs.update(deleted=True)
#         else:
#             qs.delete()

#     def active_all(self, user=None):
#         """
#         Method to soft-delete all notifications of a User (if supplied)

#         :param user: Notification recipient.

#         :return: Updates QuerySet as soft-deleted.
#         """
#         qs = self.deleted()
#         if user:
#             qs = qs.filter(recipient=user)
#         qs.update(deleted=False)

#     def deleted(self):
#         """
#         QuerySet ``filter()`` for retrieving soft-deleted notifications.

#         :return: Soft deleted notification filter()
#         """
#         return self.filter(deleted=True)


class Notification(models.Model):
    recipient = models.ForeignKey(User, related_name='notifications',
                                  on_delete=models.CASCADE, verbose_name=_('Notification receiver'))

    # actor attributes.
    actor_content_type = models.ForeignKey(
        ContentType, null=True, blank=True,
        related_name='notify_actor', on_delete=models.CASCADE,
        verbose_name=_('Content type of actor object'))

    actor_object_id = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name=_('ID of the actor object'))

    actor_content_object = GenericForeignKey('actor_content_type',
                                             'actor_object_id')

    actor_text = models.CharField(max_length=255, blank=True, null=True)

    verb = models.CharField(max_length=100,
                            verbose_name=_('Verb of the action'))

    # target attributes.
    target_content_type = models.ForeignKey(
        ContentType, null=True, blank=True,
        related_name='notify_target', on_delete=models.CASCADE,
        verbose_name=_('Content type of target object'))

    target_object_id = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name=_('ID of the target object'))

    target_content_object = GenericForeignKey('target_content_type',
                                              'target_object_id')

    target_text = models.CharField(max_length=255, blank=True, null=True)

    nf_type = models.CharField(max_length=20, default='default',
                               verbose_name=_('Type of notification'))

    # Advanced details.
    created = models.DateTimeField(auto_now=False, auto_now_add=True)
    read = models.BooleanField(default=False,
                               verbose_name=_('Read status'))
    deleted = models.BooleanField(default=False,
                                  verbose_name=_('Soft delete status'))
    # objects = NotificationQueryset.as_manager()

    class Meta(object):
        ordering = ('-created', )

    def actor(self):
        return self.actor_content_object or self.actor_text

    def target(self):
        return self.target_content_object or self.target_text

    def __str__(self):
        return str(self.id)


@receiver(post_save, sender=Notification)
def notification_sender(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_name = f"ntf_{instance.recipient.id}"
        ntf_id = instance.id
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "notification.send",
                "text": ntf_id
            }
        )
