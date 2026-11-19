import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.utils import timezone
from .models import EmailNotification

logger = logging.getLogger('notifications.email')

def get_frontend_url():
    return getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')

def build_nexora_email_html(
    title: str,
    preheader: str,
    greeting: str,
    paragraphs: list,
    details: list = None,
    cta_text: str = None,
    cta_url: str = None,
    badge_text: str = None,
    badge_color: str = "#2563eb",
    footer_note: str = None
) -> str:
    """
    Renders a responsive, modern HTML email matching Nexora's brand aesthetic:
    - Elegant dark header with Nexora gradient logo badge
    - Clean white content surface with clear typography
    - Structured key-value details table
    - Vibrant primary action button
    - Professional footer with support links and compliance info
    """
    details_html = ""
    if details:
        rows = ""
        for item in details:
            label = item.get("label", "")
            value = item.get("value", "")
            highlight = item.get("highlight", False)
            val_style = "font-weight: 700; color: #1e1b4b;" if highlight else "color: #334155;"
            rows += f"""
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 38%;">{label}</td>
              <td style="padding: 10px 14px; font-size: 13px; {val_style} border-bottom: 1px solid #f1f5f9;">{value}</td>
            </tr>
            """
        details_html = f"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 22px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-collapse: separate; overflow: hidden;">
          {rows}
        </table>
        """

    badge_html = ""
    if badge_text:
        badge_html = f"""
        <div style="margin-bottom: 14px;">
          <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background-color: {badge_color}15; color: {badge_color}; border: 1px solid {badge_color}35;">
            {badge_text}
          </span>
        </div>
        """

    cta_html = ""
    if cta_text and cta_url:
        cta_html = f"""
        <div style="text-align: center; margin: 30px 0 10px 0;">
          <a href="{cta_url}" target="_blank" style="display: inline-block; padding: 13px 32px; border-radius: 10px; background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); letter-spacing: 0.02em;">
            {cta_text} &rarr;
          </a>
        </div>
        <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 8px;">
          Or visit directly: <a href="{cta_url}" style="color: #2563eb; text-decoration: underline;">{cta_url}</a>
        </p>
        """

    body_paragraphs = ""
    for p in paragraphs:
        body_paragraphs += f'<p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.65; color: #334155;">{p}</p>'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preview Text -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    {preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        
        <!-- Email Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #090b14 0%, #171a29 100%); padding: 26px 36px; border-bottom: 2px solid #2563eb;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display: inline-flex; align-items: center;">
                      <div style="width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); display: inline-block; vertical-align: middle; text-align: center; line-height: 32px; color: #ffffff; font-weight: 800; font-size: 16px; margin-right: 10px;">
                        N
                      </div>
                      <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; vertical-align: middle;">
                        Nex<span style="color: #2dd4bf;">ora</span>
                      </span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em;">
                      Career Platform
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 34px 36px;">
              {badge_html}
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">
                {title}
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #1e293b;">
                {greeting}
              </p>

              {body_paragraphs}

              {details_html}

              {cta_html}

              {f'<p style="margin: 22px 0 0 0; font-size: 12px; line-height: 1.5; color: #64748b; background-color: #f8fafc; padding: 12px 14px; border-radius: 8px; border-left: 3px solid #2563eb;">{footer_note}</p>' if footer_note else ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                Questions or need assistance? Reach out to our team at
                <a href="mailto:nexora.officalss@gmail.com" style="color: #2563eb; text-decoration: underline; font-weight: 600;">nexora.officalss@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; {timezone.now().year} Nexora Technologies Inc. All rights reserved. &bull; Verified Careers & Fair Hiring
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>"""
    return html


def send_email_notification(
    recipient_email: str,
    subject: str,
    body_html: str,
    body_text: str,
    event_type: str,
    idempotency_key: str,
    recipient_user=None,
    sender_name: str = "Nexora Team",
    reply_to: list = None
) -> EmailNotification:
    """
    Central email dispatch engine:
    1. Enforces idempotency to completely prevent duplicate emails.
    2. Records the transaction in EmailNotification model with timestamp and delivery status.
    3. Sends multipart email (HTML + Plain text) using single official sender nexora.officalss@gmail.com.
    4. Logs detailed errors if SMTP fails, enabling safe automated retries.
    """
    # Check for existing notification with this idempotency key
    existing = EmailNotification.objects.filter(idempotency_key=idempotency_key).first()
    if existing:
        if existing.status == EmailNotification.DeliveryStatus.SENT:
            logger.info(f"Duplicate email suppressed for idempotency_key '{idempotency_key}' (already sent at {existing.sent_at}).")
            return existing
        notification = existing
    else:
        notification = EmailNotification(
            recipient_email=recipient_email,
            recipient_user=recipient_user,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=event_type,
            idempotency_key=idempotency_key,
            status=EmailNotification.DeliveryStatus.PENDING
        )
        notification.save()

    official_address = "nexora.officalss@gmail.com"
    clean_sender = sender_name or "Nexora Team"
    from_email = f"{clean_sender} <{official_address}>"

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=body_text or subject,
            from_email=from_email,
            to=[recipient_email],
            reply_to=reply_to or [official_address]
        )
        msg.attach_alternative(body_html, "text/html")
        msg.send(fail_silently=False)

        notification.status = EmailNotification.DeliveryStatus.SENT
        notification.sent_at = timezone.now()
        notification.error_message = None
        notification.save(update_fields=['status', 'sent_at', 'error_message'])
        logger.info(f"Successfully sent email [{notification.id}] ({event_type}) from '{from_email}' to {recipient_email}")

    except Exception as e:
        err_msg = str(e)
        logger.error(f"Failed to send email [{notification.id}] ({event_type}) to {recipient_email}: {err_msg}")
        notification.status = EmailNotification.DeliveryStatus.FAILED
        notification.error_message = err_msg
        notification.save(update_fields=['status', 'error_message'])

    return notification


def retry_failed_email(notification_id: int) -> bool:
    """
    Safely retries a failed email notification without creating duplicates.
    """
    try:
        notification = EmailNotification.objects.get(id=notification_id)
        if notification.status == EmailNotification.DeliveryStatus.SENT:
            return True

        notification.retry_count += 1
        notification.save(update_fields=['retry_count'])

        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Nexora <notifications@nexora.com>')
        msg = EmailMultiAlternatives(
            subject=notification.subject,
            body=notification.body_text or notification.subject,
            from_email=from_email,
            to=[notification.recipient_email]
        )
        msg.attach_alternative(notification.body_html, "text/html")
        msg.send(fail_silently=False)

        notification.status = EmailNotification.DeliveryStatus.SENT
        notification.sent_at = timezone.now()
        notification.error_message = None
        notification.save(update_fields=['status', 'sent_at', 'error_message'])
        logger.info(f"Retry succeeded for email [{notification.id}] to {notification.recipient_email}")
        return True

    except Exception as e:
        err_msg = str(e)
        logger.error(f"Retry failed for email [{notification_id}]: {err_msg}")
        if 'notification' in locals():
            notification.error_message = f"Retry {notification.retry_count} failed: {err_msg}"
            notification.save(update_fields=['error_message'])
        return False


