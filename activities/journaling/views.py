from rest_framework import viewsets
from .models import Journaling
from .serializers import JournalingSerializer

class JournalingViewSet(viewsets.ModelViewSet):
    queryset = Journaling.objects.all()
    serializer_class = JournalingSerializer
