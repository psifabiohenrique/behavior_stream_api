from django.test import TestCase

from core.tests.factories.allowed_activity_factory import AllowedActivityFactory


class AllowedActivityModelTest(TestCase):
    def setUp(self):
        self.allowed_activity = AllowedActivityFactory()

    def test_allowed_activity_string(self):
        self.assertEqual(
            str(self.allowed_activity),
            f"{self.allowed_activity.relationship.therapist.email} -> {self.allowed_activity.relationship.patient.email} | journaling",
        )
