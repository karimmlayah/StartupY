from django.urls import path
from .views import HealthCheckView, ChatView, AdminDashboardSummaryView

urlpatterns = [
    path('health', HealthCheckView.as_view(), name='api_health_noslash'),
    path('health/', HealthCheckView.as_view(), name='api_health'),
    path('chat', ChatView.as_view(), name='api_chat_noslash'),
    path('chat/', ChatView.as_view(), name='api_chat'),
    path('ai/guide', ChatView.as_view(), name='api_ai_guide_noslash'),
    path('ai/guide/', ChatView.as_view(), name='api_ai_guide'),
    path('admin/dashboard/', AdminDashboardSummaryView.as_view(), name='api_admin_dashboard'),
]
