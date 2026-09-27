import uuid
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Startup, StartupProgress, MeetingRequest, Interest
from .serializers import (
    StartupSerializer, 
    StartupReviewSerializer, 
    StartupProgressSerializer, 
    MeetingRequestSerializer, 
    InterestSerializer
)
from accounts.permissions import IsAdminUserRole, IsStartupRole, IsOwnerOrAdmin

class StartupMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            startup = Startup.objects.get(owner=request.user)
            serializer = StartupSerializer(startup)
            return Response(serializer.data)
        except Startup.DoesNotExist:
            return Response(None, status=status.HTTP_200_OK)

    def put(self, request):
        return self._save(request)

    def post(self, request):
        return self._save(request)

    def _save(self, request):
        startup, created = Startup.objects.get_or_create(owner=request.user)
        # Map frontend payload fields if necessary
        data = request.data.copy()
        if 'fundingNeeded' in data:
            val = str(data['fundingNeeded']).replace('TND', '').replace(',', '').strip()
            data['funding_needed'] = int(val) if val.isdigit() else 0
        if 'legalStatus' in data:
            data['legal_status'] = data['legalStatus']
        if 'fundingTypeSought' in data:
            data['funding_type'] = data['fundingTypeSought']
        if 'registeredInTunisia' in data:
            data['registration_status'] = data['registeredInTunisia']
        if 'governorate' in data:
            data['location'] = data['governorate']

        serializer = StartupSerializer(startup, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        saved = serializer.save()
        return Response(StartupSerializer(saved).data, status=status.HTTP_200_OK)


class StartupListView(generics.ListAPIView):
    serializer_class = StartupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Startup.objects.all()

        if user.role == 'admin' or user.is_staff:
            pass # Admin sees all
        elif user.role == 'investor':
            # Investors see approved or investor-visible startups
            queryset = queryset.filter(
                Q(publication_status='approved') | Q(investor_visible=True)
            )
        else:
            # Other roles only see approved or their own
            queryset = queryset.filter(
                Q(publication_status='approved') | Q(owner=user)
            )

        # Filters
        sector = self.request.query_params.get('sector')
        if sector and sector != 'All':
            queryset = queryset.filter(sector__icontains=sector)

        governorate = self.request.query_params.get('governorate')
        if governorate and governorate != 'All':
            queryset = queryset.filter(location__icontains=governorate)

        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            queryset = queryset.filter(publication_status=status_param)

        return queryset


class StartupDetailView(generics.RetrieveAPIView):
    serializer_class = StartupSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Startup.objects.all()
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.role == 'admin' or user.is_staff or obj.owner == user:
            return obj
        if obj.publication_status == 'approved' or obj.investor_visible:
            return obj
        self.permission_denied(self.request, message="Startup profile is not published or visible.")


class StartupReviewView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, id):
        startup = get_object_or_404(Startup, id=id)
        serializer = StartupReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        startup.publication_status = serializer.validated_data['publication_status']
        if 'reviewer_feedback' in serializer.validated_data:
            startup.reviewer_feedback = serializer.validated_data['reviewer_feedback']
        if 'investor_visible' in serializer.validated_data:
            startup.investor_visible = serializer.validated_data['investor_visible']
        elif startup.publication_status == 'approved':
            startup.investor_visible = True
            
        startup.save()
        return Response(StartupSerializer(startup).data)


class StartupProgressListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        startup_id = request.query_params.get('startup_id')
        if not startup_id:
            try:
                startup = Startup.objects.get(owner=request.user)
                startup_id = startup.id
            except Startup.DoesNotExist:
                return Response([])
        steps = StartupProgress.objects.filter(startup_id=startup_id).order_by('roadmap_step')
        return Response(StartupProgressSerializer(steps, many=True).data)

    def post(self, request):
        try:
            startup = Startup.objects.get(owner=request.user)
        except Startup.DoesNotExist:
            return Response({'error': 'Startup profile does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        step_num = request.data.get('roadmap_step')
        progress, _ = StartupProgress.objects.get_or_create(startup=startup, roadmap_step=step_num)
        serializer = StartupProgressSerializer(progress, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class MeetingRequestListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = self.request.user
        queryset = MeetingRequest.objects.all().order_by('scheduled_at')

        if user.role == 'admin':
            pass
        elif user.role == 'startup':
            queryset = queryset.filter(startup__owner=user)
        elif user.role == 'investor':
            queryset = queryset.filter(investor__user=user)

        serializer = MeetingRequestSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        if not data.get('room_id'):
            data['room_id'] = f"bidaya_meeting_{uuid.uuid4().hex[:12]}"
        serializer = MeetingRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        saved = serializer.save()
        return Response(MeetingRequestSerializer(saved).data, status=status.HTTP_201_CREATED)


class MeetingRequestDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MeetingRequest.objects.all()
    serializer_class = MeetingRequestSerializer
    lookup_field = 'id'


class InterestListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = self.request.user
        queryset = Interest.objects.all().order_by('-created_at')

        if user.role == 'admin':
            pass
        elif user.role == 'startup':
            queryset = queryset.filter(startup__owner=user)
        elif user.role == 'investor':
            queryset = queryset.filter(investor__user=user)

        return Response(InterestSerializer(queryset, many=True).data)

    def post(self, request):
        startup_id = request.data.get('startup_id') or request.data.get('startup')
        investor_id = request.data.get('investor_id') or request.data.get('investor')
        
        interest, created = Interest.objects.get_or_create(
            startup_id=startup_id,
            investor_id=investor_id,
            defaults={'status': request.data.get('status', 'interested')}
        )
        if not created and 'status' in request.data:
            interest.status = request.data['status']
            interest.save()
        return Response(InterestSerializer(interest).data)
