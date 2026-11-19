from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = 'CANDIDATE', 'Candidate'
        RECRUITER = 'RECRUITER', 'Recruiter'
        ADMIN = 'ADMIN', 'Administrator'

    class RecruiterStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        SUSPENDED = 'SUSPENDED', 'Suspended'

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)
    recruiter_status = models.CharField(max_length=20, choices=RecruiterStatus.choices, default=RecruiterStatus.APPROVED)
    recruiter_rejection_reason = models.TextField(blank=True)
    is_verified_recruiter = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.role}"

    @property
    def is_candidate(self):
        return self.role == self.Role.CANDIDATE

    @property
    def is_recruiter(self):
        return self.role == self.Role.RECRUITER

    @property
    def is_approved_recruiter(self):
        return self.role == self.Role.RECRUITER and self.recruiter_status == self.RecruiterStatus.APPROVED and not self.is_suspended

    @property
    def is_platform_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser
