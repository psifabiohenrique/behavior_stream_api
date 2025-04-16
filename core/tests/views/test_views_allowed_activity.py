from rest_framework import status
from rest_framework.test import APITestCase

from core.tests.factories.allowed_activity_factory import AllowedActivityFactory


class AllowedActivityAPITest(APITestCase):
    def setTup(self):
        self.allowed_activity = AllowedActivityFactory()
        
