from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'full_name', 'role', 'recruiter_status', 'recruiter_rejection_reason', 'is_verified_recruiter', 'is_suspended', 'created_at', 'updated_at']
        read_only_fields = ['id', 'role', 'recruiter_status', 'recruiter_rejection_reason', 'is_verified_recruiter', 'is_suspended', 'created_at', 'updated_at']

class CandidateRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirm_password']

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email'].lower().strip()
        with transaction.atomic():
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

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

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
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                full_name=validated_data['full_name'].strip(),
                password=validated_data['password'],
                role=User.Role.RECRUITER,
                recruiter_status=User.RecruiterStatus.PENDING,
                is_verified_recruiter=False
            )
            
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
        if getattr(user, 'is_suspended', False):
            raise serializers.ValidationError({"non_field_errors": ["Your account has been suspended by the platform administrator. Please contact support."]})
        
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

