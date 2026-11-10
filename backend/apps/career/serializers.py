from rest_framework import serializers
from .models import TargetRole, CareerRoadmap, RoadmapStep, CareerResource

class TargetRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetRole
        fields = ['id', 'title', 'slug', 'description', 'market_demand', 'average_salary', 'required_skills', 'preferred_skills']

class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = ['id', 'phase', 'title', 'description', 'skill_name', 'resource_title', 'resource_url', 'estimated_duration', 'order', 'is_completed', 'verified_by_assessment']

class CareerRoadmapSerializer(serializers.ModelSerializer):
    target_role = TargetRoleSerializer(read_only=True)
    steps = RoadmapStepSerializer(many=True, read_only=True)

    class Meta:
        model = CareerRoadmap
        fields = ['id', 'target_role', 'overall_progress', 'steps', 'created_at', 'updated_at']

class CareerResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerResource
        fields = ['id', 'title', 'category', 'description', 'url', 'reading_time', 'is_free', 'created_at']

