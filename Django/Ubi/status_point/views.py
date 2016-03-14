from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from .utils import *

@api_view(['GET'])
def routes(request, format=None):
    rs = [
        'points'
    ]
    routes = [get_url(request.get_host(),r) for r in rs]

    return Response({'routes':routes}, status=status.HTTP_200_OK)


OPERATORS = {
        'lte' : lambda count: StatusPoint.objects.filter(indicator_count__lte=count).order_by('-name'),
        'gte' : lambda count: StatusPoint.objects.filter(indicator_count__gte=count).order_by('-name'),
        'e'   : lambda count: StatusPoint.objects.filter(indicator_count=count).order_by('-name')
}
class StatusPointView(APIView):
    def get(self, request, format=None):
        indicator_count = request.GET.get('indicator_count','')
        operator = request.GET.get('q','')
        overall_status = request.GET.get('overall_status', '')

        if indicator_count and operator:
            filter = OPERATORS.get(operator)
            if not filter:
                return Response({'message':'Incorrect Operator (lte, gte, e)'}, status=status.HTTP_400_BAD_REQUEST)

            points = filter(indicator_count)
            points_json = StatusPointSerializer(points, many=True).data
            return Response(points_json, status=status.HTTP_200_OK)

        if overall_status:
            points = StatusPoint.objects.filter(overall_status=overall_status).order_by('-name')
            points_json = StatusPointSerializer(points, many=True).data
            return Response(points_json, status=status.HTTP_200_OK)

        points = StatusPoint.objects.all().order_by('-name')
        points_json = StatusPointSerializer(points, many=True).data

        return Response(points_json, status=status.HTTP_200_OK)
