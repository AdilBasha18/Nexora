from rest_framework import serializers
from .models import JobReport, AuditLog
from jobs.serializers import JobSerializer
from companies.serializers import CompanyVerificationSerializer

class JobReportSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)

    class Meta:
        model = JobReport
        fields = [
            'id', 'job', 'job_title', 'company_name', 'reported_by_name',
            'reason', 'details', 'status', 'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reported_by_name', 'created_at', 'updated_at']

class CreateJobReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobReport
        fields = ['job', 'reason', 'details']

class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.full_name', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'actor_name', 'action', 'target_type', 'target_id', 'details', 'timestamp']

class AdminRecruiterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    full_name = serializers.CharField()
    role = serializers.CharField()
    recruiter_status = serializers.CharField()
    recruiter_rejection_reason = serializers.CharField()
    is_verified_recruiter = serializers.BooleanField()
    is_suspended = serializers.BooleanField()
    created_at = serializers.DateTimeField()
    company = serializers.SerializerMethodField()
    verification = serializers.SerializerMethodField()
    jobs_count = serializers.SerializerMethodField()

    def get_company(self, obj):
        try:
            profile = obj.recruiter_profile
            return {
                'id': profile.company.id,
                'name': profile.company.name,
                'website': profile.company.website,
                'is_verified': profile.company.is_verified,
                'job_title': profile.job_title,
                'location': profile.company.location
            }
        except Exception:
            return None

    def get_verification(self, obj):
        try:
            profile = obj.recruiter_profile
            v = profile.company.verifications.order_by('-created_at').first()
            if v:
                return CompanyVerificationSerializer(v).data
        except Exception:
            pass
        return None

    def get_jobs_count(self, obj):
        return obj.posted_jobs.count()

class AdminUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    full_name = serializers.CharField()
    role = serializers.CharField()
    is_suspended = serializers.BooleanField()
    recruiter_status = serializers.CharField()
    created_at = serializers.DateTimeField()
    extra_info = serializers.SerializerMethodField()

    def get_extra_info(self, obj):
        if obj.is_recruiter:
            try:
                return f"Company: {obj.recruiter_profile.company.name} ({obj.recruiter_status})"
            except Exception:
                return "Recruiter (No Company Profile)"
        elif obj.is_candidate:
            try:
                return f"Target: {obj.candidate_profile.target_role or 'General'}"
            except Exception:
                return "Candidate"
        return "Administrator"

