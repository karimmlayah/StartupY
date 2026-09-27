from rest_framework import serializers
from .models import Startup, StartupProgress, Interest, MeetingRequest
from accounts.serializers import UserSerializer

class StartupSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    owner_id = serializers.UUIDField(source='owner.id', read_only=True)
    # Compatibility fields expected by frontend
    funding_needed_tnd = serializers.IntegerField(source='funding_needed', required=False)
    governorate = serializers.CharField(source='location', required=False)
    legalStatus = serializers.CharField(source='legal_status', required=False)
    fundingTypeSought = serializers.CharField(source='funding_type', required=False)
    registeredInTunisia = serializers.CharField(source='registration_status', required=False)
    readinessScore = serializers.IntegerField(source='readiness_score', required=False)
    publicationStatus = serializers.CharField(source='publication_status', required=False)
    investorVisible = serializers.BooleanField(source='investor_visible', required=False)

    class Meta:
        model = Startup
        fields = [
            'id', 'owner_id', 'owner_details', 'name', 'description', 'pitch',
            'sector', 'stage', 'location', 'governorate', 'website',
            'problem', 'solution', 'business_model',
            'funding_needed', 'funding_needed_tnd',
            'funding_type', 'fundingTypeSought',
            'legal_status', 'legalStatus',
            'registration_status', 'registeredInTunisia',
            'team', 'readiness_score', 'readinessScore',
            'publication_status', 'publicationStatus',
            'investor_visible', 'investorVisible',
            'reviewer_feedback', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner_id', 'owner_details', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['owner'] = request.user
        return super().create(validated_data)

class StartupReviewSerializer(serializers.Serializer):
    publication_status = serializers.ChoiceField(choices=Startup.STATUS_CHOICES)
    reviewer_feedback = serializers.CharField(required=False, allow_blank=True)
    investor_visible = serializers.BooleanField(required=False)

class StartupProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupProgress
        fields = '__all__'
        read_only_fields = ['id', 'startup']

class MeetingRequestSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.name', read_only=True)
    investor_name = serializers.CharField(source='investor.company_name', read_only=True)

    class Meta:
        model = MeetingRequest
        fields = [
            'id', 'startup', 'investor', 'startup_name', 'investor_name',
            'requested_by', 'scheduled_at', 'duration_minutes', 'agenda',
            'room_id', 'status', 'outcome_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'room_id', 'created_at', 'updated_at']

class InterestSerializer(serializers.ModelSerializer):
    startup_details = StartupSerializer(source='startup', read_only=True)

    class Meta:
        model = Interest
        fields = ['id', 'startup', 'investor', 'status', 'notes', 'startup_details', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
