from django.db import models

class StatusPoint(models.Model):
    name = models.CharField(max_length=255, blank=True)
    short_name = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    contact = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=150, blank=True)
    indicator_count = models.IntegerField(blank=True)
    latitude = models.FloatField(blank=True)
    longitude = models.FloatField(blank=True)
    overall_status = models.CharField(max_length=50, blank=True)
    url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return '%s - %s (%s)' %(self.name, self.short_name, self.indicator_count)

class Indicator(models.Model):
    status_point = models.ForeignKey(StatusPoint, related_name='indicator_detail')
    url = models.CharField(max_length=255)
    description = models.CharField(max_length=255)

    def __str__(self):
        return '(%s) %s' %(self.status_point.name, self.description)

