from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RelationshipViewSet, AllowedActivityViewSet
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
