from rest_framework import serializers
from .models import Job, SavedJob
from companies.serializers import CompanySerializer
from .scam_shield import evaluate_job_scam_risk

class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()
    application_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'slug', 'company', 'description', 'responsibilities',
            'required_skills', 'preferred_skills', 'experience_level',
            'min_experience_years', 'employment_type', 'work_mode', 'location',
            'salary_min', 'salary_max', 'salary_currency', 'is_salary_disclosed',
            'status', 'is_verified', 'application_deadline', 'has_scam_warning',
            'scam_warning_reason', 'is_saved', 'application_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'company', 'is_verified', 'has_scam_warning', 'scam_warning_reason', 'created_at', 'updated_at']

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'responsibilities', 'required_skills', 
            'preferred_skills', 'experience_level', 'min_experience_years',
            'employment_type', 'work_mode', 'location', 'salary_min',
            'salary_max', 'salary_currency', 'is_salary_disclosed',
            'status', 'application_deadline'
        ]

    def create(self, validated_data):
        recruiter = self.context['request'].user
        from companies.models import RecruiterProfile
        profile = RecruiterProfile.objects.get(user=recruiter)
        company = profile.company

        # Evaluate scam shield
        has_warning, reason = evaluate_job_scam_risk(
            validated_data.get('title', ''),
            validated_data.get('description', ''),
            validated_data.get('responsibilities', '')
        )

        job = Job.objects.create(
            recruiter=recruiter,
            company=company,
            is_verified=company.is_verified,  # Auto-verified if company is verified
            has_scam_warning=has_warning,
            scam_warning_reason=reason,
            **validated_data
        )
        return job

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']

