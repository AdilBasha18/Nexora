from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import JobReport, AuditLog
from .serializers import (
    JobReportSerializer, 
    CreateJobReportSerializer, 
    AuditLogSerializer,
    AdminRecruiterSerializer,
    AdminUserSerializer
)
from companies.models import CompanyVerification, Company, RecruiterProfile
from companies.serializers import CompanyVerificationSerializer
from jobs.models import Job
from jobs.serializers import JobSerializer
from accounts.models import User
from assessments.models import AssessmentAttempt
from applications.models import JobApplication
from notifications.models import Notification
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

            # Trigger automated security alert to admin inbox
            try:
                from notifications.services import notify_admin_job_reported
                notify_admin_job_reported(report)
            except Exception as e:
                import logging
                logging.getLogger('moderation').error(f"Error dispatching admin job report alert: {e}")

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

# ----------------------------------------------------
# CHUNK 3: Recruiter Verification Management
# ----------------------------------------------------
class AdminRecruiterListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        status_filter = request.query_params.get('status') # PENDING, APPROVED, REJECTED, SUSPENDED
        search = request.query_params.get('search', '').strip()

        qs = User.objects.filter(role=User.Role.RECRUITER).select_related('recruiter_profile', 'recruiter_profile__company').order_by('-created_at')

        if status_filter:
            qs = qs.filter(recruiter_status=status_filter)
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) |
                Q(email__icontains=search) |
                Q(recruiter_profile__company__name__icontains=search)
            )

        serializer = AdminRecruiterSerializer(qs, many=True)
        return Response(serializer.data)

class AdminRecruiterActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            recruiter = User.objects.get(pk=pk, role=User.Role.RECRUITER)
        except User.DoesNotExist:
            return Response({"error": "Recruiter account not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE'
        reason = request.data.get('reason', '').strip()

        if action == 'APPROVE':
            recruiter.recruiter_status = User.RecruiterStatus.APPROVED
            recruiter.is_verified_recruiter = True
            recruiter.is_suspended = False
            recruiter.recruiter_rejection_reason = ""
            recruiter.save()

            # Create notification for the recruiter
            Notification.objects.create(
                recipient=recruiter,
                title="Recruiter Account Approved! 🎉",
                message="Your recruiter registration has been verified and approved by the Nexora administrator team. You can now post jobs and review applicants.",
                link="/recruiter/dashboard"
            )
            action_desc = f"Recruiter {recruiter.email} approved"

        elif action == 'REJECT':
            recruiter.recruiter_status = User.RecruiterStatus.REJECTED
            recruiter.is_verified_recruiter = False
            recruiter.recruiter_rejection_reason = reason or "Documentation or corporate email verification requirements were not met."
            recruiter.save()

            Notification.objects.create(
                recipient=recruiter,
                title="Recruiter Registration Not Approved",
                message=f"Your recruiter application could not be approved at this time. Reason: {recruiter.recruiter_rejection_reason}",
                link="/recruiter/company"
            )
            action_desc = f"Recruiter {recruiter.email} rejected: {recruiter.recruiter_rejection_reason}"

        elif action == 'SUSPEND':
            recruiter.is_suspended = True
            recruiter.recruiter_status = User.RecruiterStatus.SUSPENDED
            recruiter.save()
            action_desc = f"Recruiter {recruiter.email} suspended"

        elif action == 'REACTIVATE':
            recruiter.is_suspended = False
            recruiter.recruiter_status = User.RecruiterStatus.APPROVED
            recruiter.save()
            action_desc = f"Recruiter {recruiter.email} reactivated"

        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        # Audit Log
        AuditLog.objects.create(
            actor=request.user,
            action=f"ADMIN_RECRUITER_{action}",
            target_type='User',
            target_id=recruiter.id,
            details=action_desc
        )

        # Trigger automated recruiter verification decision email
        if action in ['APPROVE', 'REJECT']:
            try:
                from notifications.services import notify_recruiter_account_decision
                notify_recruiter_account_decision(recruiter, action, reason)
            except Exception as email_err:
                import logging
                logging.getLogger('moderation').error(f"Error sending recruiter decision email: {email_err}")

        return Response({
            "message": action_desc,
            "recruiter_status": recruiter.recruiter_status,
            "is_suspended": recruiter.is_suspended
        })


# ----------------------------------------------------
# CHUNK 4 & 6: Job Moderation
# ----------------------------------------------------
class AdminJobListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        status_filter = request.query_params.get('status')
        search = request.query_params.get('search', '').strip()

        qs = Job.objects.select_related('company', 'recruiter').order_by('-created_at')

        if status_filter and status_filter != 'ALL':
            qs = qs.filter(status=status_filter)
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(company__name__icontains=search) |
                Q(recruiter__email__icontains=search)
            )

        serializer = JobSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

class AdminJobActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'APPROVE', 'REJECT', 'SUSPEND', 'TOGGLE_VERIFY'
        reason = request.data.get('reason', '').strip()

        if action == 'APPROVE':
            job.status = Job.Status.APPROVED
            job.has_scam_warning = False
            job.scam_warning_reason = ""
            job.rejection_reason = ""
            job.reviewed_by = request.user
            job.reviewed_at = timezone.now()
            job.save()

            Notification.objects.create(
                recipient=job.recruiter,
                title="Job Posting Approved! 🚀",
                message=f"Your job posting for '{job.title}' has been reviewed and approved by moderators. It is now live on the public job board.",
                link=f"/jobs/{job.id}"
            )
            action_desc = f"Job '{job.title}' approved"

        elif action == 'REJECT':
            job.status = Job.Status.REJECTED
            job.rejection_reason = reason or "Does not meet platform quality or transparency guidelines."
            job.reviewed_by = request.user
            job.reviewed_at = timezone.now()
            job.save()

            Notification.objects.create(
                recipient=job.recruiter,
                title="Job Posting Revision Needed",
                message=f"Your job posting for '{job.title}' was rejected. Feedback: {job.rejection_reason}",
                link="/recruiter/jobs"
            )
            action_desc = f"Job '{job.title}' rejected: {job.rejection_reason}"

        elif action == 'SUSPEND':
            job.status = Job.Status.SUSPENDED
            job.has_scam_warning = True
            job.scam_warning_reason = reason or 'Suspended by admin moderation team.'
            job.reviewed_by = request.user
            job.reviewed_at = timezone.now()
            job.save()

            Notification.objects.create(
                recipient=job.recruiter,
                title="Job Posting Suspended",
                message=f"Your job posting for '{job.title}' has been suspended. Reason: {job.scam_warning_reason}",
                link="/recruiter/jobs"
            )
            action_desc = f"Job '{job.title}' suspended"

        elif action == 'TOGGLE_VERIFY':
            job.is_verified = not job.is_verified
            job.save()
            action_desc = f"Job verified status changed to {job.is_verified}"

        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        AuditLog.objects.create(
            actor=request.user,
            action=f"ADMIN_JOB_{action}",
            target_type='Job',
            target_id=job.id,
            details=action_desc
        )

        # Trigger automated job approval/rejection decision email
        if action in ['APPROVE', 'REJECT']:
            try:
                from notifications.services import notify_recruiter_job_decision
                notify_recruiter_job_decision(job)
            except Exception as email_err:
                import logging
                logging.getLogger('moderation').error(f"Error sending job decision email: {email_err}")

        return Response({
            "message": action_desc,
            "job_status": job.status,
            "is_verified": job.is_verified,
            "rejection_reason": job.rejection_reason
        })


# ----------------------------------------------------
# CHUNK 6: User Management
# ----------------------------------------------------
class AdminUserListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        role_filter = request.query_params.get('role')
        status_filter = request.query_params.get('status') # active, suspended
        search = request.query_params.get('search', '').strip()

        qs = User.objects.all().order_by('-created_at')

        if role_filter:
            qs = qs.filter(role=role_filter)
        if status_filter == 'suspended':
            qs = qs.filter(is_suspended=True)
        elif status_filter == 'active':
            qs = qs.filter(is_suspended=False)

        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) |
                Q(email__icontains=search)
            )

        serializer = AdminUserSerializer(qs, many=True)
        return Response(serializer.data)

class AdminUserActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target_user.is_superuser or target_user == request.user:
            return Response({"error": "Cannot modify superuser or self account."}, status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get('action') # 'SUSPEND', 'REACTIVATE'

        if action == 'SUSPEND':
            target_user.is_suspended = True
            target_user.save()
            # Invalidate tokens
            try:
                target_user.auth_token.delete()
            except Exception:
                pass
            action_desc = f"User {target_user.email} suspended"

        elif action == 'REACTIVATE':
            target_user.is_suspended = False
            target_user.save()
            action_desc = f"User {target_user.email} reactivated"

        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        AuditLog.objects.create(
            actor=request.user,
            action=f"ADMIN_USER_{action}",
            target_type='User',
            target_id=target_user.id,
            details=action_desc
        )

        return Response({
            "message": action_desc,
            "is_suspended": target_user.is_suspended
        })


# ----------------------------------------------------
# CHUNK 6: Real Platform Stats & Audit Logs
# ----------------------------------------------------
class AdminPlatformStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        return Response({
            "total_candidates": User.objects.filter(role=User.Role.CANDIDATE).count(),
            "total_recruiters": User.objects.filter(role=User.Role.RECRUITER).count(),
            "pending_recruiters": User.objects.filter(role=User.Role.RECRUITER, recruiter_status=User.RecruiterStatus.PENDING).count(),
            "approved_recruiters": User.objects.filter(role=User.Role.RECRUITER, recruiter_status=User.RecruiterStatus.APPROVED).count(),
            "pending_jobs": Job.objects.filter(status=Job.Status.PENDING_REVIEW).count(),
            "approved_jobs": Job.objects.filter(status__in=[Job.Status.APPROVED, Job.Status.PUBLISHED]).count(),
            "rejected_jobs": Job.objects.filter(status=Job.Status.REJECTED).count(),
            "reported_jobs_pending": JobReport.objects.filter(status=JobReport.Status.PENDING).count(),
            "suspended_accounts": User.objects.filter(is_suspended=True).count(),
            "total_applications": JobApplication.objects.count(),
            "total_assessment_attempts": AssessmentAttempt.objects.count()
        })

class AdminAuditLogsView(generics.ListAPIView):
    queryset = AuditLog.objects.select_related('actor').all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    pagination_class = None

