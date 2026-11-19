import uuid
from django.utils import timezone
from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from .models import Notification, EmailNotification
from .serializers import NotificationSerializer, EmailNotificationSerializer, SupportTicketSerializer
from .services import (
    send_email_notification, 
    retry_failed_email, 
    build_nexora_email_html,
    get_frontend_url
)
from accounts.permissions import IsPlatformAdmin

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)[:30]

class MarkNotificationReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, recipient=request.user)
            notif.is_read = True
            notif.save()
            return Response({"message": "Marked as read."})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

class MarkAllNotificationsReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."})


# =========================================================================
# ADMIN EMAIL NOTIFICATION AUDIT & MANAGEMENT VIEWS
# =========================================================================

class EmailNotificationListView(generics.ListAPIView):
    """
    Lists recent transactional email logs for platform audit.
    Shows recipient, subject, event type, delivery status, and timestamps.
    """
    serializer_class = EmailNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        qs = EmailNotification.objects.all().select_related('recipient_user').order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        event_filter = self.request.query_params.get('event_type')
        if event_filter:
            qs = qs.filter(event_type=event_filter)
        return qs[:100]


class EmailNotificationRetryView(views.APIView):
    """
    Safely retries sending a failed email notification without creating duplicates.
    """
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):
        try:
            notification = EmailNotification.objects.get(pk=pk)
        except EmailNotification.DoesNotExist:
            return Response({"error": "Email log not found."}, status=status.HTTP_404_NOT_FOUND)

        success = retry_failed_email(notification.id)
        notification.refresh_from_db()
        return Response({
            "message": "Retry succeeded." if success else "Retry failed. Check SMTP configuration.",
            "status": notification.status,
            "error_message": notification.error_message,
            "sent_at": notification.sent_at,
            "retry_count": notification.retry_count
        }, status=status.HTTP_200_OK if success else status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmailTestDeliveryView(views.APIView):
    """
    Sends a test email to verify SMTP credentials and deliverability.
    """
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def post(self, request):
        target_email = request.data.get('email') or request.user.email
        if not target_email:
            return Response({"error": "Recipient email address is required."}, status=status.HTTP_400_BAD_REQUEST)

        frontend_url = get_frontend_url()
        subject = "Nexora Email System Test – Delivery Verified"
        title = "Email Delivery Test Successful"
        greeting = f"Hello {request.user.full_name or 'Admin'},"
        
        paragraphs = [
            "This is an automated verification email sent from your Nexora deployment.",
            "If you are reading this in your inbox, your SMTP server connection, authentication credentials, and TLS security settings are functioning properly."
        ]

        details = [
            {"label": "Recipient", "value": target_email},
            {"label": "Triggered By", "value": request.user.email},
            {"label": "Timestamp", "value": timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')},
            {"label": "Status", "value": "DELIVERY TEST OK", "highlight": True}
        ]

        body_html = build_nexora_email_html(
            title=title,
            preheader="Nexora SMTP delivery test verification email",
            greeting=greeting,
            paragraphs=paragraphs,
            details=details,
            cta_text="Open Nexora Dashboard",
            cta_url=f"{frontend_url}/admin-portal",
            badge_text="SMTP Verified",
            badge_color="#10b981",
            footer_note="Transactional email system operational."
        )

        body_text = f"Nexora Email Test: Successfully sent to {target_email} at {timezone.now().isoformat()}."
        idempotency_key = f"test_email_{uuid.uuid4().hex[:12]}"

        record = send_email_notification(
            recipient_email=target_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            event_type=EmailNotification.EventType.TEST_EMAIL,
            idempotency_key=idempotency_key,
            recipient_user=request.user
        )

        return Response({
            "message": "Email sent successfully." if record.status == 'SENT' else f"Email delivery failed: {record.error_message}",
            "status": record.status,
            "error_message": record.error_message,
            "recipient": target_email,
            "idempotency_key": idempotency_key
        }, status=status.HTTP_200_OK if record.status == 'SENT' else status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContactSupportView(generics.CreateAPIView):
    """
    Public Contact Support endpoint.
    Validates input, saves ticket to database, and triggers email notifications to admin and user.
    """
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        ticket = serializer.save()
        try:
            from .services import notify_support_request_submitted
            notify_support_request_submitted(ticket)
        except Exception as e:
            import logging
            logging.getLogger('notifications').error(f"Error dispatching support ticket email: {e}")


class AdminSupportTicketListView(generics.ListAPIView):
    """
    Admin endpoint to view submitted support tickets.
    """
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        from .models import SupportTicket
        return SupportTicket.objects.all().order_by('-created_at')
