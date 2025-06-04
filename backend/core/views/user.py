from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.models.relationship import Relationship
from core.models.user import RoleChoices, User
from core.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.role == RoleChoices.therapist:
            return User.objects.filter(role=RoleChoices.patient)
        else:
            raise PermissionDenied()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def list_patients(self, request):
        """
        Lista todos os pacientes para terapeutas.
        """
        if request.user.role != RoleChoices.therapist:
            raise PermissionDenied("Apenas terapeutas podem listar pacientes")

        relationships = Relationship.objects.filter(therapist=request.user.id)
        patients_ids = relationships.values_list("patient_id", flat=True)
        queryset = User.objects.filter(id__in=patients_ids)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def search(self, request):
        """
        Busca pacientes por email ou nome.
        Apenas terapeutas podem usar esta funcionalidade.
        """
        if request.user.role != RoleChoices.therapist:
            raise PermissionDenied("Apenas terapeutas podem buscar pacientes")

        # Obtém os parâmetros de busca
        email = request.query_params.get("email", "").strip()
        name = request.query_params.get("name", "").strip()
        query = request.query_params.get("q", "").strip()  # Busca geral

        if not email and not name and not query:
            return Response(
                {
                    "detail": "É necessário fornecer pelo menos um parâmetro de busca (email, name ou q)"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Excluir apenas pacientes que já são do terapeuta atual
        patients_of_current_therapist = Relationship.objects.filter(
            therapist=request.user
        ).values_list("patient_id", flat=True)

        queryset = User.objects.filter(role=RoleChoices.patient).exclude(
            id__in=patients_of_current_therapist
        )

        if query:
            # Busca geral por nome ou email
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(email__icontains=query)
            )
        else:
            # Busca específica
            filters = Q()
            if email:
                filters |= Q(email__icontains=email)
            if name:
                filters |= Q(name__icontains=name)
            queryset = queryset.filter(filters)

        # Limita os resultados para evitar sobrecarga
        queryset = queryset[:20]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if pk is None or str(request.user.id) == pk:
            user = request.user
        else:
            if request.user.role != RoleChoices.therapist:
                raise PermissionDenied()

            user = User.objects.filter(pk=pk).first()
            if not user:
                return Response(
                    {"detail": "User not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if user.role != RoleChoices.patient:
                raise PermissionDenied()

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        if str(request.user.id) != pk:
            raise PermissionDenied

        user = User.objects.filter(pk=pk).first()

        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, pk=None):
        if str(request.user.id) != pk:
            raise PermissionDenied

        user = User.objects.filter(pk=pk).first()
        user.delete()
        return Response({"detail": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
