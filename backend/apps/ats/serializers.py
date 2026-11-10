from rest_framework import serializers
from .models import ATSAnalysis
from resumes.models import Resume

class ATSAnalysisSerializer(serializers.ModelSerializer):
    resume_title = serializers.CharField(source='resume.title', read_only=True)

    class Meta:
        model = ATSAnalysis
        fields = [
            'id', 'resume', 'resume_title', 'job_title', 'job_description',
            'overall_score', 'matched_skills', 'missing_skills', 'keyword_analysis',
            'section_analysis', 'score_breakdown', 'recommendations', 'created_at'
        ]
        read_only_fields = [
            'id', 'overall_score', 'matched_skills', 'missing_skills',
            'keyword_analysis', 'section_analysis', 'score_breakdown', 'recommendations', 'created_at'
        ]

class ATSCheckRequestSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=False, allow_null=True)
    resume_text = serializers.CharField(required=False, allow_blank=True)
    job_title = serializers.CharField(required=False, default='Software Role')
    job_description = serializers.CharField(required=False, allow_blank=True)

