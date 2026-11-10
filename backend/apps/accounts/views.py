from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import (
    UserSerializer, 
    CandidateRegisterSerializer, 
    RecruiterRegisterSerializer, 
    LoginSerializer,
    ChangePasswordSerializer
)

class CandidateRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            # Create CandidateProfile automatically
            from candidates.models import CandidateProfile
            CandidateProfile.objects.get_or_create(user=user)

            return Response({
                "message": "Candidate account created successfully.",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecruiterRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RecruiterRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Recruiter account registered. Pending admin verification.",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            
            # Additional role context
            extra_data = {}
            if user.is_recruiter:
                try:
                    from companies.models import RecruiterProfile
                    recruiter_profile = RecruiterProfile.objects.get(user=user)
                    extra_data['company_name'] = recruiter_profile.company.name
                    extra_data['company_id'] = recruiter_profile.company.id
                    extra_data['is_company_verified'] = recruiter_profile.company.is_verified
                except Exception:
                    pass

            return Response({
                "token": token.key,
                "user": user_data,
                **extra_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

class UserProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.is_recruiter:
            try:
                from companies.models import RecruiterProfile
                profile = RecruiterProfile.objects.get(user=user)
                data['company'] = {
                    'id': profile.company.id,
                    'name': profile.company.name,
                    'website': profile.company.website,
                    'is_verified': profile.company.is_verified
                }
                data['job_title'] = profile.job_title
            except Exception:
                pass
        return Response(data)

    def patch(self, request):
        user = request.user
        full_name = request.data.get('full_name')
        if full_name:
            user.full_name = full_name.strip()
            user.save()
        return Response(UserSerializer(user).data)

class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

