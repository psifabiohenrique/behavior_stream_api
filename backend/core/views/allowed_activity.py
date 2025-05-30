from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from activities.models import ActivityChoices
from core.models.user import RoleChoices
from core.models.allowed_activity import AllowedActivity
from core.models.relationship import Relationship
from core.serializers import AllowedActivitySerializer


class AllowedActivityViewSet(viewsets.ModelViewSet):
    queryset = AllowedActivity.objects.all()
    serializer_class = AllowedActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == RoleChoices.patient:
            return AllowedActivity.objects.filter(
                relationship__patient=user, is_allowed=True
            )
        elif user.role == RoleChoices.therapist:
            return AllowedActivity.objects.filter(relationship__therapist=user)
        else:
            return AllowedActivity.objects.none()

    @action(detail=False, methods=["get"])
    def by_patient(self, request):
        """
        Retorna as atividades permitidas para um paciente específico.
        Apenas terapeutas podem usar esta funcionalidade.
        """
        if request.user.role != RoleChoices.therapist:
            raise PermissionDenied(
                "Apenas terapeutas podem acessar esta funcionalidade"
            )

        patient_id = request.query_params.get("patient_id")
        if not patient_id:
            return Response(
                {"detail": "É necessário fornecer o patient_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verificar se existe relacionamento entre terapeuta e paciente
            relationship = Relationship.objects.get(
                therapist=request.user, patient_id=patient_id
            )
        except Relationship.DoesNotExist:
            return Response(
                {"detail": "Relacionamento não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Buscar atividades permitidas para este relacionamento
        allowed_activities = AllowedActivity.objects.filter(relationship=relationship)

        # Se não existem atividades permitidas, criar as padrões
        if not allowed_activities.exists():
            self._create_default_activities(relationship)
            allowed_activities = AllowedActivity.objects.filter(
                relationship=relationship
            )

        serializer = self.get_serializer(allowed_activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def toggle_activity(self, request):
        """
        Alterna o status de uma atividade (permitida/não permitida).
        Apenas terapeutas podem usar esta funcionalidade.
        """
        if request.user.role != RoleChoices.therapist:
            raise PermissionDenied(
                "Apenas terapeutas podem alterar permissões de atividades"
            )

        patient_id = request.data.get("patient_id")
        activity_type = request.data.get("activity_type")
        is_allowed = request.data.get("is_allowed")

        if not all([patient_id, activity_type, is_allowed is not None]):
            return Response(
                {
                    "detail": "É necessário fornecer patient_id, activity_type e is_allowed"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verificar se existe relacionamento entre terapeuta e paciente
            relationship = Relationship.objects.get(
                therapist=request.user, patient_id=patient_id
            )
        except Relationship.DoesNotExist:
            return Response(
                {"detail": "Relacionamento não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Buscar ou criar a atividade permitida
        allowed_activity, created = AllowedActivity.objects.get_or_create(
            relationship=relationship,
            activity_type=activity_type,
            defaults={"is_allowed": is_allowed},
        )

        if not created:
            allowed_activity.is_allowed = is_allowed
            allowed_activity.save()

        serializer = self.get_serializer(allowed_activity)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def available_activities(self, request):
        """
        Retorna todas as atividades disponíveis no sistema.
        """
        activities = [
            {
                "value": choice[0],
                "label": choice[1],
                "description": self._get_activity_description(choice[0]),
            }
            for choice in ActivityChoices.choices
        ]
        return Response(activities)

    def _create_default_activities(self, relationship):
        """Cria atividades padrão para um novo relacionamento"""
        for activity_choice in ActivityChoices.choices:
            AllowedActivity.objects.get_or_create(
                relationship=relationship,
                activity_type=activity_choice[0],
                defaults={
                    "is_allowed": False
                },  # Por padrão, atividades não são permitidas
            )

    def _get_activity_description(self, activity_type):
        """Retorna descrição da atividade"""
        descriptions = {
            ActivityChoices.journaling: "Registro de pensamentos, emoções e comportamentos para análise funcional"
        }
        return descriptions.get(activity_type, "Atividade terapêutica")

    def create(self, request, *args, **kwargs):
        therapist_id = Relationship.objects.get(
            id=request.data["relationship"]
        ).therapist.id
        if request.user.id != therapist_id:
            raise PermissionDenied()
        return super().create(request, *args, **kwargs)

    def update(self, request, pk=None, *args, **kwargs):
        allowed_activity = AllowedActivity.objects.filter(id=pk).first()
        therapist_id = allowed_activity.relationship.therapist.id
        if request.user.id != therapist_id:
            raise PermissionDenied()
        serializer = self.get_serializer(
            allowed_activity, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def partial_update(self, request, pk=None, *args, **kwargs):
        allowed_activity = AllowedActivity.objects.filter(id=pk).first()
        therapist_id = allowed_activity.relationship.therapist.id
        if request.user.id != therapist_id:
            raise PermissionDenied()
        serializer = self.get_serializer(
            allowed_activity, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        allowed_activity = AllowedActivity.objects.filter(id=pk).first()
        therapist_id = allowed_activity.relationship.therapist.id
        if request.user.id != therapist_id:
            raise PermissionDenied()
        allowed_activity.delete()
        return Response({"detail": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
