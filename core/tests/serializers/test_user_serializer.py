from django.test import TestCase
from core.serializers import UserSerializer


class UserSerializerTests(TestCase):
    def test_user_serializer_valid_data(self):
        """Test user serializer with valid data"""
        data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "testpass123",
            "role": "therapist",
            "is_active": True,
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, data["email"])
        self.assertTrue(user.check_password(data["password"]))

    def test_user_serializer_invalid_email(self):
        """Test user serializer with invalid email"""
        data = {
            "name": "Test User",
            "email": "not-an-email",
            "password": "testpass123",
            "role": "therapist",
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_user_serializer_invalid_role(self):
        """Test user serializer with invalid role"""
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123",
            "role": "invalid_role",
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("role", serializer.errors)

    def test_user_serializer_empty_name(self):
        """Test user serializer with empty name"""
        data = {
            "name": "",
            "email": "test@example.com",
            "password": "testpass123",
            "role": "therapist",
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)
