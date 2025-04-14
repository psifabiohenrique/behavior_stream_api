from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User


class UserAPITests(APITestCase):
    def setUp(self):
        self.therapist = User.objects.create_user(
            name="Test User",
            email="testuser@example.com",
            password="testpass123",
            role="therapist",
        )
        self.patient = User.objects.create_user(
            name="Test User patient",
            email="testuserpatient@example.com",
            password="testpass123",
            role="patient",
        )
        self.client.force_authenticate(user=self.therapist)

    def test_list_users_with_therapist_authenticated_return_patient_list(self):
        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("testuserpatient@example.com", response.data[0]["email"])

    def test_list_users_with_patient_authenticated_return_forbidden(self):
        self.client.force_authenticate(user=self.patient)

        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_users_without_login_return_unauthorized(self):
        self.client.logout()

        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_patient(self):
        self.client.logout()

        url = reverse("user-list")
        data = {
            "name": "New User",
            "email": "newuser@example.com",
            "password": "newpass123",
            "role": "patient",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(
            User.objects.get(email="newuser@example.com").role, "patient"
        )

    def test_create_therapist(self):
        self.client.logout()

        url = reverse("user-list")
        data = {
            "name": "New User",
            "email": "newuser@example.com",
            "password": "newpass123",
            "role": "therapist",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(
            User.objects.get(email="newuser@example.com").role, "therapist"
        )

    def test_create_user_with_wrong_email_must_fail(self):
        self.client.logout()

        url = reverse("user-list")
        data = {
            "name": "New User",
            "email": "newuserexample.com",
            "password": "newpass123",
            "role": "patient",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 2)

    def test_update_user_therapist(self):
        url = reverse("user-detail", args=[self.therapist.id])
        data = {"role": "patient"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.therapist.refresh_from_db()
        self.assertEqual(self.therapist.role, "patient")

    def test_update_user_patient(self):
        self.client.force_authenticate(self.patient)
        url = reverse("user-detail", args=[self.patient.id])
        data = {"role": "therapist"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.patient.refresh_from_db()
        self.assertEqual(self.patient.role, "therapist")

    def test_update_wrong_user_return_forbidden(self):
        url = reverse("user-detail", args=[self.patient.id])
        data = {"role": "therapist"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.therapist.refresh_from_db()
        self.patient.refresh_from_db()
        self.assertEqual(self.therapist.role, "therapist")
        self.assertEqual(self.patient.role, "patient")

    def test_update_without_login_return_unauthorized(self):
        self.client.logout()
        url = reverse("user-detail", args=[self.patient.id])
        data = {"role": "therapist"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.patient.refresh_from_db()
        self.assertEqual(self.patient.role, "patient")

    def test_delete_user(self):
        url = reverse("user-detail", args=[self.therapist.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)

    def test_delete_other_user_return_forbidden(self):
        url = reverse("user-detail", args=[self.patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 2)

    def test_delete_user_withou_login_return_unauthorized(self):
        self.client.logout()

        url = reverse("user-detail", args=[self.patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(User.objects.count(), 2)