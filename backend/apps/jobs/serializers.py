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
            'scam_warning_reason', 'rejection_reason', 'is_saved', 'application_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'company', 'is_verified', 'has_scam_warning', 'scam_warning_reason', 'rejection_reason', 'created_at', 'updated_at']

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'responsibilities', 'required_skills', 
            'preferred_skills', 'experience_level', 'min_experience_years',
            'employment_type', 'work_mode', 'location', 'salary_min',
            'salary_max', 'salary_currency', 'is_salary_disclosed',
            'status', 'application_deadline', 'rejection_reason'
        ]
        read_only_fields = ['id', 'rejection_reason']

    def create(self, validated_data):
        recruiter = self.context['request'].user
        from companies.models import RecruiterProfile
        profile = RecruiterProfile.objects.get(user=recruiter)
        company = profile.company

        # If recruiter requested draft, keep DRAFT; otherwise enforce PENDING_REVIEW (Chunk 4)
        desired_status = validated_data.get('status', Job.Status.PENDING_REVIEW)
        if desired_status != Job.Status.DRAFT:
            validated_data['status'] = Job.Status.PENDING_REVIEW

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

    def update(self, instance, validated_data):
        # Chunk 4: If a published/approved job is edited in a significant way, send it for approval again.
        significant_fields = ['title', 'description', 'salary_min', 'salary_max', 'required_skills']
        significant_change = any(
            field in validated_data and validated_data[field] != getattr(instance, field)
            for field in significant_fields
        )

        desired_status = validated_data.get('status', instance.status)
        if desired_status != Job.Status.DRAFT:
            if significant_change or instance.status == Job.Status.REJECTED:
                validated_data['status'] = Job.Status.PENDING_REVIEW
                validated_data['rejection_reason'] = ''

        # Re-evaluate scam shield
        title = validated_data.get('title', instance.title)
        desc = validated_data.get('description', instance.description)
        resp = validated_data.get('responsibilities', instance.responsibilities)
        has_warning, reason = evaluate_job_scam_risk(title, desc, resp)
        validated_data['has_scam_warning'] = has_warning
        validated_data['scam_warning_reason'] = reason

        return super().update(instance, validated_data)

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']

