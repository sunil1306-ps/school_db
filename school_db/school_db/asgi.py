import os

# 1.  ENV first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_db.settings')

# 2.  Bootstrap Django apps
import django
django.setup()

# 3.  NOW import Django / channels stuff
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import leave.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(leave.routing.websocket_urlpatterns)
    ),
})