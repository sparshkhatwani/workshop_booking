from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, Workshop, WorkshopType, Comment,
    Testimonial, AttachmentFile,
    states, department_choices, title as title_choices,
    source, position_choices,
)


class ProfileSerializer(serializers.ModelSerializer):
    state_display = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'title', 'institute', 'department',
            'phone_number', 'position', 'location',
            'state', 'state_display', 'is_email_verified',
            'how_did_you_hear_about_us',
        ]

    def get_state_display(self, obj):
        states_map = dict(states)
        return states_map.get(obj.state, obj.state)


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    is_instructor = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name',
            'last_name', 'full_name', 'is_instructor', 'profile',
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_is_instructor(self, obj):
        return obj.groups.filter(name='instructor').exists()


class WorkshopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions']


class AttachmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentFile
        fields = ['id', 'attachments', 'workshop_type']


class WorkshopListSerializer(serializers.ModelSerializer):
    """Serializer for workshop list views (coordinator & instructor dashboards)."""
    coordinator_name = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    workshop_type_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    coordinator_institute = serializers.SerializerMethodField()
    coordinator_id = serializers.IntegerField(source='coordinator.id', read_only=True)

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'date', 'status', 'status_display',
            'tnc_accepted', 'workshop_type', 'workshop_type_name',
            'coordinator_id', 'coordinator_name', 'coordinator_institute',
            'instructor_name',
        ]

    def get_coordinator_name(self, obj):
        return obj.coordinator.get_full_name()

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name()
        return None

    def get_workshop_type_name(self, obj):
        return obj.workshop_type.name

    def get_status_display(self, obj):
        return obj.get_status()

    def get_coordinator_institute(self, obj):
        if hasattr(obj.coordinator, 'profile'):
            return obj.coordinator.profile.institute
        return ''


class WorkshopDetailSerializer(serializers.ModelSerializer):
    coordinator = UserSerializer(read_only=True)
    instructor = UserSerializer(read_only=True)
    workshop_type_detail = WorkshopTypeSerializer(source='workshop_type', read_only=True)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'date', 'status', 'status_display',
            'tnc_accepted', 'workshop_type', 'workshop_type_detail',
            'coordinator', 'instructor',
        ]

    def get_status_display(self, obj):
        return obj.get_status()


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_name', 'comment', 'public', 'created_date', 'workshop']
        read_only_fields = ['author', 'created_date', 'workshop']

    def get_author_name(self, obj):
        return obj.author.get_full_name()


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'institute', 'department', 'message']


class StatisticsWorkshopSerializer(serializers.ModelSerializer):
    """Serializer for the public statistics page."""
    coordinator_name = serializers.SerializerMethodField()
    coordinator_institute = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    workshop_type_name = serializers.CharField(source='workshop_type.name', read_only=True)
    coordinator_state = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'date', 'status',
            'coordinator_name', 'coordinator_institute', 'coordinator_state',
            'instructor_name', 'workshop_type_name',
        ]

    def get_coordinator_name(self, obj):
        return obj.coordinator.get_full_name()

    def get_coordinator_institute(self, obj):
        if hasattr(obj.coordinator, 'profile'):
            return obj.coordinator.profile.institute
        return ''

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name()
        return ''

    def get_coordinator_state(self, obj):
        if hasattr(obj.coordinator, 'profile'):
            states_map = dict(states)
            return states_map.get(obj.coordinator.profile.state, '')
        return ''


# Choices serializers — for populating dropdowns in the React frontend
class ChoicesSerializer:
    """Not a DRF serializer. Helper to return choice tuples as lists of dicts."""

    @staticmethod
    def states():
        return [{'value': v, 'label': l} for v, l in states if v]

    @staticmethod
    def departments():
        return [{'value': v, 'label': l} for v, l in department_choices]

    @staticmethod
    def titles():
        return [{'value': v, 'label': l} for v, l in title_choices]

    @staticmethod
    def sources():
        return [{'value': v, 'label': l} for v, l in source]

    @staticmethod
    def positions():
        return [{'value': v, 'label': l} for v, l in position_choices]
