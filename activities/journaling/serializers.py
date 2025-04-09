from rest_framework import serializers
from .models import Journaling


class JournalingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journaling
        fields = [
            "id",
            "title",
            "resume",
            "date",
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
