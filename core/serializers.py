from rest_framework import serializers
from .models.user import User, RoleChoices
from .models.relationship import Relationship
from .models.allowed_activity import AllowedActivity


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "password", "is_active"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = self.Meta.model(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["id", RoleChoices.therapist, RoleChoices.patient, "created_at", "updated_at"]


class AllowedActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AllowedActivity
        fields = "__all__"
        read_only_fields = ("created_at",)