# =========================================================================
# HIGH-LEVEL TRANSACTIONAL EMAIL NOTIFIERS
# =========================================================================

def notify_candidate_application_submitted(application):
    """
    1. Candidate - Job Application Confirmation
    Sent whenever candidate successfully applies for a job.
    """
    candidate = application.candidate
    job = application.job
    company = job.company
    app_date = application.applied_at.strftime('%B %d, %Y at %I:%M %p')
    frontend_url = get_frontend_url()
    my_apps_url = f"{frontend_url}/candidate/applications"

    subject = "Your application has been successfully submitted – Nexora"
    preheader = f"Application confirmed for {job.title} at {company.name}"
    greeting = f"Hi {candidate.full_name or 'there'},"
    
    paragraphs = [
        f"Thank you for applying through Nexora. Your application for <strong>{job.title}</strong> at <strong>{company.name}</strong> has been successfully received by the hiring team.",
        "The recruiter has been notified and will review your profile and credentials. You can monitor the real-time status of your candidacy, review audit logs, and schedule interviews directly in your candidate workspace."
    ]

    details = [
        {"label": "Candidate Name", "value": candidate.full_name or candidate.email},
        {"label": "Job Title", "value": job.title, "highlight": True},
        {"label": "Company Name", "value": company.name},
        {"label": "Application Date", "value": app_date},
        {"label": "Initial Status", "value": "SUBMITTED"}
    ]

    body_html = build_nexora_email_html(
        title="Application Successfully Submitted",
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text="View My Applications",
        cta_url=my_apps_url,
        badge_text="Application Confirmed",
        badge_color="#14b8a6",
        footer_note="Nexora ensures fair, verified recruitment. Never pay any fees or deposit funds for employment opportunities."
    )

    body_text = f"""Hi {candidate.full_name or 'there'},

Your application for {job.title} at {company.name} has been successfully submitted on {app_date}.

Candidate: {candidate.full_name}
Job Title: {job.title}
Company: {company.name}
Status: SUBMITTED

View your application status anytime at: {my_apps_url}

Best regards,
The Nexora Team
"""

    idempotency_key = f"candidate_app_{application.id}"
    return send_email_notification(
        recipient_email=candidate.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.CANDIDATE_APPLICATION_CONFIRMATION,
        idempotency_key=idempotency_key,
        recipient_user=candidate
    )


def notify_recruiter_application_received(application):
    """
    2. Recruiter - New Application Notification
    Sent to the specific recruiter who owns the job.
    """
    candidate = application.candidate
    job = application.job
    company = job.company
    recruiter = job.recruiter
    app_date = application.applied_at.strftime('%B %d, %Y at %I:%M %p')
    frontend_url = get_frontend_url()
    recruiter_apps_url = f"{frontend_url}/recruiter/applicants?job={job.id}"

    subject = "New Candidate Application Received – Nexora"
    preheader = f"New applicant: {candidate.full_name or candidate.email} for {job.title}"
    greeting = f"Hello {recruiter.full_name or 'Hiring Manager'},"

    paragraphs = [
        f"A new candidate has just submitted their application for your job listing <strong>{job.title}</strong> at <strong>{company.name}</strong>.",
        "Candidate credentials, verified skill score, and resume details are now available for review in your Recruiter Dashboard."
    ]

    details = [
        {"label": "Candidate Name", "value": candidate.full_name or "Nexora Candidate", "highlight": True},
        {"label": "Candidate Email", "value": candidate.email},
        {"label": "Job Title", "value": job.title},
        {"label": "Company Name", "value": company.name},
        {"label": "Applied At", "value": app_date}
    ]

    body_html = build_nexora_email_html(
        title="New Candidate Application Received",
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text="Review Application in Dashboard",
        cta_url=recruiter_apps_url,
        badge_text="New Applicant",
        badge_color="#3b82f6",
        footer_note="Candidate details are confidential and shared solely for the purpose of candidate evaluation for this job posting."
    )

    body_text = f"""Hello {recruiter.full_name or 'Hiring Manager'},

A new candidate has applied for {job.title} at {company.name}.

Candidate Name: {candidate.full_name or 'Nexora Candidate'}
Candidate Email: {candidate.email}
Job Title: {job.title}
Company: {company.name}
Applied On: {app_date}

Review the application and resume in your dashboard: {recruiter_apps_url}

Best regards,
Nexora Recruiter Platform
"""

    idempotency_key = f"recruiter_app_{application.id}"
    return send_email_notification(
        recipient_email=recruiter.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.RECRUITER_APPLICATION_RECEIVED,
        idempotency_key=idempotency_key,
        recipient_user=recruiter
    )


def notify_recruiter_job_submitted(job):
    """
    3. Recruiter - Job Posting Confirmation
    Sent when a recruiter submits a job posting awaiting admin review.
    """
    recruiter = job.recruiter
    company = job.company
    sub_date = job.created_at.strftime('%B %d, %Y at %I:%M %p')
    frontend_url = get_frontend_url()
    manage_jobs_url = f"{frontend_url}/recruiter/jobs"

    subject = "Your Job Posting Has Been Submitted – Nexora"
    preheader = f"Job '{job.title}' submitted and awaiting admin approval"
    greeting = f"Hello {recruiter.full_name or 'Hiring Partner'},"

    paragraphs = [
        f"Your job posting for <strong>{job.title}</strong> has been successfully submitted on Nexora.",
        "To ensure high standards and protect both employers and job seekers, all new listings undergo automated quality checks and administrator verification. Your listing is currently <strong>awaiting admin approval</strong>.",
        "You will receive an email notification as soon as our moderation team completes the review."
    ]

    details = [
        {"label": "Job Title", "value": job.title, "highlight": True},
        {"label": "Company Name", "value": company.name},
        {"label": "Submission Date", "value": sub_date},
        {"label": "Current Status", "value": "Awaiting Admin Approval (PENDING)"}
    ]

    body_html = build_nexora_email_html(
        title="Job Posting Submitted",
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text="Manage Job Listings",
        cta_url=manage_jobs_url,
        badge_text="Pending Review",
        badge_color="#f59e0b",
        footer_note="Moderation usually completes within 1-4 business hours. Approved jobs immediately appear on the public job board and candidate matching engine."
    )

    body_text = f"""Hello {recruiter.full_name or 'Hiring Partner'},

Your job posting for '{job.title}' at {company.name} has been submitted successfully on {sub_date}.

Job Title: {job.title}
Company: {company.name}
Status: Awaiting Admin Approval

Our administrator team will review your posting shortly. You can manage your listings at: {manage_jobs_url}

Best regards,
Nexora Employer Solutions
"""

    idempotency_key = f"recruiter_job_submit_{job.id}"
    return send_email_notification(
        recipient_email=recruiter.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.RECRUITER_JOB_SUBMITTED,
        idempotency_key=idempotency_key,
        recipient_user=recruiter
    )


