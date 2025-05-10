from django.contrib import admin

from .journaling.models import Journaling

admin.site.register(Journaling)


class JournalingAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "relationship")
    list_filter = ("title", "date", "relationship")
    search_fields = ("title", "date", "relationship", "resume", "emotion")
