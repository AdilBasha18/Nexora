from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer
from accounts.permissions import IsCandidate

class CandidateProfileMeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        return Response(CandidateProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)

