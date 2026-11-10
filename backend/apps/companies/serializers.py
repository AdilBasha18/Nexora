from rest_framework import serializers
from .models import Company, RecruiterProfile, CompanyVerification

class CompanySerializer(serializers.ModelSerializer):
    recruiter_count = serializers.IntegerField(source='recruiters.count', read_only=True)
    active_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'slug', 'logo_url', 'website', 'industry', 
            'company_size', 'location', 'description', 'is_verified', 
            'recruiter_count', 'active_jobs_count', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'is_verified', 'created_at']

    def get_active_jobs_count(self, obj):
        return obj.jobs.filter(status='PUBLISHED').count()

class RecruiterProfileSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = ['id', 'full_name', 'email', 'company', 'job_title', 'phone', 'created_at']

class CompanyVerificationSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.full_name', read_only=True)

    class Meta:
        model = CompanyVerification
        fields = [
            'id', 'company', 'company_name', 'submitted_by_name', 
            'business_reg_number', 'official_domain_email', 'supporting_document',
            'notes', 'status', 'reviewer_notes', 'reviewed_at', 'created_at'
        ]
        read_only_fields = ['id', 'submitted_by_name', 'status', 'reviewer_notes', 'reviewed_at', 'created_at']