def notify_recruiter_job_decision(job):
    """
    3b. Admin approves or rejects job posting.
    """
    recruiter = job.recruiter
    company = job.company
    frontend_url = get_frontend_url()
    is_approved = (job.status == 'APPROVED')

    if is_approved:
        subject = "Your Job Posting Has Been Approved – Nexora"
        preheader = f"Job '{job.title}' is now live on Nexora"
        title = "Job Posting Approved! 🚀"
        badge_text = "Approved & Live"
        badge_color = "#10b981"
        cta_text = "View Public Job Listing"
        cta_url = f"{frontend_url}/jobs/{job.id}"
        paragraphs = [
            f"Great news! Your job posting for <strong>{job.title}</strong> at <strong>{company.name}</strong> has been reviewed and approved by the Nexora moderation team.",
            "The listing is now publicly visible on the Nexora Job Board, and candidates matching your requirements will begin receiving recommendations."
        ]
        details = [
            {"label": "Job Title", "value": job.title, "highlight": True},
            {"label": "Company", "value": company.name},
            {"label": "Status", "value": "LIVE & APPROVED"},
            {"label": "Review Date", "value": timezone.now().strftime('%B %d, %Y')}
        ]
        event_type = EmailNotification.EventType.RECRUITER_JOB_APPROVED
    else:
        subject = "Update on Your Job Posting – Nexora"
        preheader = f"Review update for job '{job.title}'"
        title = "Job Posting Revision Needed"
        badge_text = "Revision Needed"
        badge_color = "#ef4444"
        cta_text = "Edit & Resubmit Job"
        cta_url = f"{frontend_url}/recruiter/jobs"
        reason = getattr(job, 'rejection_reason', '') or "Does not meet platform quality or transparency guidelines."
        paragraphs = [
            f"Thank you for submitting <strong>{job.title}</strong> at <strong>{company.name}</strong>.",
            "Following review, our moderation team could not publish the listing in its current form.",
            f"<strong>Reviewer Feedback:</strong> <em>{reason}</em>",
            "Please update the posting in your recruiter workspace to address the feedback. You can resubmit anytime for quick re-evaluation."
        ]
        details = [
            {"label": "Job Title", "value": job.title, "highlight": True},
            {"label": "Company", "value": company.name},
            {"label": "Status", "value": "NOT APPROVED"},
            {"label": "Reason", "value": reason}
        ]
        event_type = EmailNotification.EventType.RECRUITER_JOB_REJECTED

    greeting = f"Hello {recruiter.full_name or 'Hiring Partner'},"
    body_html = build_nexora_email_html(
        title=title,
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text=cta_text,
        cta_url=cta_url,
        badge_text=badge_text,
        badge_color=badge_color,
        footer_note="Nexora maintains a verified job ecosystem to eliminate ghost jobs and protect employer brand authenticity."
    )

    body_text = f"""Hello {recruiter.full_name or 'Hiring Partner'},

{subject}

Job Title: {job.title}
Company: {company.name}
Status: {job.status}
{"Feedback: " + getattr(job, 'rejection_reason', '') if not is_approved else ""}

View your listing or make changes: {cta_url}

Best regards,
Nexora Moderation Team
"""

    reviewed_ts = int(job.reviewed_at.timestamp()) if getattr(job, 'reviewed_at', None) else int(timezone.now().timestamp())
    idempotency_key = f"admin_job_decision_{job.id}_{job.status}_{reviewed_ts}"
    return send_email_notification(
        recipient_email=recruiter.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=event_type,
        idempotency_key=idempotency_key,
        recipient_user=recruiter
    )


def notify_recruiter_account_decision(recruiter, action: str, reason: str = ""):
    """
    4. Recruiter - Account Approval / Rejection Notification
    Sent after admin approves or rejects the recruiter's account verification.
    """
    frontend_url = get_frontend_url()
    is_approved = (action == 'APPROVE')

    if is_approved:
        subject = "Your Recruiter Account Has Been Approved – Nexora"
        preheader = "Your Nexora Recruiter verification is complete!"
        title = "Recruiter Account Approved! 🎉"
        badge_text = "Verified Employer"
        badge_color = "#10b981"
        cta_text = "Access Recruiter Dashboard"
        cta_url = f"{frontend_url}/recruiter/dashboard"
        paragraphs = [
            "We are pleased to inform you that your recruiter account has been verified and approved by the Nexora administrator team.",
            "You now have full access to approved employer features: publish job postings, review verified candidate applications, schedule interviews, and search verified talent."
        ]
        details = [
            {"label": "Account Email", "value": recruiter.email},
            {"label": "Account Name", "value": recruiter.full_name or "Recruiter"},
            {"label": "Verification Status", "value": "APPROVED & ACTIVE", "highlight": True},
            {"label": "Approval Date", "value": timezone.now().strftime('%B %d, %Y')}
        ]
        event_type = EmailNotification.EventType.RECRUITER_ACCOUNT_APPROVED
        footer_note = "Your verified employer badge is now visible to candidates, boosting applicant trust and engagement."
    else:
        subject = "Update on Your Nexora Recruiter Verification"
        preheader = "Notice regarding your Nexora recruiter verification"
        title = "Recruiter Verification Update"
        badge_text = "Verification Unsuccessful"
        badge_color = "#ef4444"
        cta_text = "Contact Support / Update Profile"
        cta_url = f"{frontend_url}/about"
        rejection_reason = reason or getattr(recruiter, 'recruiter_rejection_reason', '') or "Corporate email or organizational documentation requirements were not met."
        paragraphs = [
            "Thank you for your interest in partnering with Nexora.",
            "After reviewing the credentials and documentation submitted for your recruiter account, our team was unable to verify your organizational affiliation at this time.",
            f"<strong>Reason:</strong> <em>{rejection_reason}</em>",
            "If you believe this decision was made in error or if you have additional verification documentation to provide, please contact our support team or update your profile."
        ]
        details = [
            {"label": "Account Email", "value": recruiter.email},
            {"label": "Status", "value": "UNSUCCESSFUL VERIFICATION"},
            {"label": "Reason", "value": rejection_reason}
        ]
        event_type = EmailNotification.EventType.RECRUITER_ACCOUNT_REJECTED
        footer_note = "To reapply, reach out to support@nexora.com with corporate email proof or company incorporation documents."

    greeting = f"Hello {recruiter.full_name or 'Recruiter'},"
    body_html = build_nexora_email_html(
        title=title,
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text=cta_text,
        cta_url=cta_url,
        badge_text=badge_text,
        badge_color=badge_color,
        footer_note=footer_note
    )

    body_text = f"""Hello {recruiter.full_name or 'Recruiter'},

{subject}

Account: {recruiter.email}
Status: {'APPROVED' if is_approved else 'NOT APPROVED'}
{"Reason: " + reason if not is_approved else ""}

Visit Nexora: {cta_url}

Best regards,
Nexora Administrator Team
"""

    idempotency_key = f"admin_recruiter_decision_{recruiter.id}_{action}_{int(timezone.now().timestamp())}"
    return send_email_notification(
        recipient_email=recruiter.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=event_type,
        idempotency_key=idempotency_key,
        recipient_user=recruiter
    )


