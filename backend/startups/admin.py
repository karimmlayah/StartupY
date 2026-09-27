from django.contrib import admin
from .models import Startup, StartupProgress, Interest, MeetingRequest

@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'sector', 'stage', 'location', 'readiness_score', 'publication_status', 'investor_visible')
    list_filter = ('publication_status', 'investor_visible', 'sector', 'stage', 'location')
    search_fields = ('name', 'description', 'pitch', 'owner__email')
    ordering = ('-readiness_score', '-created_at')

@admin.register(StartupProgress)
class StartupProgressAdmin(admin.ModelAdmin):
    list_display = ('startup', 'roadmap_step', 'step_title', 'status', 'updated_at')
    list_filter = ('status', 'roadmap_step')

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('startup', 'investor', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(MeetingRequest)
class MeetingRequestAdmin(admin.ModelAdmin):
    list_display = ('startup', 'investor', 'scheduled_at', 'duration_minutes', 'status', 'room_id')
    list_filter = ('status',)
