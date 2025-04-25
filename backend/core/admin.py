from django.contrib import admin
from .models.allowed_activity import AllowedActivity

@admin.register(AllowedActivity)
class AllowedActivityAdmin(admin.ModelAdmin):
    list_display = ('relationship__therapist', 'relationship__patient', 'activity_type', 'is_allowed')
    list_filter = ('relationship__therapist', 'relationship__patient', 'activity_type')
    search_fields = ('relationship__therapist__email', 'relationship__patient__email')
