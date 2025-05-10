from django.db import models

from core.models.activity_base import ActivityBase


class Journaling(ActivityBase):
    situation = models.TextField(blank=True, null=True)
    emotions = models.TextField(blank=True, null=True)
    thoughts = models.TextField(blank=True, null=True)
    body_feelings = models.TextField(blank=True, null=True)
    behavior = models.TextField(blank=True, null=True)
    consequences = models.TextField(blank=True, null=True)
    evidence_favorable = models.TextField(blank=True, null=True)
    evidence_unfavorable = models.TextField(blank=True, null=True)
    alternative_thoughts = models.TextField(blank=True, null=True)
    alternative_behaviors = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
