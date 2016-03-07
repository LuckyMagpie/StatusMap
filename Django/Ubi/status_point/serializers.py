from .models import *
from rest_framework import serializers

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        exclude = ()

class StatusPointSerializer(serializers.ModelSerializer):
    indicator_detail = IndicatorSerializer(many=True)
    class Meta:
        model = StatusPoint
        exclude = ()
