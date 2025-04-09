from django.db import models

from .user import User

class Relationship(models.Model):
    therapist = models.ForeignKey(User, related_name='therapist_relationships', on_delete=models.CASCADE, limit_choices_to={'role': 'therapist'})
    patient = models.ForeignKey(User, related_name='patient_relationships', on_delete=models.CASCADE, limit_choices_to={'role': 'patient'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.therapist.email} - {self.patient.email}"
