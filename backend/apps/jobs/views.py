from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, SavedJob
from .serializers import JobSerializer, JobCreateUpdateSerializer, SavedJobSerializer
from accounts.permissions import IsRecruiter, IsCandidate

class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Job.objects.filter(status=Job.Status.PUBLISHED).select_related('company').order_by('-created_at')
        
        # Search query
        q = self.request.query_params.get('search', '').strip()
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | 
                Q(description__icontains=q) | 
                Q(company__name__icontains=q) |
                Q(location__icontains=q)
            )

        # Filter by skill
        skill = self.request.query_params.get('skill', '').strip()
        if skill:
            # Check JSON array contains
            queryset = queryset.filter(
                Q(required_skills__icontains=skill) |
                Q(preferred_skills__icontains=skill)
            )

        # Filter by work mode
        work_mode = self.request.query_params.get('work_mode', '').strip()
        if work_mode:
            queryset = queryset.filter(work_mode__iexact=work_mode)

        # Filter by location
        location = self.request.query_params.get('location', '').strip()
        if location:
            queryset = queryset.filter(location__icontains=location)

        # Filter by experience level
        experience_level = self.request.query_params.get('experience_level', '').strip()
        if experience_level:
            queryset = queryset.filter(experience_level__iexact=experience_level)

        # Filter by employment type
        emp_type = self.request.query_params.get('employment_type', '').strip()
        if emp_type:
            queryset = queryset.filter(employment_type__iexact=emp_type)

        # Filter verified only
        verified_only = self.request.query_params.get('verified_only', '').lower() in ('true', '1')
        if verified_only:
            queryset = queryset.filter(is_verified=True)

        return queryset

class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all().select_related('company')
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

class RecruiterJobCreateListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get(self, request):
        jobs = Job.objects.filter(recruiter=request.user).select_related('company').order_by('-created_at')
        return Response(JobSerializer(jobs, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = JobCreateUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            job = serializer.save()
            return Response(JobSerializer(job, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecruiterJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]
    lookup_field = 'id'

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

class SaveJobToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request, id):
        try:
            job = Job.objects.get(id=id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        saved_item, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved_item.delete()
            return Response({"saved": False, "message": "Job removed from saved jobs."}, status=status.HTTP_200_OK)
        return Response({"saved": True, "message": "Job saved successfully."}, status=status.HTTP_201_CREATED)

class SavedJobListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job', 'job__company').order_by('-saved_at')

