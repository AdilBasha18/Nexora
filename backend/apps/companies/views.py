from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Company, RecruiterProfile, CompanyVerification
from .serializers import CompanySerializer, RecruiterProfileSerializer, CompanyVerificationSerializer
from accounts.permissions import IsRecruiter, IsPlatformAdmin

class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.AllowAny()]

class CompanyDetailView(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.AllowAny()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ['PUT', 'PATCH']:
            # Security fix (Issue #5): Enforce company ownership
            if request.user.is_platform_admin:
                return
            try:
                recruiter_profile = request.user.recruiter_profile
                if recruiter_profile.company_id != obj.id:
                    self.permission_denied(
                        request,
                        message="You do not have permission to modify another company's profile."
                    )
            except Exception:
                self.permission_denied(request, message="Recruiter profile not found.")

class RecruiterMyCompanyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get(self, request):
        try:
            profile = RecruiterProfile.objects.get(user=request.user)
            return Response(CompanySerializer(profile.company).data)
        except RecruiterProfile.DoesNotExist:
            return Response({"error": "Recruiter profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        try:
            profile = RecruiterProfile.objects.get(user=request.user)
            serializer = CompanySerializer(profile.company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RecruiterProfile.DoesNotExist:
            return Response({"error": "Recruiter profile not found."}, status=status.HTTP_404_NOT_FOUND)

class SubmitVerificationView(generics.CreateAPIView):
    serializer_class = CompanyVerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def perform_create(self, serializer):
        profile = RecruiterProfile.objects.get(user=self.request.user)
        verification = serializer.save(submitted_by=self.request.user, company=profile.company)
        try:
            from notifications.services import (
                notify_admin_company_verification_submitted,
                notify_recruiter_company_verification_submitted
            )
            notify_admin_company_verification_submitted(verification)
            notify_recruiter_company_verification_submitted(verification)
        except Exception as e:
            import logging
            logging.getLogger('companies').error(f"Error sending company verification emails: {e}")

