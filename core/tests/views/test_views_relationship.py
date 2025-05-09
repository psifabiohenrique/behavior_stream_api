from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models.user import RoleChoices
from core.models.relationship import Relationship
from core.tests.factories.relationship_factory import RelationshipFactory
from core.tests.factories.user_factory import UserFactory


class RelationshipAPITests(APITestCase):
    def setUp(self):
        self.therapist = UserFactory(role=RoleChoices.therapist)
        self.other_therapist = UserFactory(role=RoleChoices.therapist)
        self.patient = UserFactory(role=RoleChoices.patient)
        self.other_patient = UserFactory(role=RoleChoices.patient)

        self.relationship = RelationshipFactory(
            therapist=self.therapist, patient=self.patient
        )
        self.other_relationship = RelationshipFactory(
            therapist=self.other_therapist, patient=self.other_patient
        )

    def test_list_therapist_relationships(self):
        self.client.force_authenticate(user=self.therapist)

        url = reverse("relationship-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0][RoleChoices.therapist], self.therapist.id)
        self.assertEqual(response.data[0][RoleChoices.patient], self.patient.id)

    def test_list_patient_relationships(self):
        self.client.force_authenticate(user=self.patient)

        url = reverse("relationship-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0][RoleChoices.therapist], self.therapist.id)
        self.assertEqual(response.data[0][RoleChoices.patient], self.patient.id)

    def test_list_without_user_login(self):
        url = reverse("relationship-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_relationship(self):
        self.client.force_authenticate(user=self.therapist)
        new_patient = UserFactory(role=RoleChoices.patient)
        url = reverse("relationship-list")
        data = {
            RoleChoices.therapist: self.therapist.id,
            RoleChoices.patient: new_patient.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Relationship.objects.count(), 3)

    def test_create_relationship_by_patient(self):
        new_patient = UserFactory(role=RoleChoices.patient)
        self.client.force_authenticate(user=new_patient)
        url = reverse("relationship-list")
        data = {
            RoleChoices.therapist: self.therapist.id,
            RoleChoices.patient: new_patient.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Relationship.objects.count(), 2)

    def test_create_relationship_withou_login(self):
        new_patient = UserFactory(role=RoleChoices.patient)
        url = reverse("relationship-list")
        data = {
            RoleChoices.therapist: self.therapist.id,
            RoleChoices.patient: new_patient.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Relationship.objects.count(), 2)

    def test_partial_update_disabled(self):
        self.client.force_authenticate(user=self.therapist)

        new_patient = UserFactory(role=RoleChoices.patient)
        url = reverse("relationship-detail", args=[self.relationship.id])
        data = {RoleChoices.patient: new_patient.id}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_disabled(self):
        self.client.force_authenticate(user=self.therapist)

        new_patient = UserFactory(role=RoleChoices.patient)
        url = reverse("relationship-detail", args=[self.relationship.id])
        data = {
            RoleChoices.therapist: self.therapist.id,
            RoleChoices.patient: new_patient.id,
        }
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_relationship_by_therapist(self):
        self.client.force_authenticate(user=self.therapist)

        new_patient = UserFactory(role=RoleChoices.patient)
        relationship_to_delete = RelationshipFactory(
            therapist=self.therapist, patient=new_patient
        )

        # Verify we have 2 relationships before deletion
        self.assertEqual(Relationship.objects.count(), 3)

        url = reverse("relationship-detail", args=[relationship_to_delete.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify we now have 1 relationship after deletion
        self.assertEqual(Relationship.objects.count(), 2)
        # Verify the correct relationship was deleted
        self.assertFalse(
            Relationship.objects.filter(id=relationship_to_delete.id).exists()
        )

    def test_delete_relationship_by_patient(self):
        self.client.force_authenticate(user=self.patient)

        new_therapist = UserFactory(role=RoleChoices.therapist)
        relationship_to_delete = RelationshipFactory(
            therapist=new_therapist, patient=self.patient
        )

        self.assertEqual(Relationship.objects.count(), 3)

        url = reverse("relationship-detail", args=[relationship_to_delete.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Relationship.objects.count(), 2)
        self.assertFalse(
            Relationship.objects.filter(id=relationship_to_delete.id).exists()
        )

    def test_delete_relationship_withou_login(self):
        new_patient = UserFactory(role=RoleChoices.patient)
        relationship_to_delete = RelationshipFactory(
            therapist=self.therapist, patient=new_patient
        )

        self.assertEqual(Relationship.objects.count(), 3)

        url = reverse("relationship-detail", args=[relationship_to_delete.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Relationship.objects.count(), 3)
        self.assertTrue(
            Relationship.objects.filter(id=relationship_to_delete.id).exists()
        )
