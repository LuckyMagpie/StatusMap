from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class StatusPointView(APIView):
    def get(self, request, format=None):
        points = StatusPoint.objects.all()
        points_json = StatusPointSerializer(points, many=True).data

        return Response(points_json, status=status.HTTP_200_OK)
