from rest_framework import serializers

from .models import Journaling


class JournalingSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Journaling
        fields = [
            "id",
            "title",
            "resume",
            "date",
            "patient",
            "is_active",
            "situation",
            "emotions",
            "thoughts",
            "body_feelings",
            "behavior",
            "consequences",
            "evidence_favorable",
            "evidence_unfavorable",
            "alternative_thoughts",
            "alternative_behaviors",
        ]
        read_only_fields = ["id", "is_active"]

    def create(self, validated_data):
        validated_data["patient"] = self.context["request"].user
        return Journaling.objects.create(**validated_data)
