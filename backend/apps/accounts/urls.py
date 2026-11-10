from django.urls import path
from .views import (
    CandidateRegisterView,
    RecruiterRegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView
)

urlpatterns = [
    path('register/candidate/', CandidateRegisterView.as_view(), name='register-candidate'),
    path('register/recruiter/', RecruiterRegisterView.as_view(), name='register-recruiter'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]

