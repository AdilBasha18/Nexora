from django.db import models
from django.conf import settings
from jobs.models import Job
from resumes.models import Resume

class JobApplication(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        INTERVIEW = 'INTERVIEW', 'Interview Scheduled'
        OFFERED = 'OFFERED', 'Job Offered'
        REJECTED = 'REJECTED', 'Not Selected'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.SUBMITTED)
    
    # Recruiter private management fields
    recruiter_notes = models.TextField(blank=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_location_or_link = models.CharField(max_length=500, blank=True)
    interview_notes = models.TextField(blank=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'candidate')

    def __str__(self):
        return f"{self.candidate.full_name} -> {self.job.title} ({self.status})"

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=30)
    to_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_status} -> {self.to_status} on {self.changed_at}"

