from django.db import models


class ActivityChoices(models.TextChoices):
    journaling = "journaling", "Journaling"