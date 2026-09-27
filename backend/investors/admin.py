from django.contrib import admin
from .models import InvestorProfile, InvestorDocument

@admin.register(InvestorProfile)
class InvestorProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'investor_type', 'ticket_min', 'ticket_max', 'verification_status', 'created_at')
    list_filter = ('verification_status', 'investor_type', 'country')
    search_fields = ('company_name', 'user__email', 'description')

@admin.register(InvestorDocument)
class InvestorDocumentAdmin(admin.ModelAdmin):
    list_display = ('investor', 'document_type', 'file_name', 'status', 'created_at')
    list_filter = ('status', 'document_type')
