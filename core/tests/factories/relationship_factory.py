import factory

from core.models import Relationship
from core.tests.factories.user_factory import UserFactory


class RelationshipFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Relationship

    therapist = factory.SubFactory(UserFactory, role="therapist")
    patient = factory.SubFactory(UserFactory, role="patient")
