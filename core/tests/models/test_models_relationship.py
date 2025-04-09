from django.test import TestCase
from core.models import User, Relationship

class RelationshipModelTests(TestCase):

    def setUp(self):
        """Set up users for testing relationships"""
        self.therapist = User.objects.create_user(
            name='Test Therapist',
            email='therapist@example.com',
            password='testpass123',
            role='therapist'
        )
        self.patient = User.objects.create_user(
            name='Test Patient',
            email='patient@example.com',
            password='testpass123',
            role='patient'
        )

    def test_create_relationship_successful(self):
        """Test creating a new relationship is successful"""
        relationship = Relationship.objects.create(
            therapist=self.therapist,
            patient=self.patient
        )

        self.assertEqual(relationship.therapist, self.therapist)
        self.assertEqual(relationship.patient, self.patient)
        self.assertIsNotNone(relationship.created_at)
        self.assertIsNotNone(relationship.updated_at)

    def test_relationship_str(self):
        """Test the relationship string representation"""
        relationship = Relationship.objects.create(
            therapist=self.therapist,
            patient=self.patient
        )

        expected_str = f"{self.therapist.email} - {self.patient.email}"
        self.assertEqual(str(relationship), expected_str)
