from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import LeaveRequest

@receiver(post_save, sender=LeaveRequest)
def broadcast_leave_change(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'leave_updates',
        {
            'type': 'send_leave_event',
            'event': {
                'type': 'leave.changed',
                'id': instance.id,
                'student_name': instance.student.username,
                'parent_name': instance.parent.username,
                'reason': instance.reason,
                'from_date': str(instance.from_date),
                'to_date': str(instance.to_date),
                'status': instance.status,
            }
        }
    )