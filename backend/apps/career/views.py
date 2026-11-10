from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from .models import TargetRole, CareerRoadmap, RoadmapStep, CareerResource
from .serializers import TargetRoleSerializer, CareerRoadmapSerializer, CareerResourceSerializer
from .services import calculate_job_readiness, generate_roadmap_for_role
from accounts.permissions import IsCandidate

class TargetRoleListView(generics.ListAPIView):
    queryset = TargetRole.objects.all().order_by('title')
    serializer_class = TargetRoleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class CareerResourceListView(generics.ListAPIView):
    serializer_class = CareerResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        qs = CareerResource.objects.all().order_by('-created_at')
        if category:
            qs = qs.filter(category=category)
        return qs

class JobReadinessView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        role_id = request.query_params.get('role_id')
        readiness = calculate_job_readiness(request.user, target_role_id=role_id)
        return Response(readiness)

class CandidateRoadmapView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        role_id = request.query_params.get('role_id')
        target_role = None
        if role_id:
            target_role = TargetRole.objects.filter(id=role_id).first()
        if not target_role:
            try:
                profile = request.user.candidate_profile
                if profile.target_role:
                    target_role = TargetRole.objects.filter(title__icontains=profile.target_role).first()
            except Exception:
                pass
        if not target_role:
            target_role = TargetRole.objects.first()

        if not target_role:
            return Response({"error": "No career roles configured."}, status=status.HTTP_404_NOT_FOUND)

        roadmap = generate_roadmap_for_role(request.user, target_role, user_inputs=request.data)
        return Response(CareerRoadmapSerializer(roadmap).data)

    def post(self, request):
        role_id = request.data.get('role_id')
        try:
            target_role = TargetRole.objects.get(id=role_id)
        except TargetRole.DoesNotExist:
            return Response({"error": "Target role not found."}, status=status.HTTP_404_NOT_FOUND)

        roadmap = generate_roadmap_for_role(request.user, target_role, user_inputs=request.data)
        return Response(CareerRoadmapSerializer(roadmap).data, status=status.HTTP_201_CREATED)

class ToggleRoadmapStepView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def patch(self, request, step_id):
        try:
            step = RoadmapStep.objects.get(id=step_id, roadmap__candidate=request.user)
        except RoadmapStep.DoesNotExist:
            return Response({"error": "Step not found."}, status=status.HTTP_404_NOT_FOUND)

        step.is_completed = not step.is_completed
        step.save()

        roadmap = step.roadmap
        roadmap.overall_progress = roadmap.calculate_progress()
        roadmap.save()

        return Response({
            "step_id": step.id,
            "is_completed": step.is_completed,
            "overall_progress": roadmap.overall_progress
        })

