from rest_framework import status
from rest_framework.test import APITestCase

from core.models.user import User, RoleChoices
from core.models.allowed_activity import AllowedActivity
from core.models.relationship import Relationship
from activities.models import ActivityChoices


class AllowedActivityAPITest(APITestCase):
    def setTup(self):
        self.therapist = User.objects.create_user(
            name="Test Therapist",
            email="therapist@example.com",
            password="testpass123",
            role=RoleChoices.therapist,
        )
        self.patient = User.objects.create_user(
            name="Test Patient",
            email="patient@example.com",
            password="testpass123",
            role=RoleChoices.patient,
        )
        self.relationship = Relationship.objects.create(
            therapist = self.therapist,
            patient = self.patient,
        )
        self.allowed_activity = AllowedActivity.objects.create(
            relationship = self.relationship,
            activity_type = ActivityChoices.journaling
        )
