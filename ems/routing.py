from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

from notification.consumers import NotificationConsumer
from chat.consumers import ChatConsumer
# from attendance.consumers import AttendanceConsumer
from uspl.consumers import send_email

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                    url(r"^notifications/$", NotificationConsumer),
                    url(r"^chat/$", ChatConsumer),
                    # url(r"^attendance/$", AttendanceConsumer),
                ]
            )
        )
    )
})
