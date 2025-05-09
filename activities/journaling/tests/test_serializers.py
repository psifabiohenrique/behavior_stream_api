from django.test import TestCase
from activities.journaling.serializers import JournalingSerializer
from core.models.user import User, RoleChoices


class JournalingSerializerTests(TestCase):
    def setUp(self):
        self.patient = User.objects.create_user(
            name="test user",
            email="email@email.com",
            password="testpassword",
            role=RoleChoices.patient,
        )

    def test_journaling_serializer_invalid_title(self):
        """Test journaling serializer with invalid data"""
        data = {
            "title": "",
            "resume": "A brief summary of the day.",
            "date": "not-a-date",
            "situation": "Faced a challenging situation at work.",
            "emotions": "Felt anxious and stressed.",
            "thoughts": "I might not be able to handle this.",
            "body_feelings": "Tense muscles and headache.",
            "behavior": "Avoided the task.",
            "consequences": "Felt guilty for not completing the task.",
            "evidence_favorable": "I have handled similar situations before.",
            "evidence_unfavorable": "This situation is different and more complex.",
            "alternative_thoughts": "I can break the task into smaller steps.",
            "alternative_behaviors": "Start with a small part of the task.",
        }
        serializer = JournalingSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)
        self.assertIn("date", serializer.errors)
