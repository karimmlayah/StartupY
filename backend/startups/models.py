from django.db import models
from django.conf import settings
import uuid

class Startup(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('building', 'Building'),
        ('ready_for_review', 'Ready for Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('visible', 'Visible'),
        ('archived', 'Archived'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='startup_profile'
    )
    name = models.CharField(max_length=255, default='My Startup')
    description = models.TextField(blank=True, default='')
    pitch = models.TextField(blank=True, default='')
    sector = models.CharField(max_length=100, blank=True, default='')
    stage = models.CharField(max_length=50, blank=True, default='Idea')
    location = models.CharField(max_length=100, blank=True, default='Tunis')
    website = models.CharField(max_length=255, blank=True, default='')
    problem = models.TextField(blank=True, default='')
    solution = models.TextField(blank=True, default='')
    business_model = models.TextField(blank=True, default='')
    funding_needed = models.BigIntegerField(default=0)  # in TND
    funding_type = models.CharField(max_length=100, blank=True, default='Equity')
    legal_status = models.CharField(max_length=100, blank=True, default='SARL')
    registration_status = models.CharField(max_length=50, blank=True, default='Yes')
    team = models.JSONField(default=list, blank=True)
    readiness_score = models.IntegerField(default=0)
    publication_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    investor_visible = models.BooleanField(default=False)
    reviewer_feedback = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-readiness_score', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.publication_status})"


class StartupProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='progress_steps')
    roadmap_step = models.IntegerField()
    step_title = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=50, default='in_progress')
    deliverables = models.JSONField(default=dict, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('startup', 'roadmap_step')
        ordering = ['roadmap_step']


class Interest(models.Model):
    STATUS_CHOICES = (
        ('interested', 'Interested'),
        ('reviewing', 'Reviewing'),
        ('connected', 'Connected'),
        ('passed', 'Passed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='interests')
    investor = models.ForeignKey('investors.InvestorProfile', on_delete=models.CASCADE, related_name='interests')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='interested')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('startup', 'investor')
        ordering = ['-created_at']


class MeetingRequest(models.Model):
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='meeting_requests')
    investor = models.ForeignKey('investors.InvestorProfile', on_delete=models.CASCADE, related_name='meeting_requests')
    requested_by = models.CharField(max_length=20, default='startup')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    agenda = models.TextField(blank=True, default='')
    room_id = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='requested')
    outcome_status = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_at']
