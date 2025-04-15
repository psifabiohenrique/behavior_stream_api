from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views.user import UserViewSet
from core.views.relationship import RelationshipViewSet
from core.views.allowed_activity import AllowedActivityViewSet
from activities.journaling.views import JournalingViewSet


router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"relationships", RelationshipViewSet)
router.register(r"allowed-activities", AllowedActivityViewSet)

# Viewsets para as atividades
router.register(r"activities/journaling", JournalingViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
