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
    activity_label = serializers.SerializerMethodField()
    activity_description = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()
    
    class Meta:
        model = AllowedActivity
        fields = [
            "id", 
            "relationship", 
            "activity_type", 
            "activity_label",
            "activity_description",
            "is_allowed", 
            "created_at",
            "patient_name",
            "patient_email"
        ]
        read_only_fields = ("created_at", "activity_label", "activity_description", "patient_name", "patient_email")

    def get_activity_label(self, obj):
        """Retorna o label legível da atividade"""
        return obj.get_activity_type_display()

    def get_activity_description(self, obj):
        """Retorna descrição da atividade"""
        from activities.models import ActivityChoices
        descriptions = {
            ActivityChoices.journaling: "Registro de pensamentos, emoções e comportamentos para análise funcional"
        }
        return descriptions.get(obj.activity_type, "Atividade terapêutica")

    def get_patient_name(self, obj):
        """Retorna o nome do paciente"""
        return obj.relationship.patient.name

    def get_patient_email(self, obj):
        """Retorna o email do paciente"""
        return obj.relationship.patient.email
