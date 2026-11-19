from django.urls import path
from .views import (
    JobReportCreateListView,
    JobReportDetailUpdateView,
    AdminVerificationListView,
    AdminVerificationActionView,
    AdminRecruiterListView,
    AdminRecruiterActionView,
    AdminJobListView,
    AdminJobActionView,
    AdminUserListView,
    AdminUserActionView,
    AdminPlatformStatsView,
    AdminAuditLogsView
)

urlpatterns = [
    path('reports/', JobReportCreateListView.as_view(), name='moderation-reports'),
    path('reports/<int:pk>/', JobReportDetailUpdateView.as_view(), name='moderation-report-detail'),
    path('verifications/', AdminVerificationListView.as_view(), name='admin-verifications'),
    path('verifications/<int:pk>/action/', AdminVerificationActionView.as_view(), name='admin-verification-action'),
    path('recruiters/', AdminRecruiterListView.as_view(), name='admin-recruiters'),
    path('recruiters/<int:pk>/action/', AdminRecruiterActionView.as_view(), name='admin-recruiter-action'),
    path('jobs/', AdminJobListView.as_view(), name='admin-jobs'),
    path('jobs/<int:pk>/action/', AdminJobActionView.as_view(), name='admin-job-action'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/action/', AdminUserActionView.as_view(), name='admin-user-action'),
    path('stats/', AdminPlatformStatsView.as_view(), name='admin-stats'),
    path('audit-logs/', AdminAuditLogsView.as_view(), name='admin-audit-logs'),
]

