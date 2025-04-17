from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from core.tests.factories.allowed_activity_factory import AllowedActivityFactory
from core.tests.factories.relationship_factory import RelationshipFactory
from core.models.allowed_activity import AllowedActivity
from activities.models import ActivityChoices


class AllowedActivityAPITest(APITestCase):
    def setUp(self):
        self.allowed_activity = AllowedActivityFactory()
        self.other_allowed_activity = AllowedActivityFactory()

    # ROTA GET
    def test_list_allowed_activity_with_therapist(self):
        AllowedActivityFactory(
            relationship=RelationshipFactory(
                therapist=self.allowed_activity.relationship.therapist
            )
        )
        self.client.force_authenticate(
            user=self.allowed_activity.relationship.therapist
        )
        url = reverse("allowedactivity-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(
            str(self.allowed_activity.relationship.id),
            str(response.data[0]["relationship"]),
        )
        self.assertEqual(len(response.data), 2)

    def test_list_allowed_activity_with_patient(self):
        AllowedActivityFactory(
            relationship=RelationshipFactory(
                patient=self.allowed_activity.relationship.patient
            )
        )
        self.client.force_authenticate(user=self.allowed_activity.relationship.patient)
        url = reverse("allowedactivity-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(
            str(self.allowed_activity.relationship.id),
            str(response.data[0]["relationship"]),
        )
        self.assertEqual(len(response.data), 2)

    def test_list_allowed_activity_with_patient_with_is_allowed_false(self):
        AllowedActivityFactory(
            relationship=RelationshipFactory(
                patient=self.allowed_activity.relationship.patient
            ),
            is_allowed=False,
        )
        self.client.force_authenticate(user=self.allowed_activity.relationship.patient)
        url = reverse("allowedactivity-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(
            str(self.allowed_activity.relationship.id),
            str(response.data[0]["relationship"]),
        )
        self.assertEqual(len(response.data), 1)

    def test_list_allowed_activity_without_login(self):
        url = reverse("allowedactivity-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ROTA POST
    def test_create_allowed_activity_with_therapist(self):
        new_relationship = RelationshipFactory()
        self.client.force_authenticate(user=new_relationship.therapist)
        data = {
            "relationship": new_relationship.id,
            "activity_type": ActivityChoices.journaling,
        }
        url = reverse("allowedactivity-list")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response.data)
        self.assertEqual(AllowedActivity.objects.count(), 3)
        self.assertEqual(
            AllowedActivity.objects.get(
                relationship__id=new_relationship.id
            ).relationship.therapist,
            new_relationship.therapist,
        )

    def test_create_allowed_activity_with_other_therapist(self):
        new_relationship = RelationshipFactory()
        self.client.force_authenticate(
            user=self.allowed_activity.relationship.therapist
        )
        data = {
            "relationship": new_relationship.id,
            "activity_type": ActivityChoices.journaling,
        }
        url = reverse("allowedactivity-list")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_allowed_activity_with_patient(self):
        new_relationship = RelationshipFactory()
        self.client.force_authenticate(user=new_relationship.patient)
        data = {
            "relationship": new_relationship.id,
            "activity_type": ActivityChoices.journaling,
        }
        url = reverse("allowedactivity-list")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_allowed_activity_without_login(self):
        new_relationship = RelationshipFactory()
        data = {
            "relationship": new_relationship.id,
            "activity_type": ActivityChoices.journaling,
        }
        url = reverse("allowedactivity-list")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ROTA PUT
    def test_update_allowed_activity_with_therapist(self):
        self.client.force_authenticate(
            user=self.allowed_activity.relationship.therapist
        )
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "relationship": self.allowed_activity.relationship.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": False,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.allowed_activity.refresh_from_db()
        self.assertFalse(self.allowed_activity.is_allowed)

    def test_update_allowed_activity_with_other_therapist(self):
        other_therapist = RelationshipFactory().therapist
        self.client.force_authenticate(user=other_therapist)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "relationship": self.allowed_activity.relationship.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_allowed_activity_with_patient(self):
        self.client.force_authenticate(user=self.allowed_activity.relationship.patient)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "relationship": self.allowed_activity.relationship.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_allowed_activity_without_login(self):
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "relationship": self.allowed_activity.relationship.id,
            "activity_type": ActivityChoices.journaling,
            "is_allowed": True,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ROTA PATCH
    def test_partial_update_allowed_activity_with_therapist(self):
        self.client.force_authenticate(
            user=self.allowed_activity.relationship.therapist
        )
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "is_allowed": False,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.allowed_activity.refresh_from_db()
        self.assertFalse(self.allowed_activity.is_allowed)

    def test_partial_update_allowed_activity_with_other_therapist(self):
        other_therapist = RelationshipFactory().therapist
        self.client.force_authenticate(user=other_therapist)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "is_allowed": True,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_allowed_activity_with_patient(self):
        self.client.force_authenticate(user=self.allowed_activity.relationship.patient)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "is_allowed": True,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_allowed_activity_without_login(self):
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        data = {
            "is_allowed": True,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ROTA DELETE

    def test_destroy_allowed_activity_with_therapist(self):
        self.client.force_authenticate(
            user=self.allowed_activity.relationship.therapist
        )
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            AllowedActivity.objects.filter(id=self.allowed_activity.id).exists()
        )

    def test_destroy_allowed_activity_with_other_therapist(self):
        other_therapist = RelationshipFactory().therapist
        self.client.force_authenticate(user=other_therapist)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            AllowedActivity.objects.filter(id=self.allowed_activity.id).exists()
        )

    def test_destroy_allowed_activity_with_patient(self):
        self.client.force_authenticate(user=self.allowed_activity.relationship.patient)
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            AllowedActivity.objects.filter(id=self.allowed_activity.id).exists()
        )

    def test_destroy_allowed_activity_without_login(self):
        url = reverse("allowedactivity-detail", args=[self.allowed_activity.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(
            AllowedActivity.objects.filter(id=self.allowed_activity.id).exists()
        )
