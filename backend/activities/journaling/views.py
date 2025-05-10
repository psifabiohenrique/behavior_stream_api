from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from activities.models import ActivityChoices
from core.models.allowed_activity import AllowedActivity
from core.models.relationship import Relationship
from core.models.user import RoleChoices

from .models import Journaling
from .serializers import JournalingSerializer


class JournalingViewSet(viewsets.ModelViewSet):
    queryset = Journaling.objects.all()
    serializer_class = JournalingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == RoleChoices.patient:
            permitted_user = AllowedActivity.objects.get(
                relationship__patient=user
            )
            if permitted_user.relationship.patient.id == user.id:
                return Journaling.objects.filter(patient__id=user.id)

        elif user.role == RoleChoices.therapist:
            patient_ids = Relationship.objects.filter(
                therapist=user
            ).values_list("patient", flat=True)
            return Journaling.objects.filter(patient__in=patient_ids)

    def create(self, request):
        user = self.request.user

        if user.role == RoleChoices.patient:
            permitted_activity = AllowedActivity.objects.filter(
                relationship__patient=user,
                activity_type=ActivityChoices.journaling,
            )
            if not permitted_activity.exists():
                return Response(
                    {
                        "detail": "Você não tem permissão para criar este Journaling."  # noqa: E501
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().create(request)
