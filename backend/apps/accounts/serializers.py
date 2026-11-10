from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'full_name', 'role', 'is_verified_recruiter', 'created_at', 'updated_at']
        read_only_fields = ['id', 'role', 'is_verified_recruiter', 'created_at', 'updated_at']

class CandidateRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email'].lower().strip()
        user = User.objects.create_user(
            username=email,
            email=email,
            full_name=validated_data['full_name'].strip(),
            password=validated_data['password'],
            role=User.Role.CANDIDATE
        )
        return user

class RecruiterRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField(write_only=True, max_length=255)
    company_website = serializers.URLField(write_only=True, required=False, allow_blank=True)
    job_title = serializers.CharField(write_only=True, max_length=150)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirm_password', 'company_name', 'company_website', 'job_title']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        company_name = validated_data.pop('company_name').strip()
        company_website = validated_data.pop('company_website', '').strip()
        job_title = validated_data.pop('job_title').strip()
        
        email = validated_data['email'].lower().strip()
        user = User.objects.create_user(
            username=email,
            email=email,
            full_name=validated_data['full_name'].strip(),
            password=validated_data['password'],
            role=User.Role.RECRUITER,
            is_verified_recruiter=False  # Requires admin approval or company verification
        )
        
        # Link or create company and recruiter profile
        from companies.models import Company, RecruiterProfile
        company, _ = Company.objects.get_or_create(
            name=company_name,
            defaults={'website': company_website}
        )
        RecruiterProfile.objects.create(
            user=user,
            company=company,
            job_title=job_title
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower().strip()
        password = attrs.get('password')
        
        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError({"non_field_errors": ["Invalid email or password."]})
        if not user.is_active:
            raise serializers.ValidationError({"non_field_errors": ["Account is deactivated."]})
        
        attrs['user'] = user
        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is not correct.")
        return value

