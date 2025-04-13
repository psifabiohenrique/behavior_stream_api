from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Journaling
from .serializers import JournalingSerializer
from core.models.relationship import Relationship
from core.models.allowed_activity import AllowedActivity


class JournalingViewSet(viewsets.ModelViewSet):
    queryset = Journaling.objects.all()
    serializer_class = JournalingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get_queryset(self):
    def get(self, request):
        queryset = super().get_queryset()
        user = request.user

        if user.role == "therapist":
            patient_ids = Relationship.objects.filter(therapist=user).values_list(
                "patient", flat=True
            )
            queryset = queryset.filter(patient__in=patient_ids)
        if not AllowedActivity.objects.filter(
            patient=user, activity_type="journaling", is_allowed=True
        ).exists():
            raise PermissionDenied(
                "Você não tem permissão para acessar esta atividade."
            )
        queryset = queryset.filter(patient=user)

        return queryset
