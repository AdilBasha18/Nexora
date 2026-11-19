from rest_framework import serializers
from .models import Notification, EmailNotification, SupportTicket

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'link', 'is_read', 'created_at']
        read_only_fields = ['id', 'title', 'message', 'notification_type', 'link', 'created_at']


class EmailNotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.SerializerMethodField()

    class Meta:
        model = EmailNotification
        fields = [
            'id',
            'recipient_email',
            'recipient_user',
            'recipient_name',
            'subject',
            'event_type',
            'status',
            'error_message',
            'retry_count',
            'created_at',
            'sent_at'
        ]
        read_only_fields = fields

    def get_recipient_name(self, obj):
        if obj.recipient_user:
            return obj.recipient_user.full_name or obj.recipient_user.username
        return ''


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['id', 'name', 'email', 'user_type', 'subject', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()

    def validate_email(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("A valid email address is required.")
        return value.strip().lower()

    def validate_subject(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Subject is required.")
        return value.strip()

    def validate_message(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Message is required.")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Please provide more details (minimum 10 characters).")
        return value.strip()
