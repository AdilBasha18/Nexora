from django.urls import path
from .views import (
    ApplyJobView,
    CandidateApplicationListView,
    CandidateWithdrawApplicationView,
    RecruiterApplicationListView,
    RecruiterApplicationUpdateView
)

urlpatterns = [
    path('apply/', ApplyJobView.as_view(), name='apply-job'),
    path('my-applications/', CandidateApplicationListView.as_view(), name='candidate-applications'),
    path('<int:pk>/withdraw/', CandidateWithdrawApplicationView.as_view(), name='withdraw-application'),
    path('recruiter/', RecruiterApplicationListView.as_view(), name='recruiter-applications'),
    path('recruiter/<int:pk>/', RecruiterApplicationUpdateView.as_view(), name='recruiter-application-update'),
]

