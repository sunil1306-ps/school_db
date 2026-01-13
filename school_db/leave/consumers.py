import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


class LeaveConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('🔵 CONNECT  path=', self.scope['path'], 'query=', self.scope['query_string'].decode())
        try:
            token = self.scope['query_string'].decode().split('token=')[-1]
            print('🔑 token received:', token)
            access = AccessToken(token)
            user = await database_sync_to_async(User.objects.get)(id=access['user_id'])
            print('✅ user authenticated:', user)
            self.scope['user'] = user
        except Exception as e:
            print('❌ auth failed:', e)
            await self.close(code=4001)
            return

        await self.channel_layer.group_add('leave_updates', self.channel_name)
        await self.accept()
        print('🟢 socket accepted')

    async def disconnect(self, code):
        print('🔴 DISCONNECT  code=', code, 'user=', getattr(self.scope, 'user', 'none'))
        await self.channel_layer.group_discard('leave_updates', self.channel_name)

    async def send_leave_event(self, event):
        print('📤 broadcasting to socket:', event['event'])
        await self.send(text_data=json.dumps(event['event']))