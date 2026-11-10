from django.db import models
from django.conf import settings

class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255, default='My Resume')
    file = models.FileField(upload_to='resumes/')
    file_type = models.CharField(max_length=10, default='pdf')
    file_size = models.PositiveIntegerField(default=0)  # in bytes
    extracted_text = models.TextField(blank=True)
    parsed_skills = models.JSONField(default=list, blank=True)
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Unset any existing primary resume for this user
            Resume.objects.filter(user=self.user, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.full_name} - {self.title} ({self.file_type.upper()})"

