from django.test import TestCase
from django.core.exceptions import ValidationError
from core.models import User

class UserModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email is successful"""
        email = 'test@example.com'
        password = 'Testpass123'
        user = User.objects.create_user(
            email=email,
            password=password,
            role='therapist'
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_create_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@EXAMPLE.COM'
        user = User.objects.create_user(email, 'test123', role='therapist')

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with invalid email raises error"""
        with self.assertRaises(ValueError):
            User.objects.create_user(None, 'test123', role='therapist')
            
        with self.assertRaises(ValidationError):
            user = User(email='invalid-email', password='test123', role='therapist')
            user.full_clean()

    def test_create_new_superuser(self):
        """Test creating a new superuser"""
        user = User.objects.create_superuser(
            'super@example.com',
            'test123'
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_user_str(self):
        """Test the user string representation"""
        user = User.objects.create_user(
            email='test@example.com',
            password='test123',
            role='therapist'
        )

        self.assertEqual(str(user), user.email)
