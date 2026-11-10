from django.urls import path
from .views import CandidateProfileMeView

urlpatterns = [
    path('profile/', CandidateProfileMeView.as_view(), name='candidate-profile-me'),
]

