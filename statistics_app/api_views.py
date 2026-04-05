import datetime as dt

from django.utils import timezone
from django.http import HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

import pandas as pd

from workshop_app.models import Workshop, WorkshopType, states
from workshop_app.serializers import StatisticsWorkshopSerializer, WorkshopTypeSerializer


def is_instructor(user):
    return user.groups.filter(name='instructor').exists()


@api_view(['GET'])
@permission_classes([AllowAny])
def api_public_stats(request):
    """Public workshop statistics with filtering."""
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort', 'date')

    if from_date and to_date:
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
        ).order_by('date')

    if show_workshops and request.user.is_authenticated:
        if is_instructor(request.user):
            workshops = workshops.filter(instructor_id=request.user.id)
        else:
            workshops = workshops.filter(coordinator_id=request.user.id)

    # Chart data
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)

    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = 30
    total = workshops.count()
    start = (page - 1) * per_page
    end = start + per_page
    paginated = workshops[start:end]

    serializer = StatisticsWorkshopSerializer(paginated, many=True)

    return Response({
        'workshops': serializer.data,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page if total > 0 else 1,
        'chart_data': {
            'states': {'labels': ws_states, 'data': ws_count},
            'types': {'labels': ws_type, 'data': ws_type_count},
        },
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_public_stats_download(request):
    """Download statistics as CSV."""
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    sort = request.GET.get('sort', 'date')

    if from_date and to_date:
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
        ).order_by('date')

    data = workshops.values(
        'workshop_type__name', 'coordinator__first_name',
        'coordinator__last_name', 'instructor__first_name',
        'instructor__last_name', 'coordinator__profile__state',
        'date', 'status',
    )
    df = pd.DataFrame(list(data))
    if not df.empty:
        df.status.replace([0, 1, 2], ['Pending', 'Success', 'Reject'], inplace=True)
        codes, states_map = list(zip(*states))
        df.coordinator__profile__state.replace(codes, states_map, inplace=True)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=statistics.csv'
        df.to_csv(response, index=False)
        return response
    else:
        return Response({'message': 'No data found.'}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_type_list(request):
    """List all workshop types (for filter dropdown)."""
    types = WorkshopType.objects.all().order_by('id')
    return Response(WorkshopTypeSerializer(types, many=True).data)
