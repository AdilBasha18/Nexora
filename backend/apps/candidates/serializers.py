from rest_framework import serializers
from .models import CandidateProfile

class CandidateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    completion_percentage = serializers.ReadOnlyField()
    section_completion = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'full_name', 'email', 'headline', 'phone', 'location', 'city', 'state', 'country',
            'bio', 'profile_photo_url', 'target_role', 'preferred_work_mode', 'preferred_employment_type',
            'preferred_locations', 'preferred_industries', 'expected_salary', 'is_fresher',
            'experience_years', 'experience_level', 'skills', 'education', 'work_experience',
            'projects', 'certifications', 'github_url', 'linkedin_url', 'portfolio_url',
            'setup_step', 'is_profile_completed', 'completion_percentage', 'section_completion',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completion_percentage', 'section_completion']

    def get_section_completion(self, obj):
        return obj.get_section_completion()
