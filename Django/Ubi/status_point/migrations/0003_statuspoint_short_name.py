# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-03-02 22:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('status_point', '0002_auto_20160302_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='statuspoint',
            name='short_name',
            field=models.CharField(default='swiss', max_length=50),
            preserve_default=False,
        ),
    ]
