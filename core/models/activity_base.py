from django.db import models
from .user import User


class ActivityBase(models.Model):
    title = models.CharField(max_length=255)
    resume = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    patient = models.ForeignKey(
        User,
        related_name="patient_activities",
        on_delete=models.CASCADE,
        limit_choices_to={"role": "patient"}
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.title} - {self.date}"
