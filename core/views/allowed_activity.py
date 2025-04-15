from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models.allowed_activity import AllowedActivity
from core.serializers import AllowedActivitySerializer


class AllowedActivityViewSet(viewsets.ModelViewSet):
    queryset = AllowedActivity.objects.all()
    serializer_class = AllowedActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "patient":
            return AllowedActivity.objects.filter(patient=user)
        elif user.role == "therapist":
            return AllowedActivity.objects.filter(therapist=user)
        else:
            return AllowedActivity.objects.none()
