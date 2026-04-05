from django.urls import path
from . import api_views

urlpatterns = [
    path('public/', api_views.api_public_stats, name='api_public_stats'),
    path('public/download/', api_views.api_public_stats_download, name='api_public_stats_download'),
    path('workshop-types/', api_views.api_workshop_type_list, name='api_stats_workshop_types'),
]
