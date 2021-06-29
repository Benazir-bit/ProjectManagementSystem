import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from knox.auth import TokenAuthentication
from .models import Notification
from .serializers import NotificationSerializer


class NotificationConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("CONNECTED")
        token_name, token_key = self.scope['query_string'].decode(
            'utf8').split("=")
        knoxAuth = TokenAuthentication()
        user, auth_token = knoxAuth.authenticate_credentials(
            token_key.encode('utf-8'))
        self.user_id = user.id
        self.group_name = f"ntf_{user.id}"
        print(self.group_name)
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        # When message is received from the websocket
        print("received", event)
        text = event.get('text', None)
        if text == "read-all":
            await self.read_all_ntfs()

    async def websocket_disconnect(self, event):
        print("DISCONNECTED")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    @database_sync_to_async
    def read_all_ntfs(self):
        qs = Notification.objects.filter(
            recipient__id=self.user_id).update(read=True)

    @database_sync_to_async
    def get_ntf(self, id):
        return Notification.objects.get(id=id)

    @database_sync_to_async
    def get_serialized_data(self, ntf_obj):
        serializer = NotificationSerializer(ntf_obj)
        return serializer.data

    async def notification_send(self, event):
        ntf_id = event['text']
        ntf = await self.get_ntf(ntf_id)
        serializer_data = await self.get_serialized_data(ntf)
        await self.send({
            "type": "websocket.send",
            "text": json.dumps(serializer_data)
        })
