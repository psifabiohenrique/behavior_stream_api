from django.db import models
from .user import User, RoleChoices


class AllowedActivity(models.Model):
    therapist = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="allowed_activities_therapist",
        limit_choices_to={"role": RoleChoices.therapist},
    )
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="allowed_activities_patient",
        limit_choices_to={"role": RoleChoices.patient},
    )
    activity_type = models.CharField(
        max_length=50,
        choices=[
            ("journaling", "Journaling"),
        ],
    )
    is_allowed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (RoleChoices.therapist, RoleChoices.patient, "activity_type")

    def __str__(self):
        return f"{self.therapist.email} -> {self.patient.email} | {self.activity_type}"
