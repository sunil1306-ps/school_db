from rest_framework import permissions

class LeaveRequestPermission(permissions.BasePermission):
    """
    Create: only parent
    List:  parent sees own, student sees own, teacher sees all
    Retrieve: parent/student/teacher if involved
    Update: only teacher can change status
    """
    def has_permission(self, request, view):
        # authenticated only
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == 'teacher':
            return True
        if request.method in permissions.SAFE_METHODS:
            return user in (obj.student, obj.parent)
        # write → only teacher
        return user.role == 'teacher'
    
class DenyAll(permissions.BasePermission):
    def has_permission(self, request, view):
        return False

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'teacher'