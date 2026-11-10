from django.db import models
from django.conf import settings

class CandidateProfile(models.Model):
    class ExperienceLevel(models.TextChoices):
        ENTRY = 'ENTRY', 'Entry Level (0-2 years)'
        MID = 'MID', 'Mid Level (2-5 years)'
        SENIOR = 'SENIOR', 'Senior (5-8 years)'
        LEAD = 'LEAD', 'Lead / Principal (8+ years)'

    class WorkMode(models.TextChoices):
        REMOTE = 'REMOTE', 'Remote'
        HYBRID = 'HYBRID', 'Hybrid'
        ONSITE = 'ONSITE', 'Onsite'
        ANY = 'ANY', 'Any / Open to all'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidate_profile')
    headline = models.CharField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    location = models.CharField(max_length=150, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='India')
    bio = models.TextField(blank=True, default='')
    profile_photo_url = models.TextField(blank=True, default='')

    # Career Preferences
    target_role = models.CharField(max_length=150, blank=True, default='Software Engineer')
    preferred_work_mode = models.CharField(max_length=20, choices=WorkMode.choices, default=WorkMode.ANY)
    preferred_employment_type = models.CharField(max_length=50, blank=True, default='Full-time')
    preferred_locations = models.JSONField(default=list, blank=True)
    preferred_industries = models.JSONField(default=list, blank=True)
    expected_salary = models.CharField(max_length=100, blank=True, default='')

    # Experience details
    is_fresher = models.BooleanField(default=False)
    experience_years = models.DecimalField(max_digits=4, decimal_places=1, default=0.0)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.ENTRY)

    # Structured Arrays (Naukri / Unstop style)
    skills = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    work_experience = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)

    # Professional URLs
    github_url = models.URLField(max_length=500, blank=True, default='')
    linkedin_url = models.URLField(max_length=500, blank=True, default='')
    portfolio_url = models.URLField(max_length=500, blank=True, default='')

    # Onboarding Wizard Tracking
    setup_step = models.IntegerField(default=1)
    is_profile_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_section_completion(self):
        """Returns boolean status for each of the 8 candidate profile sections."""
        has_basic_info = bool(self.user.full_name and (self.phone or self.location or self.headline))
        has_education = bool(self.education and len(self.education) > 0)
        has_preferences = bool(self.target_role and self.preferred_work_mode)
        has_skills = bool(self.skills and len(self.skills) >= 2)
        has_experience = bool(self.is_fresher or (self.work_experience and len(self.work_experience) > 0))
        has_projects = bool(self.projects and len(self.projects) > 0)
        has_certifications_or_links = bool(self.github_url or self.linkedin_url or self.portfolio_url or (self.certifications and len(self.certifications) > 0))
        has_resume = False
        try:
            has_resume = self.user.resumes.exists()
        except Exception:
            pass

        return {
            "basic_info": has_basic_info,
            "education": has_education,
            "preferences": has_preferences,
            "skills": has_skills,
            "experience": has_experience,
            "projects": has_projects,
            "certifications": has_certifications_or_links,
            "resume": has_resume
        }

    def calculate_completion(self):
        """Calculates accurate 0-100% profile completeness."""
        sections = self.get_section_completion()
        score = 0
        if sections["basic_info"]: score += 15
        if sections["education"]: score += 15
        if sections["preferences"]: score += 10
        if sections["skills"]: score += 15
        if sections["experience"]: score += 15
        if sections["projects"]: score += 15
        if sections["certifications"]: score += 5
        if sections["resume"]: score += 10
        return min(score, 100)

    @property
    def completion_percentage(self):
        return self.calculate_completion()

    def __str__(self):
        return f"{self.user.full_name} ({self.target_role or 'Candidate'}) - {self.completion_percentage}%"