def notify_candidate_welcome(user, auth_source: str = "direct"):
    """
    Candidate Registration Welcome Email:
    Sent only when a genuinely new candidate account is created.
    Tailors subject and content for Google, GitHub, or Email/Password registrations.
    """
    frontend_url = get_frontend_url()
    
    if auth_source == "github":
        subject = "Welcome to Nexora! Your GitHub Registration Was Successful"
        reg_method = "GitHub Verified OAuth"
    elif auth_source == "google":
        subject = "Welcome to Nexora! Your Career Journey Starts Here"
        reg_method = "Google Verified OAuth"
    else:
        subject = "Welcome to Nexora! Your Career Journey Starts Here"
        reg_method = "Email & Password"

    preheader = "Your account is ready. Discover Career GPS, Skill Assessments, ATS Resume Checker & verified jobs."
    title = "Welcome to Nexora! 🚀"
    badge_text = "Account Active"
    badge_color = "#2563eb"
    cta_text = "Explore Your Dashboard"
    cta_url = f"{frontend_url}/candidate/overview"

    display_name = user.full_name or user.username or "Candidate"
    greeting = f"Hello {display_name},"

    paragraphs = [
        "Welcome to <strong>Nexora</strong> — your next-generation, AI-powered career development platform.",
        f"Your account has been successfully created via <strong>{reg_method}</strong>. Whether you're exploring career paths, validating your technical skills, or seeking your dream job, Nexora provides intelligence at every step of your journey.",
        "<strong>Key features ready for you:</strong>",
        "• <strong>Career GPS:</strong> Map tailored career paths, analyze skill gaps, and follow personalized learning roadmaps.",
        "• <strong>Skill Assessments:</strong> Test your knowledge with industry quizzes and coding challenges to earn verified skill badges.",
        "• <strong>ATS Resume Checker:</strong> Benchmark your resume against real job descriptions to optimize ATS match rates.",
        "• <strong>AI Career Assistant:</strong> Get 24/7 coaching, interview guidance, and personalized market insights.",
        "• <strong>Verified Job Opportunities:</strong> Apply directly to curated, recruiter-verified listings with no ghost jobs.",
        "Click the button below to get started and set up your career preferences."
    ]

    details = [
        {"label": "Account Name", "value": display_name},
        {"label": "Registered Email", "value": user.email, "highlight": True},
        {"label": "Account Role", "value": "Candidate / Job Seeker"},
        {"label": "Registration Method", "value": reg_method},
        {"label": "Registration Date", "value": timezone.now().strftime('%B %d, %Y')}
    ]

    body_html = build_nexora_email_html(
        title=title,
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text=cta_text,
        cta_url=cta_url,
        badge_text=badge_text,
        badge_color=badge_color,
        footer_note="Need assistance? Our official support desk is here to help at nexora.officalss@gmail.com."
    )

    body_text = f"""Hello {display_name},

{subject}

Welcome to Nexora — your next-generation, AI-powered career development platform.
Your account has been successfully created via {reg_method}!

Key Features:
- Career GPS: Map career paths and bridge skill gaps.
- Skill Assessments: Validate technical competencies and earn verified badges.
- ATS Resume Checker: Benchmark your resume against job requirements.
- AI Career Assistant: 24/7 AI-powered coaching and interview prep.
- Verified Job Opportunities: Apply directly to active, vetted openings.

Explore your dashboard: {cta_url}

Best regards,
The Nexora Team
"""

    idempotency_key = f"welcome_candidate_{user.id}"
    return send_email_notification(
        recipient_email=user.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.CANDIDATE_WELCOME,
        idempotency_key=idempotency_key,
        recipient_user=user,
        sender_name="Nexora Team"
    )


def notify_recruiter_welcome(user, company_name: str = ""):
    """
    8B. Recruiter Registration Welcome Email
    Sent when a recruiter registers an account on Nexora.
    Clearly explains that their account is Pending Admin Approval.
    """
    frontend_url = get_frontend_url()
    subject = "Welcome to Nexora – Your Recruiter Registration Is Received!"
    preheader = "Your recruiter registration has been received and is pending administrator review."
    title = "Recruiter Registration Received 📋"
    badge_text = "Pending Admin Approval"
    badge_color = "#f59e0b"
    cta_text = "View Recruiter Dashboard"
    cta_url = f"{frontend_url}/recruiter/dashboard"

    display_name = user.full_name or user.username or "Hiring Partner"
    company_display = company_name or "Your Company"
    greeting = f"Hello {display_name},"

    paragraphs = [
        f"Thank you for joining Nexora as a recruiter representing <strong>{company_display}</strong>.",
        "Your recruiter account has been successfully registered and is currently <strong>Pending Admin Approval</strong>.",
        "To protect our candidate community and ensure zero ghost jobs, every recruiter and company profile is verified by the Nexora moderation team before job postings can be published.",
        "<strong>What to expect next:</strong>",
        "• <strong>Verification Review:</strong> Our administrator team will review your company details and credentials.",
        "• <strong>Decision Notification:</strong> You will receive a follow-up email as soon as your account is approved or if any additional information is required.",
        "• <strong>Job Posting Access:</strong> Once approved, you will have immediate access to publish job postings, review applicant profiles, and connect with verified candidates.",
        "In the meantime, you can log in to your Recruiter Dashboard to familiarize yourself with the platform and preview your company workspace."
    ]

    details = [
        {"label": "Recruiter Name", "value": display_name},
        {"label": "Company", "value": company_display, "highlight": True},
        {"label": "Account Email", "value": user.email},
        {"label": "Account Status", "value": "PENDING ADMIN APPROVAL"},
        {"label": "Registration Date", "value": timezone.now().strftime('%B %d, %Y')}
    ]

    body_html = build_nexora_email_html(
        title=title,
        preheader=preheader,
        greeting=greeting,
        paragraphs=paragraphs,
        details=details,
        cta_text=cta_text,
        cta_url=cta_url,
        badge_text=badge_text,
        badge_color=badge_color,
        footer_note="For questions or expedited company verification, please contact partner-support@nexora.com."
    )

    body_text = f"""Hello {display_name},

{subject}

Thank you for registering on Nexora representing {company_display}.
Your recruiter account has been successfully registered and is currently Pending Admin Approval.

Important Information:
- Review Process: Our team verifies all recruiter accounts to prevent ghost jobs.
- Follow-up: You will receive an email once your account has been reviewed.
- Access: Job posting features will be unlocked immediately upon approval.

View your recruiter dashboard: {cta_url}

Best regards,
The Nexora Team
"""

    idempotency_key = f"welcome_recruiter_{user.id}"
    return send_email_notification(
        recipient_email=user.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.RECRUITER_WELCOME,
        idempotency_key=idempotency_key,
        recipient_user=user
    )


