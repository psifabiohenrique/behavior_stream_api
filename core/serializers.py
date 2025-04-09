from rest_framework import serializers
from .models import User, Relationship

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'email', 'role', 'is_active']

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ['id', 'therapist', 'patient', 'created_at', 'updated_at']
