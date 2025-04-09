from django.test import TestCase
from core.models import User
from core.serializers import RelationshipSerializer


class RelationshipSerializerTests(TestCase):
    def setUp(self):
        """Set up users for testing relationships"""
        self.therapist = User.objects.create_user(
            name="Therapist",
            email="therapist@example.com",
            password="testpass123",
            role="therapist",
        )
        self.patient = User.objects.create_user(
            name="Patient",
            email="patient@example.com",
            password="testpass123",
            role="patient",
        )

    def test_relationship_serializer_valid_data(self):
        """Test relationship serializer with valid data"""
        data = {"therapist": self.therapist.id, "patient": self.patient.id}
        serializer = RelationshipSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        relationship = serializer.save()
        self.assertEqual(relationship.therapist, self.therapist)
        self.assertEqual(relationship.patient, self.patient)

    def test_relationship_serializer_invalid_data(self):
        """Test relationship serializer with invalid data"""
        data = {
            "therapist": self.patient.id,  # Invalid role
            "patient": self.therapist.id,  # Invalid role
        }
        serializer = RelationshipSerializer(data=data)
        self.assertFalse(serializer.is_valid())