# ----------------------------------------------------
# ADMIN & SYSTEM NOTIFICATION DISPATCHERS
# ----------------------------------------------------

def get_admin_emails() -> list:
    """
    Returns the single official administrator email for internal platform alerts:
    nexora.officalss@gmail.com
    """
    return ['nexora.officalss@gmail.com']


def notify_admin_company_verification_submitted(verification):
    """
    Event 4: Recruiter submits company verification -> Dispatched to Admin team.
    """
    admin_emails = get_admin_emails()
    if not admin_emails:
        return None

    company = verification.company
    submitted_by = verification.submitted_by
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    admin_url = f"{get_frontend_url()}/admin-portal/verifications"
    company_name = company.name if company else "Unknown Organization"
    submitter_name = getattr(submitted_by, 'full_name', '') or getattr(submitted_by, 'email', 'Recruiter')

    subject = f"[Admin Alert] New Company Verification Submitted: {company_name}"
    preheader = f"Recruiter {submitter_name} submitted verification documents for {company_name}."

    paragraphs = [
        f"A new corporate entity verification request has been submitted by <strong>{submitter_name}</strong> ({submitted_by.email if submitted_by else ''}) and is waiting for administrator compliance review.",
        "Please review the uploaded documentation and corporate registry details to verify the organization and unlock verified employer credentials."
    ]

    details = [
        {"label": "Company Name", "value": company_name, "highlight": True},
        {"label": "Submitted By", "value": f"{submitter_name} ({submitted_by.email if submitted_by else ''})"},
        {"label": "Submission Date", "value": date_str},
        {"label": "Status", "value": verification.get_status_display() if hasattr(verification, 'get_status_display') else 'Pending Review'}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting="Nexora Administrator Team,",
        paragraphs=paragraphs,
        details=details,
        cta_text="Review Verification Documents",
        cta_url=admin_url,
        badge_text="Compliance Review Required",
        badge_color="#d97706",
        footer_note="Confidential internal administrator alert from Nexora Governance Systems."
    )

    body_text = f"""Nexora Platform Administration Alert:
A new company verification has been submitted for {company_name} by {submitter_name}.

Review and verify: {admin_url}
"""

    results = []
    for admin_email in admin_emails:
        idempotency_key = f"admin_comp_verif_{verification.id}_{admin_email}"
        res = send_email_notification(
            recipient_email=admin_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.ADMIN_COMPANY_VERIFICATION_SUBMITTED,
            idempotency_key=idempotency_key
        )
        results.append(res)
    return results


def notify_admin_job_submitted(job):
    """
    Event 7 (Admin): Recruiter submits a job posting -> Dispatched to Admin team for moderation.
    """
    admin_emails = get_admin_emails()
    if not admin_emails:
        return None

    company_name = job.company.name if job.company else "Organization"
    recruiter_name = getattr(job.recruiter, 'full_name', '') or getattr(job.recruiter, 'email', 'Recruiter')
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    admin_url = f"{get_frontend_url()}/admin-portal/jobs"

    subject = f"[Admin Alert] New Job Pending Moderation: {job.title} at {company_name}"
    preheader = f"New job posting '{job.title}' submitted by {recruiter_name} for approval."

    paragraphs = [
        f"A new job requisition has been posted by <strong>{recruiter_name}</strong> for <strong>{company_name}</strong> and is currently awaiting moderation before going live.",
        "Please review the job description, transparency requirements, and compensation parameters to ensure platform compliance."
    ]

    details = [
        {"label": "Job Title", "value": job.title, "highlight": True},
        {"label": "Company", "value": company_name},
        {"label": "Posted By", "value": f"{recruiter_name} ({job.recruiter.email if job.recruiter else ''})"},
        {"label": "Employment Type", "value": getattr(job, 'job_type', 'Full-time')},
        {"label": "Submitted Date", "value": date_str}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting="Nexora Administrator Team,",
        paragraphs=paragraphs,
        details=details,
        cta_text="Moderate Job Posting",
        cta_url=admin_url,
        badge_text="Job Moderation Queue",
        badge_color="#3b82f6",
        footer_note="Confidential internal administrator alert from Nexora Governance Systems."
    )

    body_text = f"""Nexora Platform Administration Alert:
A new job '{job.title}' at {company_name} was posted by {recruiter_name}.

Review and moderate: {admin_url}
"""

    results = []
    for admin_email in admin_emails:
        idempotency_key = f"admin_job_sub_{job.id}_{admin_email}"
        res = send_email_notification(
            recipient_email=admin_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.ADMIN_JOB_SUBMITTED,
            idempotency_key=idempotency_key
        )
        results.append(res)
    return results


def notify_candidate_status_update(application, new_status: str, notes: str = ""):
    """
    Event 10: Recruiter updates application status -> Candidate
    """
    candidate = application.candidate
    job = application.job
    company = job.company
    company_name = company.name if company else "the hiring company"
    date_str = timezone.now().strftime("%B %d, %Y")
    apps_url = f"{get_frontend_url()}/candidate/applications"

    status_display = application.get_status_display() if hasattr(application, 'get_status_display') else new_status

    badge_color = "#2563eb"
    if new_status in ['INTERVIEWING', 'OFFERED']:
        badge_color = "#16a34a"
    elif new_status == 'REJECTED':
        badge_color = "#dc2626"
    elif new_status == 'SHORTLISTED':
        badge_color = "#7c3aed"

    if new_status == 'SHORTLISTED':
        subject = f"Congratulations! You've been Shortlisted: {job.title} at {company_name}"
        preheader = f"Great news! Your application for {job.title} at {company_name} was shortlisted."
        paragraphs = [
            f"Congratulations {candidate.full_name or 'there'}! The hiring team at <strong>{company_name}</strong> has reviewed your application and shortlisted your profile for the <strong>{job.title}</strong> role.",
            "Your demonstrated technical skills and background align closely with the position requirements.",
            "The recruitment team will reach out with interview details or next steps shortly."
        ]
        if notes:
            paragraphs.append(f"<strong>Hiring Manager Note:</strong> {notes}")
    else:
        subject = f"Application Status Update: {job.title} at {company_name} — {status_display}"
        preheader = f"Your application status for {job.title} has been updated to {status_display}."
        paragraphs = [
            f"Your application for <strong>{job.title}</strong> at <strong>{company_name}</strong> has been updated by the recruitment team.",
            f"Current status: <strong>{status_display}</strong>."
        ]
        if notes:
            paragraphs.append(f"<strong>Recruiter Note:</strong> {notes}")

    details = [
        {"label": "Job Title", "value": job.title, "highlight": True},
        {"label": "Company", "value": company_name},
        {"label": "New Status", "value": status_display, "highlight": True},
        {"label": "Update Date", "value": date_str}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Hi {candidate.full_name or 'there'},",
        paragraphs=paragraphs,
        details=details,
        cta_text="View Application in Dashboard",
        cta_url=apps_url,
        badge_text=f"Status: {status_display}",
        badge_color=badge_color,
        footer_note="You received this email because you applied for this role on Nexora Careers."
    )

    body_text = f"""Nexora Application Update:
Your application for {job.title} at {company_name} has been updated to: {status_display}.
{f'Recruiter note: {notes}' if notes else ''}

View your application: {apps_url}
"""

    idempotency_key = f"cand_status_{application.id}_{new_status}_{int(timezone.now().timestamp())}"
    return send_email_notification(
        recipient_email=candidate.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.CANDIDATE_STATUS_UPDATE,
        idempotency_key=idempotency_key,
        recipient_user=candidate
    )


