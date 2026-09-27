from django.urls import path
from .views import (
    InvestorProfileMeView,
    InvestorListView,
    InvestorDetailView,
    InvestorVerifyView,
    InvestorDocumentListView,
)

urlpatterns = [
    path('profile/', InvestorProfileMeView.as_view(), name='investor_profile_me'),
    path('', InvestorListView.as_view(), name='investor_list'),
    path('<uuid:id>/', InvestorDetailView.as_view(), name='investor_detail'),
    path('<uuid:id>/verify/', InvestorVerifyView.as_view(), name='investor_verify'),
    path('documents/', InvestorDocumentListView.as_view(), name='investor_documents'),
]
