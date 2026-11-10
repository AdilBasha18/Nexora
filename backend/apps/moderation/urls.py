from django.urls import path
from .views import (
    JobReportCreateListView,
    JobReportDetailUpdateView,
    AdminVerificationListView,
    AdminVerificationActionView,
    AdminJobActionView,
    AdminPlatformStatsView,
    AdminAuditLogsView
)

urlpatterns = [
    path('reports/', JobReportCreateListView.as_view(), name='moderation-reports'),
    path('reports/<int:pk>/', JobReportDetailUpdateView.as_view(), name='moderation-report-detail'),
    path('verifications/', AdminVerificationListView.as_view(), name='admin-verifications'),
    path('verifications/<int:pk>/action/', AdminVerificationActionView.as_view(), name='admin-verification-action'),
    path('jobs/<int:pk>/action/', AdminJobActionView.as_view(), name='admin-job-action'),
    path('stats/', AdminPlatformStatsView.as_view(), name='admin-stats'),
    path('audit-logs/', AdminAuditLogsView.as_view(), name='admin-audit-logs'),
]

