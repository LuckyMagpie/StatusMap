from django.db import models

class StatusPoint(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    contact = models.CharField(max_length=200)
    phone = models.CharField(max_length=150)
    indicator = models.IntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return '%s - %s (%s)' %(self.name, self.short_name, self.indicator)

