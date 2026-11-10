from django.urls import path
from .views import (
    JobListView,
    JobDetailView,
    RecruiterJobCreateListView,
    RecruiterJobDetailView,
    SaveJobToggleView,
    SavedJobListView
)

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),
    path('my-jobs/', RecruiterJobCreateListView.as_view(), name='recruiter-job-list-create'),
    path('my-jobs/<int:id>/', RecruiterJobDetailView.as_view(), name='recruiter-job-detail'),
    path('saved/', SavedJobListView.as_view(), name='saved-job-list'),
    path('<int:id>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:id>/save/', SaveJobToggleView.as_view(), name='job-save-toggle'),
]

