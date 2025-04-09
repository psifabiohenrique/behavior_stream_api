from django.test import TestCase
from activities.journaling.models import Journaling


class JournalingModelTests(TestCase):
    def test_create_journaling_successful(self):
        """Test creating a new journaling entry is successful"""
        title = "Daily Reflection"
        journaling = Journaling.objects.create(
            title=title,
            situation="Faced a challenging situation at work.",
            emotions="Felt anxious and stressed.",
            thoughts="I might not be able to handle this.",
            body_feelings="Tense muscles and headache.",
            behavior="Avoided the task.",
            consequences="Felt guilty for not completing the task.",
            evidence_favorable="I have handled similar situations before.",
            evidence_unfavorable="This situation is different and more complex.",
            alternative_thoughts="I can break the task into smaller steps.",
            alternative_behaviors="Start with a small part of the task.",
        )

        self.assertEqual(journaling.title, title)
        self.assertIsNotNone(journaling.created_at)
        self.assertIsNotNone(journaling.updated_at)

    def test_journaling_str(self):
        """Test the journaling string representation"""
        journaling = Journaling.objects.create(
            title="Daily Reflection",
            date="2023-10-10",
            situation="Faced a challenging situation at work.",
        )

        expected_str = f"{journaling.title} - {journaling.date}"
        self.assertEqual(str(journaling), expected_str)
