from django.urls import path
from .views import CompanyListView, CompanyDetailView, RecruiterMyCompanyView, SubmitVerificationView

urlpatterns = [
    path('', CompanyListView.as_view(), name='company-list'),
    path('my-company/', RecruiterMyCompanyView.as_view(), name='my-company'),
    path('verify/', SubmitVerificationView.as_view(), name='submit-verification'),
    path('<int:id>/', CompanyDetailView.as_view(), name='company-detail'),
]

