import factory
from core.models.user import RoleChoices
from activities.journaling.models import Journaling


class JournalingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Journaling

    # Journaling model fields
    situation = factory.Faker("paragraph")
    emotions = factory.Faker("paragraph")
    thoughts = factory.Faker("paragraph")
    body_feelings = factory.Faker("paragraph")
    behavior = factory.Faker("paragraph")
    consequences = factory.Faker("paragraph")
    evidence_favorable = factory.Faker("paragraph")
    evidence_unfavorable = factory.Faker("paragraph")
    alternative_thoughts = factory.Faker("paragraph")
    alternative_behaviors = factory.Faker("paragraph")

    # Activity base fields
    title = factory.Faker("sentence", nb_words=4)
    resume = factory.Faker("paragraph")
    date = factory.Faker("date_this_year")
    patient = factory.SubFactory("core.tests.factories.UserFactory", role=RoleChoices.patient)
    is_active = True
