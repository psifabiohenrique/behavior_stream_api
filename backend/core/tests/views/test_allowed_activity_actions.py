from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from activities.models import ActivityChoices
from core.models.allowed_activity import AllowedActivity
from core.models.relationship import Relationship
from core.tests.factories import UserFactory, RelationshipFactory, AllowedActivityFactory
from core.models.user import RoleChoices


class AllowedActivityActionsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.therapist = UserFactory(role=RoleChoices.therapist)
        self.patient = UserFactory(role=RoleChoices.patient)
        self.relationship = RelationshipFactory(
            therapist=self.therapist,
            patient=self.patient
        )

    def test_by_patient_action_success(self):
        """Test retrieving allowed activities by patient"""
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-by-patient")
        response = self.client.get(url, {"patient_id": self.patient.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_by_patient_action_creates_default_activities(self):
        """Test that default activities are created when none exist"""
        self.client.force_authenticate(user=self.therapist)
        
        # Ensure no activities exist
        AllowedActivity.objects.filter(relationship=self.relationship).delete()
        
        url = reverse("allowedactivity-by-patient")
        response = self.client.get(url, {"patient_id": self.patient.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that default activities were created
        activities = AllowedActivity.objects.filter(relationship=self.relationship)
        self.assertTrue(activities.exists())
        
        # Check that all activity types are represented
        activity_types = activities.values_list('activity_type', flat=True)
        for choice in ActivityChoices.choices:
            self.assertIn(choice[0], activity_types)

    def test_by_patient_action_without_patient_id(self):
        """Test by_patient action without patient_id parameter"""
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-by-patient")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("patient_id", response.data["detail"])

    def test_by_patient_action_with_patient_role(self):
        """Test by_patient action with patient role (should fail)"""
        self.client.force_authenticate(user=self.patient)
        
        url = reverse("allowedactivity-by-patient")
        response = self.client.get(url, {"patient_id": self.patient.id})
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_by_patient_action_nonexistent_relationship(self):
        """Test by_patient action with non-existent relationship"""
        other_patient = UserFactory(role=RoleChoices.patient)
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-by-patient")
        response = self.client.get(url, {"patient_id": other_patient.id})
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_toggle_activity_success(self):
        """Test successfully toggling an activity"""
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-toggle-activity")
        data = {
            "patient_id": self.patient.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True
        }
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that the activity was created/updated
        activity = AllowedActivity.objects.get(
            relationship=self.relationship,
            activity_type=ActivityChoices.journaling
        )
        self.assertTrue(activity.is_allowed)

    def test_toggle_activity_update_existing(self):
        """Test toggling an existing activity"""
        # Create an existing activity
        activity = AllowedActivityFactory(
            relationship=self.relationship,
            activity_type=ActivityChoices.journaling,
            is_allowed=False
        )
        
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-toggle-activity")
        data = {
            "patient_id": self.patient.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True
        }
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that the activity was updated
        activity.refresh_from_db()
        self.assertTrue(activity.is_allowed)

    def test_toggle_activity_missing_parameters(self):
        """Test toggle_activity with missing parameters"""
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-toggle-activity")
        data = {
            "patient_id": self.patient.id,
            # Missing activity_type and is_allowed
        }
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_toggle_activity_with_patient_role(self):
        """Test toggle_activity with patient role (should fail)"""
        self.client.force_authenticate(user=self.patient)
        
        url = reverse("allowedactivity-toggle-activity")
        data = {
            "patient_id": self.patient.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True
        }
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_available_activities_action(self):
        """Test retrieving available activities"""
        self.client.force_authenticate(user=self.therapist)
        
        url = reverse("allowedactivity-available-activities")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        
        # Check that all activities are included
        self.assertEqual(len(response.data), len(ActivityChoices.choices))
        
        # Check structure of response
        for activity in response.data:
            self.assertIn("value", activity)
            self.assertIn("label", activity)
            self.assertIn("description", activity)

    def test_available_activities_with_patient_role(self):
        """Test available_activities with patient role"""
        self.client.force_authenticate(user=self.patient)
        
        url = reverse("allowedactivity-available-activities")
        response = self.client.get(url)
        
        # This should work for patients too
        self.assertEqual(response.status_code, status.HTTP_200_OK)