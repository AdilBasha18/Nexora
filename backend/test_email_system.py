import os
import sys
import django

# Setup Django environment
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
sys.path.insert(0, os.path.join(backend_dir, 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from companies.models import Company
from jobs.models import Job
from applications.models import JobApplication
from notifications.models import EmailNotification
from notifications.services import (
    notify_candidate_application_submitted,
    notify_recruiter_application_received,
    notify_recruiter_job_submitted,
    notify_recruiter_job_decision,
    notify_recruiter_account_decision,
    notify_candidate_welcome,
    notify_recruiter_welcome,
    retry_failed_email
)

User = get_user_model()

def run_tests():
    print("=" * 60)
    print("     NEXORA AUTOMATED EMAIL NOTIFICATION SYSTEM TEST")
    print("=" * 60)

    # Delete existing test notification records so tests evaluate fresh SMTP execution
    EmailNotification.objects.filter(
        recipient_email__in=[
            'test.candidate@example.com', 'test.recruiter@example.com', 'test.admin@example.com',
            'delivered@resend.dev', 'delivered+recruiter@resend.dev', 'delivered+admin@resend.dev',
            'delivered+candidate@resend.dev', 'delivered+recruiter2@resend.dev'
        ]
    ).delete()
    candidate, _ = User.objects.get_or_create(
        username='testcandidate',
        defaults={'email': 'delivered@resend.dev', 'full_name': 'Sarah Jenkins', 'role': User.Role.CANDIDATE}
    )
    candidate.email = 'delivered@resend.dev'
    candidate.save()

    recruiter, _ = User.objects.get_or_create(
        username='testrecruiter',
        defaults={'email': 'delivered+recruiter@resend.dev', 'full_name': 'David Miller', 'role': User.Role.RECRUITER, 'recruiter_status': 'PENDING'}
    )
    recruiter.email = 'delivered+recruiter@resend.dev'
    recruiter.save()

    admin_user, _ = User.objects.get_or_create(
        username='testadmin',
        defaults={'email': 'delivered+admin@resend.dev', 'full_name': 'Platform Admin', 'role': User.Role.ADMIN, 'is_staff': True}
    )
    admin_user.email = 'delivered+admin@resend.dev'
    admin_user.save()

    company, _ = Company.objects.get_or_create(
        name='Apex Cloud Technologies',
        defaults={'website': 'https://apexcloud.example.com', 'is_verified': True}
    )

    job, _ = Job.objects.get_or_create(
        title='Senior Full Stack Engineer',
        company=company,
        recruiter=recruiter,
        defaults={
            'description': 'Building next-gen distributed systems with Python and React.',
            'status': Job.Status.PENDING_REVIEW,
            'work_mode': Job.WorkMode.REMOTE,
            'employment_type': Job.EmploymentType.FULL_TIME,
            'location': 'San Francisco, CA'
        }
    )
    job.recruiter = recruiter
    job.save()

    # 1. Recruiter submits a job
    print("\n[TEST 1] Recruiter Job Posting Submission Confirmation Email...")
    e1 = notify_recruiter_job_submitted(job)
    print(f"  -> Event: {e1.event_type}")
    print(f"  -> Recipient: {e1.recipient_email}")
    print(f"  -> Subject: {e1.subject}")
    print(f"  -> Status: {e1.status}")
    assert e1.recipient_email == recruiter.email
    assert "Your Job Posting Has Been Submitted" in e1.subject

    # 2. Admin approves a job
    print("\n[TEST 2] Admin Approves Job Posting Email...")
    job.status = Job.Status.APPROVED
    job.reviewed_at = timezone.now()
    job.reviewed_by = admin_user
    job.save()
    e2 = notify_recruiter_job_decision(job)
    print(f"  -> Event: {e2.event_type}")
    print(f"  -> Recipient: {e2.recipient_email}")
    print(f"  -> Subject: {e2.subject}")
    print(f"  -> Status: {e2.status}")
    assert e2.recipient_email == recruiter.email
    assert "Approved" in e2.subject

    # 3. Admin rejects a job
    print("\n[TEST 3] Admin Rejects Job Posting with Feedback Email...")
    job.status = Job.Status.REJECTED
    job.rejection_reason = "Missing salary range transparency and detailed job requirements."
    job.reviewed_at = timezone.now()
    job.save()
    e3 = notify_recruiter_job_decision(job)
    print(f"  -> Event: {e3.event_type}")
    print(f"  -> Recipient: {e3.recipient_email}")
    print(f"  -> Subject: {e3.subject}")
    print(f"  -> Status: {e3.status}")
    assert e3.recipient_email == recruiter.email
    assert "Update on Your Job Posting" in e3.subject
    assert "Missing salary range" in e3.body_html

    # Reset job to approved for applications
    job.status = Job.Status.APPROVED
    job.save()

    # 4. Candidate applies for job
    print("\n[TEST 4] Candidate Job Application Confirmation Email...")
    app, _ = JobApplication.objects.get_or_create(
        job=job,
        candidate=candidate,
        defaults={'status': JobApplication.Status.SUBMITTED, 'cover_letter': 'Excited about this opportunity!'}
    )
    app.candidate = candidate
    app.save()
    e4 = notify_candidate_application_submitted(app)
    print(f"  -> Event: {e4.event_type}")
    print(f"  -> Recipient: {e4.recipient_email}")
    print(f"  -> Subject: {e4.subject}")
    print(f"  -> Status: {e4.status}")
    assert e4.recipient_email == candidate.email
    assert "successfully submitted" in e4.subject.lower()
    assert job.title in e4.body_html
    assert company.name in e4.body_html

    # 5. Recruiter gets new application notification
    print("\n[TEST 5] Recruiter New Application Notification Email...")
    e5 = notify_recruiter_application_received(app)
    print(f"  -> Event: {e5.event_type}")
    print(f"  -> Recipient: {e5.recipient_email}")
    print(f"  -> Subject: {e5.subject}")
    print(f"  -> Status: {e5.status}")
    assert e5.recipient_email == recruiter.email
    assert "New Candidate Application Received" in e5.subject
    assert candidate.email in e5.body_html

    # 6. Admin approves recruiter account
    print("\n[TEST 6] Admin Approves Recruiter Account Email...")
    recruiter.recruiter_status = 'APPROVED'
    recruiter.is_verified_recruiter = True
    recruiter.save()
    e6 = notify_recruiter_account_decision(recruiter, 'APPROVE')
    print(f"  -> Event: {e6.event_type}")
    print(f"  -> Recipient: {e6.recipient_email}")
    print(f"  -> Subject: {e6.subject}")
    print(f"  -> Status: {e6.status}")
    assert e6.recipient_email == recruiter.email
    assert "Your Recruiter Account Has Been Approved" in e6.subject

    # 7. Admin rejects recruiter account
    print("\n[TEST 7] Admin Rejects Recruiter Account Email...")
    recruiter.recruiter_status = 'REJECTED'
    recruiter.is_verified_recruiter = False
    recruiter.recruiter_rejection_reason = "Official company domain email required."
    recruiter.save()
    e7 = notify_recruiter_account_decision(recruiter, 'REJECT', recruiter.recruiter_rejection_reason)
    print(f"  -> Event: {e7.event_type}")
    print(f"  -> Recipient: {e7.recipient_email}")
    print(f"  -> Subject: {e7.subject}")
    print(f"  -> Status: {e7.status}")
    assert e7.recipient_email == recruiter.email
    assert "Update on Your Nexora Recruiter Verification" in e7.subject
    assert "Official company domain email required" in e7.body_html

    # 8. Deduplication / Idempotency Test
    print("\n[TEST 8] Deduplication / Idempotency Test...")
    total_before = EmailNotification.objects.filter(idempotency_key=f"candidate_app_{app.id}").count()
    # Trigger again
    notify_candidate_application_submitted(app)
    total_after = EmailNotification.objects.filter(idempotency_key=f"candidate_app_{app.id}").count()
    print(f"  -> Records before: {total_before}, Records after repeat trigger: {total_after}")
    assert total_before == total_after == 1
    print("  -> PASS: Duplicate email prevented by idempotency key!")

    # 9. Retry Failed Email Test
    print("\n[TEST 9] Safe Retry Mechanism Test...")
    failed_notif = EmailNotification.objects.create(
        recipient_email="delivered@resend.dev",
        subject="Test Retry Email",
        body_html="<p>Test retry</p>",
        body_text="Test retry",
        event_type=EmailNotification.EventType.TEST_EMAIL,
        idempotency_key=f"retry_test_{timezone.now().timestamp()}",
        status=EmailNotification.DeliveryStatus.FAILED,
        error_message="Simulated connection failure"
    )
    print(f"  -> Created failed email [{failed_notif.id}], initial status: {failed_notif.status}")
    # Retry (in test environment with console or smtp)
    retry_failed_email(failed_notif.id)
    failed_notif.refresh_from_db()
    print(f"  -> After retry: retry_count={failed_notif.retry_count}, status={failed_notif.status}")
    assert failed_notif.retry_count == 1
    print("  -> PASS: Retry mechanism updated state correctly!")

    # 10. Candidate Welcome Email Test
    print("\n[TEST 10] Candidate Registration Welcome Email Test...")
    new_candidate, _ = User.objects.get_or_create(
        username='newcand',
        defaults={'email': 'delivered+candidate@resend.dev', 'full_name': 'Alex Rivera', 'role': User.Role.CANDIDATE}
    )
    new_candidate.email = 'delivered+candidate@resend.dev'
    new_candidate.save()
    e10 = notify_candidate_welcome(new_candidate)
    print(f"  -> Event: {e10.event_type}")
    print(f"  -> Recipient: {e10.recipient_email}")
    print(f"  -> Subject: {e10.subject}")
    print(f"  -> Status: {e10.status}")
    assert e10.recipient_email == new_candidate.email
    assert e10.event_type == EmailNotification.EventType.CANDIDATE_WELCOME
    assert "Welcome to Nexora – Your Career Journey Starts Here!" == e10.subject
    assert "Career GPS" in e10.body_html
    assert "Skill Assessments" in e10.body_html
    assert "ATS Resume Checker" in e10.body_html
    assert "AI Career Assistant" in e10.body_html
    assert "Explore Your Dashboard" in e10.body_html
    print("  -> PASS: Candidate welcome email verified with all required platform features and CTA!")

    # 11. Recruiter Welcome Email Test
    print("\n[TEST 11] Recruiter Registration Welcome Email Test...")
    new_recruiter, _ = User.objects.get_or_create(
        username='newrecruiter2',
        defaults={'email': 'delivered+recruiter2@resend.dev', 'full_name': 'Eleanor Vance', 'role': User.Role.RECRUITER, 'recruiter_status': 'PENDING'}
    )
    new_recruiter.email = 'delivered+recruiter2@resend.dev'
    new_recruiter.save()
    e11 = notify_recruiter_welcome(new_recruiter, company_name="Quantum Leap AI")
    print(f"  -> Event: {e11.event_type}")
    print(f"  -> Recipient: {e11.recipient_email}")
    print(f"  -> Subject: {e11.subject}")
    print(f"  -> Status: {e11.status}")
    assert e11.recipient_email == new_recruiter.email
    assert e11.event_type == EmailNotification.EventType.RECRUITER_WELCOME
    assert "Welcome to Nexora – Your Recruiter Registration Is Received!" == e11.subject
    assert "Pending Admin Approval" in e11.body_html
    assert "Quantum Leap AI" in e11.body_html
    assert "View Recruiter Dashboard" in e11.body_html
    print("  -> PASS: Recruiter welcome email verified with pending approval notice and CTA!")

    print("\n" + "=" * 60)
    print("     ALL 11 EMAIL NOTIFICATION SCENARIOS PASSED 100%!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
