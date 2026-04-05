from django.urls import path
from . import api_views

urlpatterns = [
    # Auth
    path('auth/csrf/', api_views.csrf_token, name='api_csrf'),
    path('auth/login/', api_views.api_login, name='api_login'),
    path('auth/logout/', api_views.api_logout, name='api_logout'),
    path('auth/register/', api_views.api_register, name='api_register'),
    path('auth/me/', api_views.api_me, name='api_me'),

    # Workshops
    path('workshops/', api_views.api_workshops, name='api_workshops'),
    path('workshops/propose/', api_views.api_propose_workshop, name='api_propose_workshop'),
    path('workshops/<int:workshop_id>/', api_views.api_workshop_detail, name='api_workshop_detail'),
    path('workshops/<int:workshop_id>/accept/', api_views.api_accept_workshop, name='api_accept_workshop'),
    path('workshops/<int:workshop_id>/change-date/', api_views.api_change_workshop_date, name='api_change_date'),
    path('workshops/<int:workshop_id>/comments/', api_views.api_add_comment, name='api_add_comment'),

    # Workshop Types
    path('workshop-types/', api_views.api_workshop_types, name='api_workshop_types'),
    path('workshop-types/<int:workshop_type_id>/', api_views.api_workshop_type_detail, name='api_workshop_type_detail'),
    path('workshop-types/<int:workshop_type_id>/tnc/', api_views.api_workshop_type_tnc, name='api_workshop_type_tnc'),

    # Profile
    path('profile/', api_views.api_own_profile, name='api_own_profile'),
    path('profile/<int:user_id>/', api_views.api_view_profile, name='api_view_profile'),

    # Choices (for form dropdowns)
    path('choices/', api_views.api_choices, name='api_choices'),
]
