from django.test import TestCase
from activities.journaling.serializers import JournalingSerializer
from core.models.user import User


class JournalingSerializerTests(TestCase):
    def setUp(self):
        self.patient = User.objects.create_user(
            name="test user",
            email="email@email.com",
            password="testpassword",
            role="patient"
        )

    def test_journaling_serializer_valid_data(self):
        """Test journaling serializer with valid data"""
        data = {
            "title": "Daily Reflection",
            "patient": str(self.patient.id),
            "resume": "A brief summary of the day.",
            "date": "2023-10-10",
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
        self.assertTrue(serializer.is_valid())
        journaling = serializer.save()
        self.assertEqual(journaling.title, data["title"])
        self.assertEqual(journaling.situation, data["situation"])

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
