import factory
from django.contrib.auth import get_user_model
from core.models.user import RoleChoices

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)

    name = factory.Faker("name")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    role = RoleChoices.patient  
    raw_password = factory.LazyFunction(lambda: "testpass123")

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        raw_password = kwargs.pop("raw_password", "testpass123")
        obj = model_class(*args, **kwargs)
        obj.set_password(raw_password)
        obj.save()

        obj.raw_password = raw_password
        return obj