def notify_password_reset_requested(user, reset_url: str):
    """
    Event 11: Candidate or recruiter requests password reset -> Candidate/Recruiter
    """
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    name = user.full_name or "Nexora Member"

    subject = "Reset Your Nexora Account Password"
    preheader = "Follow the link below to securely reset your Nexora password."

    paragraphs = [
        "We received a request to reset the password for your Nexora account.",
        "If you initiated this request, please click the secure button below to set a new password. This reset link will remain valid for the next 24 hours.",
        "If you did not request a password reset, you can safely disregard this email. Your existing password and account credentials remain secure."
    ]

    details = [
        {"label": "Account Email", "value": user.email, "highlight": True},
        {"label": "Request Timestamp", "value": date_str},
        {"label": "Link Validity", "value": "24 Hours"}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Hello {name},",
        paragraphs=paragraphs,
        details=details,
        cta_text="Reset Password",
        cta_url=reset_url,
        badge_text="Security Verification",
        badge_color="#4f46e5",
        footer_note="If you did not make this request, please contact Nexora security at support@nexora.io."
    )

    body_text = f"""Hello {name},
A password reset was requested for your Nexora account ({user.email}).

Reset your password here:
{reset_url}

This link is valid for 24 hours. If you did not request this, please disregard this email.
"""

    idempotency_key = f"pw_reset_{user.id}_{int(timezone.now().timestamp())}"
    return send_email_notification(
        recipient_email=user.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.PASSWORD_RESET_REQUEST,
        idempotency_key=idempotency_key,
        recipient_user=user
    )


def notify_email_verified(user):
    """
    Event 12: Candidate or recruiter verifies their email -> Respective user
    """
    name = user.full_name or "Nexora Member"
    date_str = timezone.now().strftime("%B %d, %Y")
    login_url = f"{get_frontend_url()}/login"

    subject = "Your Nexora Email Has Been Verified! 🎉"
    preheader = f"Welcome aboard, {name}. Your email address has been successfully verified."

    role_desc = "Recruiter & Talent Partner" if user.role == 'RECRUITER' else "Candidate & Career Seeker"

    paragraphs = [
        "Congratulations! Your email address has been confirmed and verified on Nexora.",
        "Your account now has full access to verified platform services, applications, assessments, and AI career tools."
    ]

    details = [
        {"label": "Verified Email", "value": user.email, "highlight": True},
        {"label": "Account Role", "value": role_desc},
        {"label": "Verification Date", "value": date_str}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Hi {name},",
        paragraphs=paragraphs,
        details=details,
        cta_text="Sign In to Your Account",
        cta_url=login_url,
        badge_text="Email Verified",
        badge_color="#16a34a",
        footer_note="Thank you for being part of the verified Nexora talent community."
    )

    body_text = f"""Hi {name},
Your Nexora email address ({user.email}) has been successfully verified.

Sign in to your account: {login_url}
"""

    idempotency_key = f"email_verified_{user.id}"
    return send_email_notification(
        recipient_email=user.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.EMAIL_VERIFIED,
        idempotency_key=idempotency_key,
        recipient_user=user
    )


def notify_support_request_submitted(ticket):
    """
    Support Workflow:
    1. Sends full ticket details to configured admin / support inbox (`nexora.officalss@gmail.com`)
    2. Sends friendly receipt confirmation to the submitter
    """
    admin_emails = get_admin_emails()
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")

    # 1. Dispatch to Admin Team
    admin_subject = f"[Support Ticket #{ticket.id}] {ticket.subject} — From {ticket.name}"
    admin_preheader = f"New support inquiry from {ticket.name} ({ticket.user_type}): {ticket.subject}"

    admin_paragraphs = [
        f"A new support request has been submitted by <strong>{ticket.name}</strong> ({ticket.email}) under the <strong>{ticket.get_user_type_display()}</strong> category.",
        f"<strong>Message:</strong><br/><div style='background-color:#f8fafc; border-left:4px solid #2563eb; padding:12px 16px; margin-top:8px; border-radius:4px; font-family:monospace; font-size:13px; color:#1e293b; white-space:pre-wrap;'>{ticket.message}</div>"
    ]

    admin_details = [
        {"label": "Ticket ID", "value": f"#{ticket.id}", "highlight": True},
        {"label": "Submitter Name", "value": ticket.name},
        {"label": "Submitter Email", "value": ticket.email, "highlight": True},
        {"label": "User Type", "value": ticket.get_user_type_display()},
        {"label": "Subject", "value": ticket.subject},
        {"label": "Received At", "value": date_str}
    ]

    admin_html = build_nexora_email_html(
        title=admin_subject,
        preheader=admin_preheader,
        greeting="Nexora Support & Operations Team,",
        paragraphs=admin_paragraphs,
        details=admin_details,
        cta_text="Reply to Submitter",
        cta_url=f"mailto:{ticket.email}?subject=Re: [Ticket #{ticket.id}] {ticket.subject}",
        badge_text=f"New Ticket #{ticket.id}",
        badge_color="#2563eb",
        footer_note="Inbound ticket notification from Nexora Help & Contact Support Center."
    )

    admin_text = f"""New Support Ticket #{ticket.id}
From: {ticket.name} ({ticket.email}) [{ticket.get_user_type_display()}]
Subject: {ticket.subject}
Date: {date_str}

Message:
{ticket.message}
"""

    for admin_email in admin_emails:
        send_email_notification(
            recipient_email=admin_email,
            subject=admin_subject,
            body_html=admin_html,
            body_text=admin_text,
            event_type=EmailNotification.EventType.SUPPORT_REQUEST_ADMIN,
            idempotency_key=f"support_ticket_admin_{ticket.id}_{admin_email}",
            sender_name="Nexora Support",
            reply_to=[ticket.email]
        )

    # 2. Friendly confirmation email to the user
    user_subject = f"We received your message: [Ticket #{ticket.id}] {ticket.subject}"
    user_preheader = f"Hi {ticket.name}, your request has been assigned ticket #{ticket.id}."
    user_paragraphs = [
        f"Thank you for contacting Nexora Support. We have received your inquiry and our team is actively reviewing it.",
        "A support specialist will follow up with you directly at this email address within 24 business hours.",
        f"<strong>Your submitted message:</strong><br/><div style='background-color:#f8fafc; border-left:4px solid #14b8a6; padding:12px 16px; margin-top:8px; border-radius:4px; font-size:13px; color:#334155; white-space:pre-wrap;'>{ticket.message}</div>"
    ]
    user_details = [
        {"label": "Ticket Reference", "value": f"#{ticket.id}", "highlight": True},
        {"label": "Subject", "value": ticket.subject},
        {"label": "Category", "value": ticket.get_user_type_display()},
        {"label": "Status", "value": "Received & In Review"}
    ]

    user_html = build_nexora_email_html(
        title=user_subject,
        preheader=user_preheader,
        greeting=f"Hello {ticket.name},",
        paragraphs=user_paragraphs,
        details=user_details,
        cta_text="Visit Nexora Home",
        cta_url=get_frontend_url(),
        badge_text=f"Ticket #{ticket.id} Received",
        badge_color="#14b8a6",
        footer_note="You received this email because you submitted a request at the Nexora Support Center."
    )

    user_text = f"""Hello {ticket.name},
We received your support ticket #{ticket.id}: '{ticket.subject}'.
Our support team will follow up within 24 business hours.

Nexora Support Team
"""

    send_email_notification(
        recipient_email=ticket.email,
        subject=user_subject,
        body_html=user_html,
        body_text=user_text,
        event_type=EmailNotification.EventType.SUPPORT_REQUEST_CONFIRMATION,
        idempotency_key=f"support_ticket_user_{ticket.id}",
        sender_name="Nexora Support"
    )


