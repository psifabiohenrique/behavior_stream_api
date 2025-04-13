from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User

class UserAPITests(APITestCase):

    def setUp(self):
        """Set up a user for testing"""
        self.therapist = User.objects.create_user(
            name='Test User',
            email='testuser@example.com',
            password='testpass123',
            role='therapist'
        )
        self.patient =  User.objects.create_user(
            name='Test User patient',
            email='testuserpatient@example.com',
            password='testpass123',
            role='patient'
        )
        self.client.force_authenticate(user=self.therapist)

    def test_list_users_with_therapist_authenticated(self):
        """Test listing users"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('testuserpatient@example.com', response.data[0]['email'])

    def test_list_users_with_patient_authenticated(self):
        self.client.force_authenticate(user=self.patient)

        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_list_users_without_login(self):
        self.client.logout()

        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user(self):
        url = reverse('user-list')
        data = {
            'name': 'New User',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'role': 'patient'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.get(email='newuser@example.com').role, 'patient')

    def test_update_user(self):
        url = reverse('user-detail', args=[self.therapist.id])
        data = {'role': 'patient'}
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.therapist.refresh_from_db()
        self.assertEqual(self.therapist.role, 'patient')

    def test_delete_user(self):
        url = reverse('user-detail', args=[self.therapist.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)
