from django.conf.urls import patterns, url
from .views import *


urlpatterns =[
    url(r'^$', StatusPointView.as_view(), name='points'),
]
