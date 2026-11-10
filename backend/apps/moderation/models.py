from django.db import models
from django.conf import settings
from jobs.models import Job

class JobReport(models.Model):
    class Reason(models.TextChoices):
        PAYMENT_REQUEST = 'PAYMENT_REQUEST', 'Asking for Money / Application Fees'
        SUSPICIOUS_INFO = 'SUSPICIOUS_INFO', 'Requests Sensitive Personal / Financial Info'
        MISLEADING = 'MISLEADING', 'Misleading Job Role or Compensation'
        IMPERSONATION = 'IMPERSONATION', 'Company Impersonation / Fake Recruiter'
        OTHER = 'OTHER', 'Other Suspicious Behavior'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Investigation'
        INVESTIGATED = 'INVESTIGATED', 'Action Taken'
        DISMISSED = 'DISMISSED', 'Dismissed as Legitimate'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='reports')
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='filed_reports')
    reason = models.CharField(max_length=50, choices=Reason.choices)
    details = models.TextField()
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    admin_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report #{self.id} for {self.job.title} ({self.status})"

class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='audit_actions')
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=100)
    target_id = models.PositiveIntegerField(null=True, blank=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.actor} - {self.action} on {self.target_type} ({self.timestamp})"

