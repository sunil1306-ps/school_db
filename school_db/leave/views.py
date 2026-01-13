from django.db import models
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from .permissions import LeaveRequestPermission
from rest_framework.decorators import action
from .permissions import DenyAll, IsTeacher

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.select_related('student','parent')
    serializer_class = LeaveRequestSerializer
    permission_classes = [LeaveRequestPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return self.queryset
        # parent or student → only requests that involve them
        return self.queryset.filter(models.Q(student=user) | models.Q(parent=user))

    def perform_create(self, serializer):
        # force parent = current user
        serializer.save(parent=self.request.user)

    def update(self, request, *args, **kwargs):
        # only allow status change, nothing else
        if 'status' not in request.data:
            return Response({'detail':'Only status can be updated'},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def get_permissions(self):
        """
        Students can list/retrieve only (no create/update/destroy).
        """
        if self.action == 'create' and self.request.user.role == 'student':
            self.permission_classes = [DenyAll]   # custom deny class below
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # extra safety: block student at view level too
        if request.user.role == 'student':
            return Response({'detail':'Students cannot create leave requests.'},
                            status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='status',
            permission_classes=[IsTeacher])  
    def set_status(self, request, pk=None):
        leave = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ('approved', 'rejected'):
            return Response({'detail':'Choose approved or rejected'},
                            status=status.HTTP_400_BAD_REQUEST)
        leave.status = new_status
        leave.save(update_fields=['status'])
        return Response(LeaveRequestSerializer(leave, context=self.get_serializer_context()).data)