# ----------------------------------------------------
# EXTENDED CANDIDATE, RECRUITER & ADMIN NOTIFIERS
# ----------------------------------------------------

def notify_candidate_interview_invitation(application, interview_date, location_or_link: str = "", notes: str = ""):
    """
    Candidate receives interview invitation:
    Interview date and time, Time zone, Interview mode, Meeting link or location, notes.
    """
    candidate = application.candidate
    job = application.job
    company = job.company
    company_name = company.name if company else "the hiring company"
    apps_url = f"{get_frontend_url()}/candidate/applications"

    subject = f"Interview Invitation: {job.title} at {company_name}"
    preheader = f"You are invited to an interview for the {job.title} position at {company_name}."

    date_str = str(interview_date)
    is_link = "http://" in (location_or_link or '') or "https://" in (location_or_link or '')
    mode = "Virtual / Video Conference" if is_link else "In-Person / On-site"

    paragraphs = [
        f"We are pleased to inform you that <strong>{company_name}</strong> has invited you to an interview for the <strong>{job.title}</strong> position.",
        "Please review the schedule details below and prepare accordingly."
    ]
    if notes:
        paragraphs.append(f"<strong>Preparation Notes:</strong> {notes}")

    details = [
        {"label": "Job Title", "value": job.title, "highlight": True},
        {"label": "Company", "value": company_name},
        {"label": "Interview Schedule", "value": date_str, "highlight": True},
        {"label": "Mode", "value": mode},
        {"label": "Location / Link", "value": location_or_link or "Details provided in dashboard"}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Dear {candidate.full_name or 'Candidate'},",
        paragraphs=paragraphs,
        details=details,
        cta_text="View Interview Details in Dashboard",
        cta_url=apps_url,
        badge_text="Interview Scheduled",
        badge_color="#16a34a",
        footer_note="You received this email because you applied for this role on Nexora Careers."
    )

    body_text = f"""Interview Invitation:
You have been invited to an interview for {job.title} at {company_name}.
Schedule: {date_str}
Location/Link: {location_or_link or 'See dashboard'}
Notes: {notes}

View details: {apps_url}
"""

    idempotency_key = f"interview_invite_{application.id}_{int(timezone.now().timestamp())}"
    return send_email_notification(
        recipient_email=candidate.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.CANDIDATE_INTERVIEW_INVITE,
        idempotency_key=idempotency_key,
        recipient_user=candidate,
        sender_name="Nexora Interviews"
    )


def notify_recruiter_company_verification_submitted(verification):
    """
    Recruiter submits company verification:
    Confirmation sent to recruiter that documents were received and admin review is pending.
    """
    company = verification.company
    submitted_by = verification.submitted_by
    if not submitted_by or not submitted_by.email:
        return None

    company_name = company.name if company else "your organization"
    date_str = timezone.now().strftime("%B %d, %Y")
    dashboard_url = f"{get_frontend_url()}/recruiter/dashboard"

    subject = f"Company Verification Received: {company_name} — In Review"
    preheader = f"Your entity verification documents for {company_name} have been submitted for admin compliance review."

    paragraphs = [
        f"Thank you for submitting company verification documents for <strong>{company_name}</strong>.",
        "Our platform compliance team reviews all corporate registries, corporate email proofs, and tax filings within <strong>12 to 24 business hours</strong> to ensure platform integrity and prevent ghost postings.",
        "You will receive an automated email as soon as the review is complete. Once verified, your company will receive the Verified Employer badge and priority candidate visibility."
    ]

    details = [
        {"label": "Company Name", "value": company_name, "highlight": True},
        {"label": "Submission Date", "value": date_str},
        {"label": "Verification Status", "value": "Under Administrator Review", "highlight": True},
        {"label": "Expected SLA", "value": "12 – 24 Business Hours"}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Hello {submitted_by.full_name or 'Recruiter'},",
        paragraphs=paragraphs,
        details=details,
        cta_text="Check Status in Recruiter Dashboard",
        cta_url=dashboard_url,
        badge_text="Verification In Review",
        badge_color="#d97706",
        footer_note="Nexora Trust & Safety Operations • Single Official Desk: nexora.officalss@gmail.com"
    )

    body_text = f"""Hello {submitted_by.full_name or 'Recruiter'},
Verification documents for {company_name} have been received and are pending administrator review.
Review SLA: 12 - 24 hours.

Check dashboard: {dashboard_url}
"""

    idempotency_key = f"recruiter_verif_sub_{verification.id}"
    return send_email_notification(
        recipient_email=submitted_by.email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.RECRUITER_VERIFICATION_CONFIRMATION,
        idempotency_key=idempotency_key,
        recipient_user=submitted_by,
        sender_name="Nexora Support"
    )


