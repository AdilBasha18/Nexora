from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from .models import JobApplication, ApplicationStatusHistory
from .serializers import (
    CandidateApplicationSerializer, 
    RecruiterApplicationSerializer, 
    ApplyJobRequestSerializer
)
from jobs.models import Job
from resumes.models import Resume
from notifications.models import Notification
from accounts.permissions import IsCandidate, IsRecruiter

class ApplyJobView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = ApplyJobRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        job_id = serializer.validated_data['job_id']
        resume_id = serializer.validated_data.get('resume_id')
        cover_letter = serializer.validated_data.get('cover_letter', '')

        try:
            job = Job.objects.get(id=job_id, status__in=[Job.Status.APPROVED, Job.Status.PUBLISHED], has_scam_warning=False)
        except Job.DoesNotExist:
            return Response({"error": "Job listing not found, pending review, or is closed."}, status=status.HTTP_404_NOT_FOUND)

        if JobApplication.objects.filter(job=job, candidate=request.user).exists():
            return Response({"error": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)

        resume = None
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
            except Resume.DoesNotExist:
                return Response({"error": "Selected resume not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            resume = Resume.objects.filter(user=request.user, is_primary=True).first()

        application = JobApplication.objects.create(
            job=job,
            candidate=request.user,
            resume=resume,
            cover_letter=cover_letter,
            status=JobApplication.Status.SUBMITTED
        )

        ApplicationStatusHistory.objects.create(
            application=application,
            from_status='NONE',
            to_status=JobApplication.Status.SUBMITTED,
            changed_by=request.user,
            notes='Application submitted by candidate.'
        )

        # Notify recruiter
        Notification.objects.create(
            recipient=job.recruiter,
            title=f"New Applicant for {job.title}",
            message=f"{request.user.full_name} has applied for '{job.title}'.",
            notification_type=Notification.NotificationType.APPLICATION_UPDATE,
            link=f"/recruiter/applicants?job={job.id}"
        )

        # Notify candidate (In-app)
        Notification.objects.create(
            recipient=request.user,
            title="Application Submitted",
            message=f"Your application for '{job.title}' at {job.company.name} was successfully submitted.",
            notification_type=Notification.NotificationType.APPLICATION_UPDATE,
            link="/candidate/applications"
        )

        # Trigger Automated Transactional Emails
        try:
            from notifications.services import (
                notify_candidate_application_submitted,
                notify_recruiter_application_received
            )
            notify_candidate_application_submitted(application)
            notify_recruiter_application_received(application)
        except Exception as email_err:
            import logging
            logging.getLogger('applications').error(f"Error triggering application emails: {email_err}")

        return Response(CandidateApplicationSerializer(application).data, status=status.HTTP_201_CREATED)

class CandidateApplicationListView(generics.ListAPIView):
    serializer_class = CandidateApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return JobApplication.objects.filter(candidate=self.request.user).select_related('job', 'job__company', 'resume').order_by('-applied_at')

class CandidateWithdrawApplicationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request, pk):
        try:
            app = JobApplication.objects.get(pk=pk, candidate=request.user)
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        if app.status in [JobApplication.Status.OFFERED, JobApplication.Status.WITHDRAWN]:
            return Response({"error": f"Cannot withdraw application in '{app.status}' status."}, status=status.HTTP_400_BAD_REQUEST)

        prev_status = app.status
        app.status = JobApplication.Status.WITHDRAWN
        app.save()

        ApplicationStatusHistory.objects.create(
            application=app,
            from_status=prev_status,
            to_status=JobApplication.Status.WITHDRAWN,
            changed_by=request.user,
            notes='Withdrawn by candidate.'
        )

        return Response({"message": "Application withdrawn successfully."})

class RecruiterApplicationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get(self, request):
        job_id = request.query_params.get('job_id')
        status_filter = request.query_params.get('status')

        qs = JobApplication.objects.filter(job__recruiter=request.user).select_related(
            'job', 'candidate', 'resume', 'candidate__candidate_profile'
        ).order_by('-applied_at')

        if job_id:
            qs = qs.filter(job_id=job_id)
        if status_filter:
            qs = qs.filter(status=status_filter)

        return Response(RecruiterApplicationSerializer(qs, many=True).data)

class RecruiterApplicationUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def patch(self, request, pk):
        try:
            app = JobApplication.objects.get(pk=pk, job__recruiter=request.user)
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        recruiter_notes = request.data.get('recruiter_notes')
        interview_date = request.data.get('interview_date')
        interview_location_or_link = request.data.get('interview_location_or_link')
        interview_notes = request.data.get('interview_notes')

        prev_status = app.status
        prev_interview_date = app.interview_date

        if recruiter_notes is not None:
            app.recruiter_notes = recruiter_notes
        if interview_date is not None:
            app.interview_date = interview_date or None
        if interview_location_or_link is not None:
            app.interview_location_or_link = interview_location_or_link
        if interview_notes is not None:
            app.interview_notes = interview_notes

        # Validate status if provided
        if new_status and new_status != prev_status:
            if new_status not in JobApplication.Status.values:
                return Response(
                    {"error": f"Invalid status '{new_status}'. Allowed: {JobApplication.Status.values}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            app.status = new_status
            ApplicationStatusHistory.objects.create(
                application=app,
                from_status=prev_status,
                to_status=new_status,
                changed_by=request.user,
                notes=request.data.get('status_note', f"Status changed to {new_status}")
            )
            # Notify candidate of status update
            Notification.objects.create(
                recipient=app.candidate,
                title=f"Application Update: {app.job.title}",
                message=f"Your application status for '{app.job.title}' at {app.job.company.name} is now: {app.get_status_display()}.",
                notification_type=Notification.NotificationType.APPLICATION_UPDATE,
                link="/candidate/applications"
            )

            # Trigger automated candidate status email notification
            try:
                from notifications.services import notify_candidate_status_update
                note_text = request.data.get('status_note', '')
                notify_candidate_status_update(app, new_status, note_text)
            except Exception as email_err:
                import logging
                logging.getLogger('applications').error(f"Error sending candidate status email: {email_err}")

        # Notify candidate if interview was scheduled or updated
        if interview_date and str(interview_date) != str(prev_interview_date):
            Notification.objects.create(
                recipient=app.candidate,
                title=f"Interview Scheduled: {app.job.title}",
                message=f"An interview for '{app.job.title}' has been scheduled for {interview_date}.",
                notification_type=Notification.NotificationType.APPLICATION_UPDATE,
                link="/candidate/applications"
            )

            try:
                from notifications.services import notify_candidate_interview_invitation
                notify_candidate_interview_invitation(
                    application=app,
                    interview_date=interview_date,
                    location_or_link=app.interview_location_or_link,
                    notes=app.interview_notes
                )
            except Exception as email_err:
                import logging
                logging.getLogger('applications').error(f"Error sending interview invitation email: {email_err}")

        app.save()
        return Response(RecruiterApplicationSerializer(app).data)

