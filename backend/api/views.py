from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from startups.models import Startup, MeetingRequest, Interest
from investors.models import InvestorProfile
from startups.serializers import StartupSerializer
from investors.serializers import InvestorProfileSerializer
from accounts.serializers import UserSerializer
from accounts.permissions import IsAdminUserRole
from services.rag_service import generate_rag_response
import os

User = get_user_model()

class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'status': 'ok',
            'service': 'StartupY Django Backend',
            'database': 'PostgreSQL' if 'postgresql' in str(request.GET.get('db', '')) or os.getenv('DB_NAME') else 'Active',
            'jwtAuth': True,
            'qdrantRAG': True,
            'ragConfigured': bool(os.getenv('NVIDIA_API_KEY') or os.getenv('GROQ_API_KEY') or os.getenv('GEMINI_API_KEY'))
        })


class ChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = (request.data.get('message') or request.data.get('question') or '').strip()
        if not message:
            return Response({'error': 'Message or question is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine user role for contextualized RAG
        role = request.data.get('role', 'startup')
        if hasattr(request.user, 'role') and request.user.is_authenticated:
            role = request.user.role

        try:
            result = generate_rag_response(role=role, question=message)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    'error': f'Failed to process RAG query: {str(e)}',
                    'answer': 'An error occurred while connecting to the vector database or language model. Please try again.',
                    'sources': []
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminDashboardSummaryView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        startups = Startup.objects.all().order_by('-created_at')
        investors = InvestorProfile.objects.all().order_by('-created_at')
        meetings = MeetingRequest.objects.all().order_by('-created_at')
        interests = Interest.objects.all().order_by('-created_at')

        return Response({
            'profiles': [{
                'id': str(u.id),
                'email': u.email,
                'full_name': u.full_name,
                'name': u.full_name,
                'role': u.role,
                'joined': u.date_joined,
                'is_active': u.is_active,
                'is_staff': u.is_staff
            } for u in users],
            'startups': StartupSerializer(startups, many=True).data,
            'investors': InvestorProfileSerializer(investors, many=True).data,
            'meetings': [{
                'id': str(m.id),
                'startupId': str(m.startup.id),
                'startupName': m.startup.name,
                'investorId': str(m.investor.id),
                'investorName': m.investor.company_name,
                'scheduledAt': m.scheduled_at,
                'durationMinutes': m.duration_minutes,
                'status': m.status,
                'roomId': m.room_id,
            } for m in meetings],
            'interests': [{
                'id': str(i.id),
                'startupId': str(i.startup.id),
                'startupName': i.startup.name,
                'investorId': str(i.investor.id),
                'investorName': i.investor.company_name,
                'status': i.status,
                'createdAt': i.created_at,
            } for i in interests],
            'logs': [{
                'id': f"log_{idx}",
                'actorName': 'System/Admin',
                'action': 'System Activity',
                'entityType': 'Audit',
                'entityName': 'StartupY Platform',
                'createdAt': u.date_joined
            } for idx, u in enumerate(users[:10])]
        })
