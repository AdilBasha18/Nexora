from django.db import models
from django.conf import settings
from django.utils import timezone

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


class EmailNotification(models.Model):
    """
    Tracks all automated transactional emails sent by Nexora.
    Guarantees idempotency (no duplicate emails), delivery auditing, and safe retry handling.
    """
    class EventType(models.TextChoices):
        CANDIDATE_WELCOME = 'CANDIDATE_WELCOME', 'Candidate Welcome Email'
        RECRUITER_WELCOME = 'RECRUITER_WELCOME', 'Recruiter Welcome Email'
        CANDIDATE_APPLICATION_CONFIRMATION = 'CANDIDATE_APPLICATION_CONFIRMATION', 'Candidate Application Confirmation'
        RECRUITER_APPLICATION_RECEIVED = 'RECRUITER_APPLICATION_RECEIVED', 'Recruiter Application Received'
        ADMIN_COMPANY_VERIFICATION_SUBMITTED = 'ADMIN_COMPANY_VERIFICATION_SUBMITTED', 'Admin Company Verification Alert'
        RECRUITER_JOB_SUBMITTED = 'RECRUITER_JOB_SUBMITTED', 'Recruiter Job Submitted'
        ADMIN_JOB_SUBMITTED = 'ADMIN_JOB_SUBMITTED', 'Admin Job Submission Alert'
        RECRUITER_JOB_APPROVED = 'RECRUITER_JOB_APPROVED', 'Recruiter Job Approved'
        RECRUITER_JOB_REJECTED = 'RECRUITER_JOB_REJECTED', 'Recruiter Job Rejected'
        RECRUITER_ACCOUNT_APPROVED = 'RECRUITER_ACCOUNT_APPROVED', 'Recruiter Account Approved'
        RECRUITER_ACCOUNT_REJECTED = 'RECRUITER_ACCOUNT_REJECTED', 'Recruiter Account Rejected'
        RECRUITER_VERIFICATION_CONFIRMATION = 'RECRUITER_VERIFICATION_CONFIRMATION', 'Recruiter Company Verification Confirmation'
        ADMIN_RECRUITER_REGISTERED = 'ADMIN_RECRUITER_REGISTERED', 'Admin Recruiter Registered Alert'
        CANDIDATE_STATUS_UPDATE = 'CANDIDATE_STATUS_UPDATE', 'Candidate Application Status Update'
        CANDIDATE_INTERVIEW_INVITE = 'CANDIDATE_INTERVIEW_INVITE', 'Candidate Interview Invitation'
        ADMIN_JOB_REPORTED = 'ADMIN_JOB_REPORTED', 'Admin Job Reported Alert'
        ADMIN_SECURITY_EVENT = 'ADMIN_SECURITY_EVENT', 'Admin Security Event Alert'
        PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST', 'Password Reset Request'
        EMAIL_CHANGE_REQUEST = 'EMAIL_CHANGE_REQUEST', 'Email Change Request'
        EMAIL_VERIFIED = 'EMAIL_VERIFIED', 'Email Address Verified'
        SUPPORT_REQUEST_ADMIN = 'SUPPORT_REQUEST_ADMIN', 'Support Request Admin Alert'
        SUPPORT_REQUEST_CONFIRMATION = 'SUPPORT_REQUEST_CONFIRMATION', 'Support Request Confirmation'
        TEST_EMAIL = 'TEST_EMAIL', 'Test Email Delivery'

    class DeliveryStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SENT = 'SENT', 'Sent'
        FAILED = 'FAILED', 'Failed'

    recipient_email = models.EmailField(db_index=True)
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='email_notifications'
    )
    subject = models.CharField(max_length=255)
    body_html = models.TextField()
    body_text = models.TextField(blank=True, default='')
    event_type = models.CharField(max_length=60, choices=EventType.choices, db_index=True)
    idempotency_key = models.CharField(max_length=255, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=DeliveryStatus.choices, default=DeliveryStatus.PENDING, db_index=True)
    error_message = models.TextField(blank=True, null=True)
    retry_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.status}] {self.recipient_email} - {self.subject} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class SupportTicket(models.Model):
    class UserType(models.TextChoices):
        CANDIDATE = 'CANDIDATE', 'Candidate'
        RECRUITER = 'RECRUITER', 'Recruiter'
        OTHER = 'OTHER', 'Other / Visitor'

    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed'

    name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.CANDIDATE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.status}] {self.name} ({self.email}): {self.subject}"
