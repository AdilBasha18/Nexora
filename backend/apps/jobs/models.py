from django.db import models
from django.conf import settings
from django.utils.text import slugify
from companies.models import Company

class Job(models.Model):
    class ExperienceLevel(models.TextChoices):
        ENTRY = 'ENTRY', 'Entry Level'
        MID = 'MID', 'Mid Level'
        SENIOR = 'SENIOR', 'Senior'
        LEAD = 'LEAD', 'Lead / Staff'

    class EmploymentType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full-time'
        PART_TIME = 'PART_TIME', 'Part-time'
        CONTRACT = 'CONTRACT', 'Contract'
        INTERNSHIP = 'INTERNSHIP', 'Internship'

    class WorkMode(models.TextChoices):
        REMOTE = 'REMOTE', 'Remote'
        HYBRID = 'HYBRID', 'Hybrid'
        ONSITE = 'ONSITE', 'Onsite'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_REVIEW = 'PENDING_REVIEW', 'Pending Review'
        APPROVED = 'APPROVED', 'Approved'
        PUBLISHED = 'PUBLISHED', 'Published'
        PAUSED = 'PAUSED', 'Paused'
        REJECTED = 'REJECTED', 'Rejected'
        CLOSED = 'CLOSED', 'Closed'
        SUSPENDED = 'SUSPENDED', 'Suspended'

    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_jobs')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.ENTRY)
    min_experience_years = models.DecimalField(max_digits=4, decimal_places=1, default=0.0)
    employment_type = models.CharField(max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME)
    work_mode = models.CharField(max_length=20, choices=WorkMode.choices, default=WorkMode.REMOTE)
    location = models.CharField(max_length=255, default='Remote')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='INR')
    is_salary_disclosed = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    is_verified = models.BooleanField(default=False)
    application_deadline = models.DateField(null=True, blank=True)
    has_scam_warning = models.BooleanField(default=False)
    scam_warning_reason = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviewed_jobs')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.company.name}")
            slug = base_slug
            counter = 1
            while Job.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"

