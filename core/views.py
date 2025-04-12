from rest_framework import viewsets


from .models import User, Relationship
from .serializers import (
    UserSerializer,
    RelationshipSerializer,
)
from .models.allowed_activity import AllowedActivity
from .serializers import AllowedActivitySerializer
from rest_framework.permissions import IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return User.objects.none()
        elif self.request.user.role == "therapist":
            return User.objects.filter(role="patient")
        else:
            return User.objects.none()


class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [IsAuthenticated]


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

