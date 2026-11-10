from rest_framework import views, permissions, status
from rest_framework.response import Response
from .services import get_recommended_jobs_for_candidate, compute_job_match
from jobs.models import Job
from resumes.models import Resume
from jobs.serializers import JobSerializer
from accounts.permissions import IsCandidate

class RecommendedJobsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        limit = int(request.query_params.get('limit', 12))
        scored_jobs = get_recommended_jobs_for_candidate(request.user, limit=limit)
        
        results = []
        for item in scored_jobs:
            job_data = JobSerializer(item['job'], context={'request': request}).data
            results.append({
                "job": job_data,
                "match": item['match']
            })
        return Response(results)

class JobMatchDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            candidate_profile = request.user.candidate_profile
        except Exception:
            candidate_profile = None

        resume = Resume.objects.filter(user=request.user, is_primary=True).first()
        match_data = compute_job_match(candidate_profile, resume, job)

        return Response({
            "job_id": job.id,
            "job_title": job.title,
            "company_name": job.company.name,
            **match_data
        })

