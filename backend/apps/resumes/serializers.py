import os
from rest_framework import serializers
from .models import Resume
from .extractor import extract_text_from_file, extract_skills_from_text

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'file', 'file_type', 'file_size', 
            'extracted_text', 'parsed_skills', 'is_primary', 'uploaded_at'
        ]
        read_only_fields = ['id', 'file_type', 'file_size', 'extracted_text', 'parsed_skills', 'uploaded_at']

    def create(self, validated_data):
        file_obj = validated_data['file']
        filename = file_obj.name
        ext = os.path.splitext(filename)[1].lower().replace('.', '')
        if ext not in ['pdf', 'docx', 'doc', 'txt']:
            raise serializers.ValidationError({"file": "Only PDF, DOCX, and TXT files are supported."})
        
        # Max 5MB file size
        if file_obj.size > 5 * 1024 * 1024:
            raise serializers.ValidationError({"file": "File size exceeds 5MB limit."})

        # Extract text & skills
        extracted_text = extract_text_from_file(file_obj, filename)
        parsed_skills = extract_skills_from_text(extracted_text)

        validated_data['file_type'] = ext
        validated_data['file_size'] = file_obj.size
        validated_data['extracted_text'] = extracted_text
        validated_data['parsed_skills'] = parsed_skills
        validated_data['user'] = self.context['request'].user

        # If user has no existing resumes, make this primary
        if not Resume.objects.filter(user=self.context['request'].user).exists():
            validated_data['is_primary'] = True

        instance = super().create(validated_data)
        
        # Also sync detected skills to CandidateProfile if available
        try:
            profile = self.context['request'].user.candidate_profile
            existing_skills = set(profile.skills or [])
            combined = sorted(list(existing_skills.union(parsed_skills)))
            profile.skills = combined
            profile.save()
        except Exception:
            pass

        return instance

