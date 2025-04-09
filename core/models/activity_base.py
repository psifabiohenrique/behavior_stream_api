from django.db import models

class ActivityBase(models.Model):
    title = models.CharField(max_length=255)
    resume = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.title
