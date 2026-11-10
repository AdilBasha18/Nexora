from django.db import models
from django.conf import settings
from resumes.models import Resume

class ATSAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ats_analyses')
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True, related_name='analyses')
    job_title = models.CharField(max_length=255, default='General Software Role')
    job_description = models.TextField(blank=True, default='')
    overall_score = models.IntegerField(default=0)  # 0 to 100
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    keyword_analysis = models.JSONField(default=dict)
    section_analysis = models.JSONField(default=dict)
    score_breakdown = models.JSONField(default=dict)
    recommendations = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ATS Analysis ({self.overall_score}%) for {self.user.full_name} - {self.job_title}"

