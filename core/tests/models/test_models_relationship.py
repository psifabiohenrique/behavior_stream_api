from django.test import TestCase

from core.models.user import RoleChoices
from core.models import Relationship
from core.tests.factories.user_factory import UserFactory


class RelationshipModelTests(TestCase):
    def setUp(self):
        self.therapist = UserFactory(role=RoleChoices.therapist)
        self.patient = UserFactory(role=RoleChoices.patient)

    def test_create_relationship_successful(self):
        relationship = Relationship.objects.create(
            therapist=self.therapist, patient=self.patient
        )

        self.assertEqual(relationship.therapist, self.therapist)
        self.assertEqual(relationship.patient, self.patient)
        self.assertIsNotNone(relationship.created_at)
        self.assertIsNotNone(relationship.updated_at)

    def test_relationship_str(self):
        relationship = Relationship.objects.create(
            therapist=self.therapist, patient=self.patient
        )

        expected_str = f"{self.therapist.email} - {self.patient.email}"
        self.assertEqual(str(relationship), expected_str)
