from django.urls import path
from .views import (
    ATSCheckView,
    ATSPresetsView,
    ATSImproveView,
    ATSEvaluateRevisedView,
    ATSSaveToResumesView,
    ATSDownloadImprovedView,
    ATSHistoryView,
    ATSDetailView
)

urlpatterns = [
    path('presets/', ATSPresetsView.as_view(), name='ats-presets'),
    path('check/', ATSCheckView.as_view(), name='ats-check'),
    path('improve/', ATSImproveView.as_view(), name='ats-improve'),
    path('re-evaluate/', ATSEvaluateRevisedView.as_view(), name='ats-re-evaluate'),
    path('save-to-resumes/', ATSSaveToResumesView.as_view(), name='ats-save-to-resumes'),
    path('download-improved/', ATSDownloadImprovedView.as_view(), name='ats-download-improved'),
    path('history/', ATSHistoryView.as_view(), name='ats-history'),
    path('<int:pk>/', ATSDetailView.as_view(), name='ats-detail'),
]
