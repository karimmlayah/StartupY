from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import InvestorProfile, InvestorDocument
from .serializers import (
    InvestorProfileSerializer, 
    InvestorReviewSerializer, 
    InvestorDocumentSerializer
)
from accounts.permissions import IsAdminUserRole

class InvestorProfileMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = InvestorProfile.objects.get(user=request.user)
            serializer = InvestorProfileSerializer(profile)
            return Response(serializer.data)
        except InvestorProfile.DoesNotExist:
            return Response(None, status=status.HTTP_200_OK)

    def put(self, request):
        return self._save(request)

    def post(self, request):
        return self._save(request)

    def _save(self, request):
        profile, created = InvestorProfile.objects.get_or_create(user=request.user)
        data = request.data.copy()

        # Handle frontend aliases
        if 'firm' in data or 'name' in data:
            data['company_name'] = data.get('firm') or data.get('name')
        if 'investorType' in data:
            data['investor_type'] = data.get('investorType')
        if 'preferredStage' in data:
            data['investment_stage'] = [data.get('preferredStage')]
        if 'preferredGovernorates' in data:
            data['preferred_governorates'] = data.get('preferredGovernorates')
        if 'investmentType' in data:
            data['investment_types'] = [data.get('investmentType')]

        # Ticket parsing
        if 'ticketSize' in data:
            import re
            numbers = [int(n.replace(',', '')) for n in re.findall(r'[\d,]+', str(data['ticketSize'])) if n.replace(',', '').isdigit()]
            if len(numbers) >= 2:
                data['ticket_min'] = numbers[0]
                data['ticket_max'] = numbers[1]
            elif len(numbers) == 1:
                data['ticket_min'] = numbers[0]
                data['ticket_max'] = numbers[0]

        serializer = InvestorProfileSerializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        saved = serializer.save()
        return Response(InvestorProfileSerializer(saved).data, status=status.HTTP_200_OK)


class InvestorListView(generics.ListAPIView):
    serializer_class = InvestorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff:
            return InvestorProfile.objects.all().order_by('-created_at')
        return InvestorProfile.objects.filter(verification_status='approved').order_by('-created_at')


class InvestorDetailView(generics.RetrieveAPIView):
    serializer_class = InvestorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = InvestorProfile.objects.all()
    lookup_field = 'id'


class InvestorVerifyView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, id):
        profile = get_object_or_404(InvestorProfile, id=id)
        serializer = InvestorReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile.verification_status = serializer.validated_data['verification_status']
        if 'verification_notes' in serializer.validated_data:
            profile.verification_notes = serializer.validated_data['verification_notes']
        profile.save()
        return Response(InvestorProfileSerializer(profile).data)


class InvestorDocumentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = InvestorProfile.objects.get(user=user)
            docs = InvestorDocument.objects.filter(investor=profile)
            return Response(InvestorDocumentSerializer(docs, many=True).data)
        except InvestorProfile.DoesNotExist:
            return Response([])

    def post(self, request):
        try:
            profile = InvestorProfile.objects.get(user=request.user)
        except InvestorProfile.DoesNotExist:
            return Response({'error': 'Investor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['investor'] = profile.id
        serializer = InvestorDocumentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
