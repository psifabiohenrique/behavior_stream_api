from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

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

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
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
        return Response(
            {"detail": "User deleted"}, status=status.HTTP_204_NO_CONTENT
        )
