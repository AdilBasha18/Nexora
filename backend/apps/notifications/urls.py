from django.urls import path
from .views import (
    NotificationListView, 
    MarkNotificationReadView, 
    MarkAllNotificationsReadView,
    EmailNotificationListView,
    EmailNotificationRetryView,
    EmailTestDeliveryView,
    ContactSupportView,
    AdminSupportTicketListView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    path('support/', ContactSupportView.as_view(), name='contact-support'),
    path('support/admin/', AdminSupportTicketListView.as_view(), name='admin-support-tickets'),
    
    # Email Notification Management & Audit
    path('emails/', EmailNotificationListView.as_view(), name='email-notification-list'),
    path('emails/<int:pk>/retry/', EmailNotificationRetryView.as_view(), name='email-notification-retry'),
    path('emails/test/', EmailTestDeliveryView.as_view(), name='email-test-delivery'),
]
