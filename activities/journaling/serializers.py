from rest_framework import serializers

from .models import Journaling
from core.models.user import RoleChoices


class JournalingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journaling
        fields = [
            "id",
            "title",
            "resume",
            "date",
            RoleChoices.patient,
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
