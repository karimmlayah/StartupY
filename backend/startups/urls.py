from django.urls import path
from .views import (
    StartupMeView,
    StartupListView,
    StartupDetailView,
    StartupReviewView,
    StartupProgressListView,
    MeetingRequestListCreateView,
    MeetingRequestDetailView,
    InterestListCreateView,
)

urlpatterns = [
    path('me/', StartupMeView.as_view(), name='startup_me'),
    path('', StartupListView.as_view(), name='startup_list'),
    path('<uuid:id>/', StartupDetailView.as_view(), name='startup_detail'),
    path('<uuid:id>/review/', StartupReviewView.as_view(), name='startup_review'),
    path('progress/', StartupProgressListView.as_view(), name='startup_progress'),
    path('meetings/', MeetingRequestListCreateView.as_view(), name='meetings_list_create'),
    path('meetings/<uuid:id>/', MeetingRequestDetailView.as_view(), name='meetings_detail'),
    path('interests/', InterestListCreateView.as_view(), name='interests_list_create'),
]
