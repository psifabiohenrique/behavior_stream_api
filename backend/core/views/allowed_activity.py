from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
