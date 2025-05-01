from django.contrib import admin

from .models.allowed_activity import AllowedActivity
from .models.relationship import Relationship
from .models.user import User


@admin.register(AllowedActivity)
class AllowedActivityAdmin(admin.ModelAdmin):
    list_display = (
        "relationship__therapist",
        "relationship__patient",
        "activity_type",
        "is_allowed",
    )
    list_filter = (
        "relationship__therapist",
        "relationship__patient",
        "activity_type",
    )
    search_fields = (
        "relationship__therapist__email",
        "relationship__patient__email",
    )


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "role", "name")
    list_filter = ("role", "name")
    search_fields = ("name",)


@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ("therapist", "patient")
    list_filter = ("therapist", "patient")
    search_fields = ("therapist", "patient")
