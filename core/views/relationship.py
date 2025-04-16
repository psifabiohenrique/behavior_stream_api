from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed

from core.models import Relationship
from core.models.user import RoleChoices
from core.serializers import RelationshipSerializer


class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        if self.request.user.role == RoleChoices.therapist:
            queryset = self.queryset.filter(therapist_id=self.request.user.id)
            return queryset
        elif self.request.user.role == RoleChoices.patient:
            queryset = self.queryset.filter(patient_id=self.request.user.id)
            return queryset

    def create(self, request, *args, **kwargs):
        if self.request.user.role == RoleChoices.therapist:
            return super().create(request, *args, **kwargs)
        else:
            raise PermissionDenied()

    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT/PATCH not allowed.")

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT/PATCH not allowed.")
