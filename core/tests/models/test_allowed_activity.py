from django.test import TestCase

from core.models.allowed_activity import AllowedActivity
from core.models.user import User


class AllowedActivityModelTest(TestCase):

    def setUp(self):
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
        self.allowed_activiy = AllowedActivity.objects.create(
            therapist=self.therapist,
            patient=self.patient,
            activity_type="journaling"
        )
    
    def test_allowed_activity_string(self):
        self.assertEqual(
            str(self.allowed_activiy),
            f"{self.therapist.email} -> {self.patient.email} | journaling"
        )
