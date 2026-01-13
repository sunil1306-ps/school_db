from rest_framework import generics, permissions
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeacherPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'

@api_view(['GET'])
@permission_classes([TeacherPermission])
def user_list(request):
    qs = User.objects.all().order_by('-date_joined')
    return Response(UserSerializer(qs, many=True).data)

@api_view(['GET'])
def me(request):
    return Response({'id':request.user.id,'username':request.user.username,
                     'role':request.user.role,'email':request.user.email})

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_students(request):
    students = User.objects.filter(parent=request.user, role='student')
    return Response(UserSerializer(students, many=True).data)
