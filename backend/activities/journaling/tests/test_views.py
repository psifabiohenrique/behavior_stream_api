from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from core.models.user import RoleChoices
from core.tests.factories import (
    UserFactory,
    RelationshipFactory,
    AllowedActivityFactory,
)
from activities.models import ActivityChoices
from .journaling_factory import JournalingFactory


class JournalingViewSetTestCase(APITestCase):
    def setUp(self):
        # Usuários
        self.therapist = UserFactory(role=RoleChoices.therapist)
        self.patient = UserFactory(role=RoleChoices.patient)
        self.other_patient = UserFactory(role=RoleChoices.patient)

        # Relacionamentos
        self.relationship = RelationshipFactory(
            therapist=self.therapist, patient=self.patient
        )

        # Permissão para o journaling original
        self.allowed_activity = AllowedActivityFactory(
            relationship=self.relationship, activity_type=ActivityChoices.journaling
        )

        # Journaling que o paciente criou
        self.journaling = JournalingFactory(patient=self.patient)

        # Journaling que o outro paciente criou
        self.other_journaling = JournalingFactory(
            patient=self.other_patient
        )

    def test_patient_can_list_only_permitted_journalings(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get(reverse("journaling-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [item["id"] for item in response.data]
        self.assertIn(self.journaling.id, ids)
        self.assertNotIn(self.other_journaling.id, ids)

    def test_therapist_can_list_journalings_of_their_patients(self):
        self.client.force_authenticate(user=self.therapist)
        response = self.client.get(reverse("journaling-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [item["id"] for item in response.data]
        self.assertIn(self.journaling.id, ids)
        self.assertNotIn(self.other_journaling.id, ids)

    def test_patient_cannot_access_journaling_without_permission(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.other_journaling.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_therapist_cannot_access_journaling_of_unrelated_patient(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse("journaling-detail", args=[self.other_journaling.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patient_can_retrieve_journaling_with_permission(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.journaling.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.journaling.id)

    def test_therapist_can_retrieve_journaling_of_their_patient(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse("journaling-detail", args=[self.journaling.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.journaling.id)

    def test_patient_can_create_journaling(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-list")
        data = {
            "title": "Novo registro",
            "content": "Algum conteúdo aqui",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response.data)
        self.assertEqual(response.data["patient"], self.patient.id)

    def test_patient_can_update_own_journaling(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.journaling.id])
        data = {"title": "Atualizado"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Atualizado")

    def test_patient_cannot_update_other_journaling(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.other_journaling.id])
        data = {"title": "Tentativa inválida"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_therapist_can_update_journaling_of_their_patient(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse("journaling-detail", args=[self.journaling.id])
        data = {"title": "Alteração permitida"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Alteração permitida")

    def test_therapist_cannot_update_journaling_of_unrelated_patient(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse("journaling-detail", args=[self.other_journaling.id])
        data = {"title": "Alteração indevida"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patient_can_delete_own_journaling(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.journaling.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_patient_cannot_delete_others_journaling(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("journaling-detail", args=[self.other_journaling.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
