from core.models.allowed_activity import AllowedActivity
from core.models.relationship import Relationship
from core.models.user import RoleChoices
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from activities.models import ActivityChoices

from .models import Journaling
from .serializers import JournalingSerializer


class JournalingViewSet(viewsets.ModelViewSet):
    queryset = Journaling.objects.all()
    serializer_class = JournalingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == RoleChoices.patient:
            permitted_user = AllowedActivity.objects.get(relationship__patient=user)
            if permitted_user.relationship.patient.id == user.id:
                return Journaling.objects.filter(patient__id=user.id)

        elif user.role == RoleChoices.therapist:
            patient_ids = Relationship.objects.filter(therapist=user).values_list(
                "patient", flat=True
            )
            return Journaling.objects.filter(patient__in=patient_ids)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def get_journaling_by_patient(self, request):
        patient_id = request.query_params.get("patient_id")
        if not patient_id:
            return Response({"error": "Patient ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if user.role == RoleChoices.therapist:
            patient_ids = Relationship.objects.filter(therapist=user).values_list("patient", flat=True)
            if int(patient_id) not in patient_ids:
                print(f"Patient id: {patient_id}")
                print(f"Patients ids: {list(patient_ids)}")
                return Response({"error": "Unauthorized access to patient data."}, status=status.HTTP_403_FORBIDDEN)
            
        journaling_data = Journaling.objects.filter(patient_id=patient_id)
        serializer = self.get_serializer(journaling_data, many=True)
        return Response(serializer.data)


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
