from django.urls import path
from .views import (
    CandidateRegisterView,
    RecruiterRegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView,
    GoogleOAuthView,
    GitHubOAuthView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    VerifyEmailRequestView,
    VerifyEmailConfirmView,
)

urlpatterns = [
    path('register/candidate/', CandidateRegisterView.as_view(), name='register-candidate'),
    path('register/recruiter/', RecruiterRegisterView.as_view(), name='register-recruiter'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('google/', GoogleOAuthView.as_view(), name='google-oauth'),
    path('github/', GitHubOAuthView.as_view(), name='github-oauth'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('verify-email/', VerifyEmailRequestView.as_view(), name='verify-email-request'),
    path('verify-email/confirm/', VerifyEmailConfirmView.as_view(), name='verify-email-confirm'),
]

