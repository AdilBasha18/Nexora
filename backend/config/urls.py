"""
Nexora API URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root_api_index(request):
    return JsonResponse({
        "status": "online",
        "service": "Nexora Enterprise REST API",
        "version": "1.0.0",
        "endpoints": "/api/v1/"
    })

urlpatterns = [
    path('', root_api_index, name='api-root-index'),
    path('health/', root_api_index, name='api-health'),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/candidates/', include('candidates.urls')),
    path('api/v1/companies/', include('companies.urls')),
    path('api/v1/jobs/', include('jobs.urls')),
    path('api/v1/applications/', include('applications.urls')),
    path('api/v1/resumes/', include('resumes.urls')),
    path('api/v1/ats/', include('ats.urls')),
    path('api/v1/matching/', include('matching.urls')),
    path('api/v1/assessments/', include('assessments.urls')),
    path('api/v1/career/', include('career.urls')),
    path('api/v1/assistant/', include('assistant.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/moderation/', include('moderation.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
