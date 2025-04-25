import factory

from core.models.allowed_activity import AllowedActivity
from core.tests.factories.relationship_factory import RelationshipFactory
from activities.models import ActivityChoices


class AllowedActivityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AllowedActivity

    relationship = factory.SubFactory(RelationshipFactory)
    activity_type = ActivityChoices.journaling
