from .models import *
from rest_framework import serializers

class StatusPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusPoint
        exclude = ()
