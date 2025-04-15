from django.test import TestCase
from core.models.user import User, RoleChoices
from core.serializers import RelationshipSerializer


class RelationshipSerializerTests(TestCase):
    def setUp(self):
        self.therapist = User.objects.create_user(
            name=RoleChoices.therapist,
            email="therapist@example.com",
            password="testpass123",
            role=RoleChoices.therapist,
        )
        self.patient = User.objects.create_user(
            name=RoleChoices.patient,
            email="patient@example.com",
            password="testpass123",
            role=RoleChoices.patient,
        )

    def test_relationship_serializer_valid_data(self):
        data = {
            RoleChoices.therapist: self.therapist.id,
            RoleChoices.patient: self.patient.id,
        }
        serializer = RelationshipSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        relationship = serializer.save()
        self.assertEqual(relationship.therapist, self.therapist)
        self.assertEqual(relationship.patient, self.patient)

    def test_relationship_serializer_invalid_data(self):
        data = {
            RoleChoices.therapist: self.patient.id,  # Invalid role
            RoleChoices.patient: self.therapist.id,  # Invalid role
        }
        serializer = RelationshipSerializer(data=data)
        self.assertFalse(serializer.is_valid())
