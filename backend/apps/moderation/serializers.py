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

