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
        'point/all'
    ]
    routes = [get_url(request.get_host(),r) for r in rs]

    return Response({'routes':routes}, status=status.HTTP_200_OK)

class StatusPointView(APIView):
    def get(self, request, format=None):
        points = StatusPoint.objects.all().order_by('-name')
        points_json = StatusPointSerializer(points, many=True).data

        return Response(points_json, status=status.HTTP_200_OK)
