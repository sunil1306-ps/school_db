from django.urls import path
from .views import RegisterView, user_list, me, my_students

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', user_list, name='user-list'),
    path('api/user/me/', me),
    path('api/my-students/', my_students, name='my-students'),
]