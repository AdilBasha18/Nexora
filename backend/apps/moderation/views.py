from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.utils import timezone
from .models import JobReport, AuditLog
from .serializers import JobReportSerializer, CreateJobReportSerializer, AuditLogSerializer
from companies.models import CompanyVerification, Company, RecruiterProfile
from companies.serializers import CompanyVerificationSerializer
from jobs.models import Job
from accounts.models import User
from assessments.models import AssessmentAttempt
from applications.models import JobApplication
from accounts.permissions import IsPlatformAdmin

class JobReportCreateListView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsPlatformAdmin()]

    def get(self, request):
        reports = JobReport.objects.select_related('job', 'job__company', 'reported_by').order_by('-created_at')
        return Response(JobReportSerializer(reports, many=True).data)

    def post(self, request):
        serializer = CreateJobReportSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save(reported_by=request.user)
            # Log audit
            AuditLog.objects.create(
                actor=request.user,
                action='SUBMITTED_JOB_REPORT',
                target_type='JobReport',
                target_id=report.id,
                details=f"Report filed for Job #{report.job.id} ({report.reason})"
            )
            return Response(JobReportSerializer(report).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobReportDetailUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def patch(self, request, pk):
        try:
            report = JobReport.objects.get(pk=pk)
        except JobReport.DoesNotExist:
            return Response({"error": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')

        if new_status:
            report.status = new_status
        if admin_notes:
            report.admin_notes = admin_notes
        report.reviewed_by = request.user
        report.save()

        # If investigated and found fraudulent, optionally suspend job
        action_job = request.data.get('suspend_job', False)
        if action_job:
            job = report.job
            job.status = Job.Status.CLOSED
            job.has_scam_warning = True
            job.scam_warning_reason = f"Suspended following moderation review: {admin_notes}"
            job.save()

        AuditLog.objects.create(
            actor=request.user,
            action=f"MODERATED_REPORT_{new_status}",
            target_type='JobReport',
            target_id=report.id,
            details=f"Status: {new_status}. Notes: {admin_notes}"
        )

        return Response(JobReportSerializer(report).data)

class AdminVerificationListView(generics.ListAPIView):
    serializer_class = CompanyVerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        return CompanyVerification.objects.select_related('company', 'submitted_by').order_by('-created_at')

class AdminVerificationActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            verification = CompanyVerification.objects.get(pk=pk)
        except CompanyVerification.DoesNotExist:
            return Response({"error": "Verification request not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'APPROVE' or 'REJECT'
        reviewer_notes = request.data.get('notes', '')

        if action == 'APPROVE':
            verification.status = CompanyVerification.Status.APPROVED
            verification.company.is_verified = True
            verification.company.save()
            # Mark company's recruiter as verified recruiter
            User.objects.filter(recruiter_profile__company=verification.company).update(is_verified_recruiter=True)
            # Mark all company's published jobs as verified
            Job.objects.filter(company=verification.company).update(is_verified=True)
        elif action == 'REJECT':
            verification.status = CompanyVerification.Status.REJECTED
        else:
            return Response({"error": "Invalid action. Choose 'APPROVE' or 'REJECT'."}, status=status.HTTP_400_BAD_REQUEST)

        verification.reviewer_notes = reviewer_notes
        verification.reviewed_by = request.user
        verification.reviewed_at = timezone.now()
        verification.save()

        AuditLog.objects.create(
            actor=request.user,
            action=f"VERIFICATION_{action}",
            target_type='Company',
            target_id=verification.company.id,
            details=f"Company {verification.company.name} verification {action.lower()}d. Notes: {reviewer_notes}"
        )

        return Response(CompanyVerificationSerializer(verification).data)

class AdminJobActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'TOGGLE_VERIFY', 'SUSPEND', 'ACTIVATE'

        if action == 'TOGGLE_VERIFY':
            job.is_verified = not job.is_verified
            job.save()
            action_desc = f"Job verified status changed to {job.is_verified}"
        elif action == 'SUSPEND':
            job.status = Job.Status.CLOSED
            job.has_scam_warning = True
            job.scam_warning_reason = request.data.get('reason', 'Suspended by admin moderation team.')
            job.save()
            action_desc = f"Job {job.title} suspended"
        elif action == 'ACTIVATE':
            job.status = Job.Status.PUBLISHED
            job.has_scam_warning = False
            job.scam_warning_reason = ""
            job.save()
            action_desc = f"Job {job.title} activated"
        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        AuditLog.objects.create(
            actor=request.user,
            action=f"ADMIN_JOB_{action}",
            target_type='Job',
            target_id=job.id,
            details=action_desc
        )

        return Response({"message": action_desc, "job_status": job.status, "is_verified": job.is_verified})

class AdminPlatformStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        return Response({
            "total_candidates": User.objects.filter(role=User.Role.CANDIDATE).count(),
            "total_recruiters": User.objects.filter(role=User.Role.RECRUITER).count(),
            "active_jobs": Job.objects.filter(status=Job.Status.PUBLISHED).count(),
            "pending_verifications": CompanyVerification.objects.filter(status=CompanyVerification.Status.PENDING).count(),
            "reported_jobs_pending": JobReport.objects.filter(status=JobReport.Status.PENDING).count(),
            "total_applications": JobApplication.objects.count(),
            "total_assessment_attempts": AssessmentAttempt.objects.count()
        })

class AdminAuditLogsView(generics.ListAPIView):
    queryset = AuditLog.objects.select_related('actor').all()[:50]
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

