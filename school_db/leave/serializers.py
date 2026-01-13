from rest_framework import serializers
from .models import LeaveRequest

class LeaveRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    parent_name  = serializers.CharField(source='parent.username', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = ['id','student','parent','reason','from_date','to_date',
                  'status','created','student_name','parent_name']   # ← added
        read_only_fields = ['parent','status']