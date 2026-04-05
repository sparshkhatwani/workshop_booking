from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.middleware.csrf import get_token
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Profile, Workshop, WorkshopType, Comment, AttachmentFile
from .serializers import (
    UserSerializer, WorkshopListSerializer, WorkshopDetailSerializer,
    WorkshopTypeSerializer, CommentSerializer, AttachmentFileSerializer,
    ProfileSerializer, ChoicesSerializer,
)
from .send_mails import send_email, generate_activation_key


def is_instructor(user):
    return user.groups.filter(name='instructor').exists()


def is_email_checked(user):
    return hasattr(user, 'profile') and user.profile.is_email_verified


# ─── Auth endpoints ───────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    """Return CSRF token for the frontend."""
    return Response({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not is_email_checked(user):
        return Response(
            {'error': 'Email not verified. Please check your email.'},
            status=status.HTTP_403_FORBIDDEN
        )

    login(request, user)
    return Response({
        'message': 'Login successful.',
        'user': UserSerializer(user).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_me(request):
    """Return currently authenticated user."""
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    data = request.data
    required = [
        'username', 'email', 'password', 'confirm_password',
        'first_name', 'last_name', 'phone_number', 'institute',
        'department', 'state', 'title', 'location',
        'how_did_you_hear_about_us',
    ]
    errors = {}
    for field in required:
        if not data.get(field):
            errors[field] = [f'{field} is required.']

    if data.get('password') != data.get('confirm_password'):
        errors['confirm_password'] = ['Passwords do not match.']

    if User.objects.filter(username=data.get('username', '')).exists():
        errors['username'] = ['Username already exists.']

    if User.objects.filter(email=data.get('email', '')).exists():
        errors['email'] = ['Email already exists.']

    if errors:
        return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=data['username'].lower(),
        email=data['email'],
        password=data['password'],
    )
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.save()

    profile = Profile(user=user)
    profile.institute = data['institute']
    profile.department = data['department']
    profile.phone_number = data['phone_number']
    profile.location = data.get('location', '')
    profile.title = data.get('title', '')
    profile.state = data['state']
    profile.how_did_you_hear_about_us = data.get('how_did_you_hear_about_us', '')
    profile.activation_key = generate_activation_key(user.username)
    profile.key_expiry_time = timezone.now() + timezone.timedelta(days=1)
    profile.save()

    try:
        send_email(
            request, call_on='Registration',
            user_position=profile.position,
            key=profile.activation_key,
        )
    except Exception:
        pass  # Don't block registration if email fails

    return Response(
        {'message': 'Registration successful. Please check your email to verify your account.'},
        status=status.HTTP_201_CREATED
    )


# ─── Workshop endpoints ──────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_workshops(request):
    """List workshops based on user role."""
    user = request.user
    if is_instructor(user):
        today = timezone.now().date()
        workshops = Workshop.objects.filter(
            Q(instructor=user.id, date__gte=today) | Q(status=0)
        ).order_by('-date')
    else:
        workshops = Workshop.objects.filter(
            coordinator=user.id
        ).order_by('-date')

    serializer = WorkshopListSerializer(workshops, many=True)
    return Response({
        'workshops': serializer.data,
        'is_instructor': is_instructor(user),
        'today': str(timezone.now().date()),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_propose_workshop(request):
    """Coordinator proposes a new workshop."""
    user = request.user
    if is_instructor(user):
        return Response(
            {'error': 'Instructors cannot propose workshops.'},
            status=status.HTTP_403_FORBIDDEN
        )

    workshop_type_id = request.data.get('workshop_type')
    date = request.data.get('date')
    tnc_accepted = request.data.get('tnc_accepted', False)

    if not workshop_type_id or not date:
        return Response(
            {'error': 'Workshop type and date are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        workshop_type = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response(
            {'error': 'Invalid workshop type.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if Workshop.objects.filter(
        date=date, workshop_type=workshop_type, coordinator=user
    ).exists():
        return Response(
            {'error': 'You have already proposed this workshop on this date.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    workshop = Workshop.objects.create(
        coordinator=user,
        workshop_type=workshop_type,
        date=date,
        tnc_accepted=tnc_accepted,
    )

    return Response(
        {'message': 'Workshop proposed successfully.', 'id': workshop.id},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_workshop_detail(request, workshop_id):
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    if is_instructor(request.user):
        comments = Comment.objects.filter(workshop=workshop)
    else:
        comments = Comment.objects.filter(workshop=workshop, public=True)

    return Response({
        'workshop': WorkshopDetailSerializer(workshop).data,
        'comments': CommentSerializer(comments, many=True).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_accept_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can accept workshops.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    workshop.status = 1
    workshop.instructor = user
    workshop.save()

    return Response({'message': 'Workshop accepted successfully.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_change_workshop_date(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can change dates.'}, status=status.HTTP_403_FORBIDDEN)

    new_date = request.data.get('new_date')
    if not new_date:
        return Response({'error': 'New date is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    workshop.date = new_date
    workshop.save()

    return Response({'message': 'Workshop date updated successfully.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_add_comment(request, workshop_id):
    user = request.user
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    comment_text = request.data.get('comment')
    public = request.data.get('public', True)

    if not comment_text:
        return Response({'error': 'Comment text is required.'}, status=status.HTTP_400_BAD_REQUEST)

    comment = Comment.objects.create(
        author=user,
        comment=comment_text,
        public=public if is_instructor(user) else True,
        created_date=timezone.now(),
        workshop=workshop,
    )

    return Response({
        'message': 'Comment posted.',
        'comment': CommentSerializer(comment).data,
    }, status=status.HTTP_201_CREATED)


# ─── Workshop Type endpoints ─────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_types(request):
    types = WorkshopType.objects.all().order_by('id')
    return Response(WorkshopTypeSerializer(types, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_type_detail(request, workshop_type_id):
    try:
        wt = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response({'error': 'Workshop type not found.'}, status=status.HTTP_404_NOT_FOUND)

    attachments = AttachmentFile.objects.filter(workshop_type=wt)
    return Response({
        'workshop_type': WorkshopTypeSerializer(wt).data,
        'attachments': AttachmentFileSerializer(attachments, many=True).data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_type_tnc(request, workshop_type_id):
    try:
        wt = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'tnc': wt.terms_and_conditions})


# ─── Profile endpoints ───────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def api_own_profile(request):
    user = request.user
    profile = user.profile

    if request.method == 'GET':
        return Response({
            'user': UserSerializer(user).data,
        })

    # PUT — update profile
    data = request.data
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    user.save()

    profile_fields = [
        'title', 'institute', 'department', 'phone_number',
        'position', 'location', 'state',
    ]
    for field in profile_fields:
        if field in data:
            setattr(profile, field, data[field])
    profile.save()

    return Response({
        'message': 'Profile updated.',
        'user': UserSerializer(user).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_view_profile(request, user_id):
    if not is_instructor(request.user):
        return Response({'error': 'Only instructors can view other profiles.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    workshops = Workshop.objects.filter(coordinator=user_id).order_by('date')
    return Response({
        'user': UserSerializer(target_user).data,
        'workshops': WorkshopListSerializer(workshops, many=True).data,
    })


# ─── Choices endpoint (for form dropdowns) ───────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_choices(request):
    return Response({
        'states': ChoicesSerializer.states(),
        'departments': ChoicesSerializer.departments(),
        'titles': ChoicesSerializer.titles(),
        'sources': ChoicesSerializer.sources(),
        'positions': ChoicesSerializer.positions(),
    })
