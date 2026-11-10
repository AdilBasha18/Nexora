from django.urls import path
from .views import RecommendedJobsView, JobMatchDetailView

urlpatterns = [
    path('recommendations/', RecommendedJobsView.as_view(), name='matching-recommendations'),
    path('jobs/<int:job_id>/', JobMatchDetailView.as_view(), name='matching-job-detail'),
]

