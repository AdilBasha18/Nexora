from rest_framework import serializers
from .models import JobApplication, ApplicationStatusHistory
from jobs.serializers import JobSerializer
from resumes.serializers import ResumeSerializer
from candidates.serializers import CandidateProfileSerializer

class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.full_name', read_only=True)

    class Meta:
        model = ApplicationStatusHistory
        fields = ['id', 'from_status', 'to_status', 'changed_by_name', 'notes', 'changed_at']

class CandidateApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'resume', 'cover_letter', 'status', 
            'interview_date', 'interview_location_or_link', 'applied_at', 
            'updated_at', 'status_history'
        ]
        read_only_fields = ['id', 'status', 'interview_date', 'interview_location_or_link', 'applied_at', 'updated_at']

class RecruiterApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_id = serializers.IntegerField(source='job.id', read_only=True)
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    candidate_profile = serializers.SerializerMethodField()
    resume = ResumeSerializer(read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_id', 'job_title', 'candidate_name', 'candidate_email', 
            'candidate_profile', 'resume', 'cover_letter', 'status',
            'recruiter_notes', 'interview_date', 'interview_location_or_link',
            'interview_notes', 'applied_at', 'updated_at', 'status_history'
        ]
        read_only_fields = ['id', 'applied_at', 'updated_at']

    def get_candidate_profile(self, obj):
        try:
            return CandidateProfileSerializer(obj.candidate.candidate_profile).data
        except Exception:
            return None

class ApplyJobRequestSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    resume_id = serializers.IntegerField(required=False, allow_null=True)
    cover_letter = serializers.CharField(required=False, allow_blank=True)

