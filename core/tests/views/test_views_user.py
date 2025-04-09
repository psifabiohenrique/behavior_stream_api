from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User

class UserAPITests(APITestCase):

    def setUp(self):
        """Set up a user for testing"""
        self.user = User.objects.create_user(
            name='Test User',
            email='testuser@example.com',
            password='testpass123',
            role='therapist'
        )
        self.client.force_authenticate(user=self.user)

    def test_list_users(self):
        """Test listing users"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('testuser@example.com', response.data[0]['email'])

    def test_create_user(self):
        """Test creating a new user"""
        url = reverse('user-list')
        data = {
            'name': 'New User',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'role': 'patient'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(email='newuser@example.com').role, 'patient')

    def test_update_user(self):
        """Test updating an existing user"""
        url = reverse('user-detail', args=[self.user.id])
        data = {'role': 'patient'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'patient')

    def test_delete_user(self):
        """Test deleting a user"""
        url = reverse('user-detail', args=[self.user.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 0)
