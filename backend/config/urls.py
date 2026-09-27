from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/startups/', include('startups.urls')),
    path('api/investor/', include('investors.urls')),
    path('api/investors/', include('investors.urls')),
    path('api/', include('api.urls')),
]
