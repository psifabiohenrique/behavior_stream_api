from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


from core.models import Relationship
from core.serializers import RelationshipSerializer


class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [IsAuthenticated]
