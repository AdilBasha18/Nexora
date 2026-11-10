from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from accounts.permissions import IsCandidate

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-uploaded_at')

class ResumeDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

class SetPrimaryResumeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request, pk):
        try:
            resume = Resume.objects.get(pk=pk, user=request.user)
            resume.is_primary = True
            resume.save()
            return Response({"message": f"Resume '{resume.title}' set as primary."}, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found."}, status=status.HTTP_404_NOT_FOUND)

