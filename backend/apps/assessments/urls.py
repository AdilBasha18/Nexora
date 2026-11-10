from django.urls import path
from .views import (
    AssessmentCategoryListView,
    AssessmentListView,
    AssessmentDetailView,
    AssessmentTakeView,
    AssessmentRunCodeView,
    AssessmentSubmitView,
    CandidateAssessmentAttemptsView,
    CandidateAttemptDetailView
)

urlpatterns = [
    path('categories/', AssessmentCategoryListView.as_view(), name='assessment-categories'),
    path('', AssessmentListView.as_view(), name='assessment-list'),
    path('run-code/', AssessmentRunCodeView.as_view(), name='assessment-run-code'),
    path('submit/', AssessmentSubmitView.as_view(), name='assessment-submit'),
    path('my-attempts/', CandidateAssessmentAttemptsView.as_view(), name='candidate-attempts'),
    path('my-attempts/<int:pk>/', CandidateAttemptDetailView.as_view(), name='candidate-attempt-detail'),
    path('<int:id>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    path('<int:id>/take/', AssessmentTakeView.as_view(), name='assessment-take'),
]