def notify_admin_recruiter_registered(user, company_name: str = ""):
    """
    Admin alert when a new recruiter registers:
    Delivered directly to nexora.officalss@gmail.com.
    """
    admin_emails = get_admin_emails()
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    admin_url = f"{get_frontend_url()}/admin-portal/recruiters"
    company_display = company_name or "Pending Registration"

    subject = f"[Admin Alert] New Recruiter Registration: {user.full_name or user.email} ({company_display})"
    preheader = f"A new recruiter has registered representing {company_display}."

    paragraphs = [
        f"A new talent acquisition partner has registered on Nexora: <strong>{user.full_name or user.email}</strong>.",
        f"Organization: <strong>{company_display}</strong>.",
        "Their account is currently in <strong>Pending Approval</strong> state. Please inspect their credentials and company details in the moderation portal."
    ]

    details = [
        {"label": "Recruiter Name", "value": user.full_name or "N/A", "highlight": True},
        {"label": "Registered Email", "value": user.email, "highlight": True},
        {"label": "Company Name", "value": company_display},
        {"label": "Registration Date", "value": date_str},
        {"label": "Initial Status", "value": "Pending Approval"}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting="Nexora Administrator Team,",
        paragraphs=paragraphs,
        details=details,
        cta_text="Review Recruiter Application",
        cta_url=admin_url,
        badge_text="Recruiter Review Needed",
        badge_color="#3b82f6",
        footer_note="Confidential internal administrator alert from Nexora Governance Systems."
    )

    body_text = f"""Nexora Administration Alert:
New recruiter registered: {user.full_name} ({user.email})
Company: {company_display}
Date: {date_str}

Review and approve: {admin_url}
"""

    results = []
    for admin_email in admin_emails:
        idempotency_key = f"admin_recruiter_reg_{user.id}_{admin_email}"
        res = send_email_notification(
            recipient_email=admin_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.ADMIN_RECRUITER_REGISTERED,
            idempotency_key=idempotency_key,
            sender_name="Nexora System"
        )
        results.append(res)
    return results


def notify_admin_job_reported(report):
    """
    Admin alert when a candidate reports a suspicious job:
    Delivered directly to nexora.officalss@gmail.com.
    """
    admin_emails = get_admin_emails()
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    admin_url = f"{get_frontend_url()}/admin-portal/reports"

    job = report.job
    company_name = job.company.name if job and job.company else "Organization"
    reporter = report.reported_by
    reporter_desc = f"{reporter.full_name} ({reporter.email})" if reporter else "Anonymous User"

    subject = f"[Security Alert] Suspicious Job Reported: #{job.id} '{job.title}' ({report.reason})"
    preheader = f"A user flagged job #{job.id} for moderation: {report.reason}."

    paragraphs = [
        f"A job listing on Nexora has been flagged by <strong>{reporter_desc}</strong>.",
        f"<strong>Reason:</strong> {report.reason}",
        f"<strong>Details:</strong><br/><div style='background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; margin-top:8px; border-radius:4px; font-size:13px; color:#991b1b; white-space:pre-wrap;'>{report.details}</div>",
        "Please investigate whether this posting violates platform anti-scam policies or requires immediate suspension."
    ]

    details = [
        {"label": "Report ID", "value": f"#{report.id}", "highlight": True},
        {"label": "Job Title", "value": job.title if job else "N/A"},
        {"label": "Company", "value": company_name},
        {"label": "Flag Reason", "value": report.reason, "highlight": True},
        {"label": "Reported By", "value": reporter_desc},
        {"label": "Timestamp", "value": date_str}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting="Nexora Security & Moderation Team,",
        paragraphs=paragraphs,
        details=details,
        cta_text="Open Scam Shield Moderation",
        cta_url=admin_url,
        badge_text="Urgent Security Review",
        badge_color="#dc2626",
        footer_note="Confidential internal security alert from Nexora Job Scam Shield."
    )

    body_text = f"""Nexora Security Alert:
Job #{job.id} '{job.title}' reported by {reporter_desc}.
Reason: {report.reason}
Details: {report.details}

Moderate: {admin_url}
"""

    results = []
    for admin_email in admin_emails:
        idempotency_key = f"admin_job_rep_{report.id}_{admin_email}"
        res = send_email_notification(
            recipient_email=admin_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.ADMIN_JOB_REPORTED,
            idempotency_key=idempotency_key,
            sender_name="Nexora Security"
        )
        results.append(res)
    return results


def notify_admin_security_event(event_title: str, details_dict: dict = None):
    """
    Admin alert for important platform security events:
    Delivered directly to nexora.officalss@gmail.com.
    """
    admin_emails = get_admin_emails()
    date_str = timezone.now().strftime("%B %d, %Y at %I:%M %p UTC")
    admin_url = f"{get_frontend_url()}/admin-portal"

    subject = f"[Platform Security Alert] {event_title}"
    preheader = f"Important security event on Nexora: {event_title}"

    paragraphs = [
        f"The Nexora security monitoring system detected an important platform event: <strong>{event_title}</strong>.",
        "Please review the system logs and recent administrative actions if needed."
    ]

    details = [
        {"label": "Event", "value": event_title, "highlight": True},
        {"label": "Detected At", "value": date_str}
    ]
    if details_dict:
        for k, v in details_dict.items():
            details.append({"label": str(k), "value": str(v)})

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting="Nexora Security Administration,",
        paragraphs=paragraphs,
        details=details,
        cta_text="Access Admin Portal",
        cta_url=admin_url,
        badge_text="Platform Security Alert",
        badge_color="#ea580c",
        footer_note="Confidential automated security dispatch."
    )

    body_text = f"""Nexora Security Alert: {event_title}
Date: {date_str}
Details: {details_dict}

Portal: {admin_url}
"""

    results = []
    for admin_email in admin_emails:
        idempotency_key = f"sec_event_{int(timezone.now().timestamp())}_{admin_email}"
        res = send_email_notification(
            recipient_email=admin_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.ADMIN_SECURITY_EVENT,
            idempotency_key=idempotency_key,
            sender_name="Nexora Security"
        )
        results.append(res)
    return results


def notify_email_change_requested(user, new_email: str, verify_url: str):
    """
    Candidate or recruiter changes email address -> verification sent to new email.
    """
    date_str = timezone.now().strftime("%B %d, %Y")
    name = user.full_name or "Nexora Member"

    subject = "Confirm Your New Nexora Email Address"
    preheader = f"Verify {new_email} as your new primary Nexora email."

    paragraphs = [
        f"Hello {name},",
        f"A request was made to update the primary email address for your Nexora account to <strong>{new_email}</strong>.",
        "To verify ownership of this email address and complete the update, please click the confirmation button below."
    ]

    details = [
        {"label": "New Email Address", "value": new_email, "highlight": True},
        {"label": "Requested On", "value": date_str},
        {"label": "Link Expiration", "value": "24 Hours"}
    ]

    body_html = build_nexora_email_html(
        title=subject,
        preheader=preheader,
        greeting=f"Hi {name},",
        paragraphs=paragraphs,
        details=details,
        cta_text="Verify New Email Address",
        cta_url=verify_url,
        badge_text="Email Verification",
        badge_color="#2563eb",
        footer_note="If you did not request this email change, please secure your account immediately."
    )

    body_text = f"""Hello {name},
Verify your new Nexora email ({new_email}) here:
{verify_url}
"""

    idempotency_key = f"email_change_{user.id}_{int(timezone.now().timestamp())}"
    return send_email_notification(
        recipient_email=new_email,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
        event_type=EmailNotification.EventType.EMAIL_CHANGE_REQUEST,
        idempotency_key=idempotency_key,
        recipient_user=user,
        sender_name="Nexora Security"
    )

