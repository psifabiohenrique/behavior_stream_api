from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from core.models.user import User, RoleChoices
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
        return Response({'detail': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)

