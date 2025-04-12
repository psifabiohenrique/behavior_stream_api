from django.contrib import admin
from .models.allowed_activity import AllowedActivity

@admin.register(AllowedActivity)
class AllowedActivityAdmin(admin.ModelAdmin):
    list_display = ('therapist', 'patient', 'activity_type', 'is_allowed')
    list_filter = ('therapist', 'patient', 'activity_type')
    search_fields = ('therapist__email', 'patient__email')
