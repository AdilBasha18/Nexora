from django.urls import path
from .views import (
    TargetRoleListView,
    CareerResourceListView,
    JobReadinessView,
    CandidateRoadmapView,
    ToggleRoadmapStepView
)

urlpatterns = [
    path('roles/', TargetRoleListView.as_view(), name='target-roles'),
    path('resources/', CareerResourceListView.as_view(), name='career-resources'),
    path('readiness/', JobReadinessView.as_view(), name='job-readiness'),
    path('roadmap/', CandidateRoadmapView.as_view(), name='candidate-roadmap'),
    path('roadmap/steps/<int:step_id>/toggle/', ToggleRoadmapStepView.as_view(), name='toggle-roadmap-step'),
]

