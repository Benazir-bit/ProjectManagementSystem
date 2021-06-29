import asyncio
import json
from django.contrib.auth.models import User
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from knox.auth import TokenAuthentication
from .models import Thread, Chat
from .serializers import ChatSerializer, ThreadSerializer
# from .serializers import NotificationSerializer


class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("CONNECT")
        token_name, token_key = self.scope['query_string'].decode(
            'utf8').split("=")
        knoxAuth = TokenAuthentication()
        user, auth_token = knoxAuth.authenticate_credentials(
            token_key.encode('utf-8'))
        self.user_id = user.id
        self.group_name = f"chat_{user.id}"
        print(self.user_id, self.group_name)
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })

    @database_sync_to_async
    def save_new_thread(self, sender, other_user):
        print("THREAD SAVE")
        sender_obj = User.objects.get(id=sender)
        other_user_obj = User.objects.get(id=other_user)
        thread = Thread()
        thread.save()
        thread.users.add(sender_obj, other_user_obj)
        return thread

    @database_sync_to_async
    def save_chat_message(self, thread, sender, message):
        print("CHAT SAVE")
        # thread_obj = Thread.objects.get(id=thread)
        sender_obj = User.objects.get(id=sender)
        Chat.objects.create(
            sender=sender_obj,
            thread=thread,
            message=message
        )

    async def websocket_receive(self, event):
        text = event.get('text', None)
        if text is not None:
            chat_dict = json.loads(text)
            print(chat_dict)
            thread = chat_dict.get("thread", None)
            sender = chat_dict.get("sender", None)
            message = chat_dict.get("message", None)
            if thread:
                thread_obj = Thread.objects.get(id=thread)
                await self.save_chat_message(thread_obj, sender, message)
            else:
                other_user = chat_dict.get("receiver", None)
                print("OTHER_ID", other_user)
                saved_thread = await self.save_new_thread(sender, other_user)
                await self.save_chat_message(saved_thread, sender, message)

    async def websocket_disconnect(self, event):
        print("DISCONNECT")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    @database_sync_to_async
    def get_thread(self, id):
        return Thread.objects.get(id=id)

    @database_sync_to_async
    def get_user(self, id):
        return User.objects.get(id=id)

    @database_sync_to_async
    def get_serializer_data(self, thread, user):
        serializer = ThreadSerializer(
            thread, context={'user': user, 'new': True})
        return serializer.data

    async def message_send(self, event):
        # thread_id = event['text']
        obj = json.loads(event['text'])
        thread_id = obj.get('thread_id')
        user_id = obj.get('user_id')
        thread = await self.get_thread(thread_id)
        user = await self.get_user(user_id)
        print(thread, user)
        serializer_data = await self.get_serializer_data(thread, user)
        await self.send({
            "type": "websocket.send",
            "text": json.dumps(serializer_data)
        })
