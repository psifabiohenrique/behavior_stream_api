from rest_framework import exceptions, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Journaling
from .serializers import JournalingSerializer
from core.models.user import RoleChoices
from core.models.relationship import Relationship
from core.models.allowed_activity import AllowedActivity


class JournalingViewSet(viewsets.ModelViewSet):
    queryset = Journaling.objects.all()
    serializer_class = JournalingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == RoleChoices.patient:
            permitted_ids = AllowedActivity.objects.filter(
                relationship__patient=user
            ).values_list("id", flat=True)
            return Journaling.objects.filter(id__in=permitted_ids)

        elif user.role == RoleChoices.therapist:
            patient_ids = Relationship.objects.filter(therapist=user).values_list(
                "patient", flat=True
            )
            [print(i) for i in patient_ids]
            return Journaling.objects.filter(patient__in=patient_ids)

        raise exceptions.PermissionDenied()
