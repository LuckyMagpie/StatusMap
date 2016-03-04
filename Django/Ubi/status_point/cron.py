import kronos
import MySQLdb
from .models import *
from .serializers import *

@kronos.register('*/5 * * * *')
def get_indicators():
    c = db.cursor()

    for customer_id, tickets in c:
        try:
            point = StatusPoint.objects.get(short_name=customer_id)

            point_serial = StatusPointSerializer(point, data={'indicator':tickets}, partial=True)
            if point_serial.is_valid():
                point_serial.save()
            else:
                print(point_serial.errors)
        except StatusPoint.DoesNotExist:
            continue



