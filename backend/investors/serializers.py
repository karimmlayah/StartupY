from rest_framework import serializers
from .models import InvestorProfile, InvestorDocument
from accounts.serializers import UserSerializer

class InvestorProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    # Field aliases for frontend compatibility
    name = serializers.CharField(source='company_name', required=False)
    organization_name = serializers.CharField(source='company_name', required=False)
    type = serializers.CharField(source='investor_type', required=False)
    focus = serializers.ListField(source='sectors', required=False)
    stages = serializers.ListField(source='investment_stage', required=False)
    governorates = serializers.ListField(source='preferred_governorates', required=False)
    investmentTypes = serializers.ListField(source='investment_types', required=False)
    budgetRange = serializers.SerializerMethodField()
    ticket_min_tnd = serializers.IntegerField(source='ticket_min', required=False)
    ticket_max_tnd = serializers.IntegerField(source='ticket_max', required=False)
    verificationStatus = serializers.CharField(source='verification_status', required=False)

    class Meta:
        model = InvestorProfile
        fields = [
            'id', 'user', 'user_details', 'company_name', 'name', 'organization_name',
            'investor_type', 'type', 'investment_stage', 'stages',
            'sectors', 'focus', 'ticket_min', 'ticket_min_tnd',
            'ticket_max', 'ticket_max_tnd', 'budgetRange',
            'country', 'preferred_governorates', 'governorates',
            'investment_types', 'investmentTypes', 'description',
            'verification_status', 'verificationStatus', 'verification_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_details', 'created_at', 'updated_at']

    def get_budgetRange(self, obj):
        return f"{obj.ticket_min:,} - {obj.ticket_max:,} TND"

class InvestorReviewSerializer(serializers.Serializer):
    verification_status = serializers.ChoiceField(choices=InvestorProfile.VERIFICATION_CHOICES)
    verification_notes = serializers.CharField(required=False, allow_blank=True)

class InvestorDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorDocument
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
