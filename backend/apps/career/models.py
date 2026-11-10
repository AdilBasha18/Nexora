from django.db import models
from django.conf import settings
from django.utils.text import slugify

class TargetRole(models.Model):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    market_demand = models.CharField(max_length=50, default='High')
    average_salary = models.CharField(max_length=100, default='$85,000 - $130,000')
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class CareerRoadmap(models.Model):
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='roadmaps')
    target_role = models.ForeignKey(TargetRole, on_delete=models.CASCADE, related_name='roadmaps')
    overall_progress = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('candidate', 'target_role')

    def calculate_progress(self):
        total = self.steps.count()
        if total == 0:
            return 0
        completed = self.steps.filter(is_completed=True).count()
        return int((completed / total) * 100)

    def __str__(self):
        return f"{self.candidate.full_name}'s Roadmap for {self.target_role.title}"

class RoadmapStep(models.Model):
    roadmap = models.ForeignKey(CareerRoadmap, on_delete=models.CASCADE, related_name='steps')
    phase = models.CharField(max_length=100, default='Phase 1: Fundamentals')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    skill_name = models.CharField(max_length=100)
    resource_title = models.CharField(max_length=255, default='Official Documentation')
    resource_url = models.URLField(max_length=500, blank=True)
    estimated_duration = models.CharField(max_length=100, default='1-2 weeks')
    order = models.PositiveIntegerField(default=1)
    is_completed = models.BooleanField(default=False)
    verified_by_assessment = models.BooleanField(default=False)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Step {self.order}: {self.title} ({'Done' if self.is_completed else 'Pending'})"

class CareerResource(models.Model):
    class Category(models.TextChoices):
        INTERVIEW = 'INTERVIEW', 'Interview Preparation'
        RESUME = 'RESUME', 'Resume & ATS Optimization'
        SKILLS = 'SKILLS', 'Technical Skills & Tutorials'
        CAREER_PATH = 'CAREER_PATH', 'Career Roadmaps & Strategy'

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.CAREER_PATH)
    description = models.TextField()
    url = models.URLField(max_length=500, blank=True)
    reading_time = models.CharField(max_length=50, default='5 min read')
    is_free = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.category}] {self.title}"

