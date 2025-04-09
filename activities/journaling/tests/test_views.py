from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from activities.journaling.models import Journaling
from core.models import User

class JournalingAPITests(APITestCase):

    def setUp(self):
        """Set up a user and a journaling entry for testing"""
        self.user = User.objects.create_user(
            name='Test User',
            email='user@example.com',
            password='testpass123',
            role='therapist'
        )
        self.journaling = Journaling.objects.create(
            title='Daily Reflection',
            situation='Faced a challenging situation at work.',
            emotions='Felt anxious and stressed.',
            thoughts='I might not be able to handle this.',
            body_feelings='Tense muscles and headache.',
            behavior='Avoided the task.',
            consequences='Felt guilty for not completing the task.',
            evidence_favorable='I have handled similar situations before.',
            evidence_unfavorable='This situation is different and more complex.',
            alternative_thoughts='I can break the task into smaller steps.',
            alternative_behaviors='Start with a small part of the task.',
            date='2023-10-10'
        )
        self.client.force_authenticate(user=self.user)

    def test_list_journaling_entries(self):
        """Test listing journaling entries"""
        url = reverse('journaling-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.journaling.title)

    def test_create_journaling_entry(self):
        """Test creating a new journaling entry"""
        url = reverse('journaling-list')
        data = {
            'title': 'New Reflection',
            'situation': 'Faced a new challenge.',
            'emotions': 'Felt excited and nervous.',
            'thoughts': 'I can handle this.',
            'body_feelings': 'Butterflies in the stomach.',
            'behavior': 'Took on the challenge.',
            'consequences': 'Felt accomplished.',
            'evidence_favorable': 'I have succeeded in similar tasks.',
            'evidence_unfavorable': 'This task is slightly different.',
            'alternative_thoughts': 'I can learn from this experience.',
            'alternative_behaviors': 'Approach the task step by step.',
            'date': '2023-10-11'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Journaling.objects.count(), 2)

    def test_update_journaling_entry(self):
        """Test updating an existing journaling entry"""
        url = reverse('journaling-detail', args=[self.journaling.id])
        data = {'title': 'Updated Reflection'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.journaling.refresh_from_db()
        self.assertEqual(self.journaling.title, 'Updated Reflection')

    def test_delete_journaling_entry(self):
        """Test deleting a journaling entry"""
        url = reverse('journaling-detail', args=[self.journaling.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Journaling.objects.count(), 0)
