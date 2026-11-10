from django.db import models
from django.conf import settings

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        APPLICATION_UPDATE = 'APPLICATION_UPDATE', 'Application Update'
        INTERVIEW_INVITE = 'INTERVIEW_INVITE', 'Interview Invitation'
        ASSESSMENT_RESULT = 'ASSESSMENT_RESULT', 'Assessment Result'
        JOB_RECOMMENDATION = 'JOB_RECOMMENDATION', 'Job Recommendation'
        SYSTEM = 'SYSTEM', 'System Alert'

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    link = models.CharField(max_length=255, blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.email}: {self.title} ({'Read' if self.is_read else 'Unread'})"

