from django.db import models
from django.conf import settings
import uuid

class InvestorProfile(models.Model):
    VERIFICATION_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('documents_required', 'Documents Required'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='investor_profile'
    )
    company_name = models.CharField(max_length=255, default='Independent Investor')
    investor_type = models.CharField(max_length=100, blank=True, default='Angel Investor')
    investment_stage = models.JSONField(default=list, blank=True)
    sectors = models.JSONField(default=list, blank=True)
    ticket_min = models.BigIntegerField(default=50000)  # in TND
    ticket_max = models.BigIntegerField(default=500000)  # in TND
    country = models.CharField(max_length=100, blank=True, default='Tunisia')
    preferred_governorates = models.JSONField(default=list, blank=True)
    investment_types = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True, default='')
    verification_status = models.CharField(
        max_length=30,
        choices=VERIFICATION_CHOICES,
        default='draft'
    )
    verification_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} ({self.verification_status})"


class InvestorDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100)
    file_name = models.CharField(max_length=255)
    file_url = models.CharField(max_length=500, blank=True, default='')
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
