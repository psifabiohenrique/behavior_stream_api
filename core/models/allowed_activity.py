from django.db import models

from core.models.user import RoleChoices
from core.models.relationship import Relationship
from activities.models import ActivityChoices


class AllowedActivity(models.Model):
    relationship = models.ForeignKey(
        Relationship,
        related_name="therapist_x_patient_relationship",
        on_delete=models.CASCADE,
    )
    activity_type = models.CharField(
        max_length=50,
        choices=[
            ActivityChoices.choices,
        ],
        default=ActivityChoices.journaling,
    )
    is_allowed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (RoleChoices.therapist, RoleChoices.patient, "activity_type")

    def __str__(self):
        return f"{self.relationship.therapist.email} -> {self.relationship.patient.email} | {self.activity_type}"
