from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User, Relationship


class RelationshipAPITests(APITestCase):
    def setUp(self):
        """Set up users and a relationship for testing"""
        self.therapist = User.objects.create_user(
            name="Test Therapist",
            email="therapist@example.com",
            password="testpass123",
            role="therapist",
        )
        self.patient = User.objects.create_user(
            name="Test Patient",
            email="patient@example.com",
            password="testpass123",
            role="patient",
        )
        self.relationship = Relationship.objects.create(
            therapist=self.therapist, patient=self.patient
        )
        self.client.force_authenticate(user=self.therapist)

    def test_list_relationships(self):
        """Test listing relationships"""
        url = reverse("relationship-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["therapist"], self.therapist.id)
        self.assertEqual(response.data[0]["patient"], self.patient.id)

    def test_create_relationship(self):
        """Test creating a new relationship"""
        new_patient = User.objects.create_user(
            name="Test Patient",
            email="newpatient@example.com",
            password="testpass123",
            role="patient",
        )
        url = reverse("relationship-list")
        data = {"therapist": self.therapist.id, "patient": new_patient.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Relationship.objects.count(), 2)

    def test_update_relationship(self):
        """Test updating an existing relationship"""
        new_therapist = User.objects.create_user(
            name="Test Therapist",
            email="newtherapist@example.com",
            password="testpass123",
            role="therapist",
        )
        url = reverse("relationship-detail", args=[self.relationship.id])
        data = {"therapist": new_therapist.id}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.relationship.refresh_from_db()
        self.assertEqual(self.relationship.therapist, new_therapist)

    def test_delete_relationship(self):
        """Test deleting a relationship"""
        # Create a new relationship to be deleted
        new_patient = User.objects.create_user(
            name="Test Patient 2",
            email="patient2@example.com", 
            password="testpass123",
            role="patient"
        )
        relationship_to_delete = Relationship.objects.create(
            therapist=self.therapist,
            patient=new_patient
        )
        
        # Verify we have 2 relationships before deletion
        self.assertEqual(Relationship.objects.count(), 2)
        
        url = reverse("relationship-detail", args=[relationship_to_delete.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify we now have 1 relationship after deletion
        self.assertEqual(Relationship.objects.count(), 1)
        # Verify the correct relationship was deleted
        self.assertFalse(Relationship.objects.filter(id=relationship_to_delete.id).exists())
