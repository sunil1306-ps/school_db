from django.db import models
from django.conf import settings

class LeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
    )
    student   = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  on_delete=models.CASCADE,
                                  related_name='leave_requests_as_student',
                                  limit_choices_to={'role':'student'})
    parent    = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  on_delete=models.CASCADE,
                                  related_name='leave_requests_as_parent',
                                  limit_choices_to={'role':'parent'})
    reason    = models.TextField()
    from_date = models.DateField()
    to_date   = models.DateField()
    status    = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f'Leave #{self.pk} for {self.student.username}'