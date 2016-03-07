# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-03-07 17:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('status_point', '0003_statuspoint_short_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Indicator',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url_id', models.IntegerField()),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.RenameField(
            model_name='statuspoint',
            old_name='indicator',
            new_name='indicator_count',
        ),
        migrations.AddField(
            model_name='indicator',
            name='status_point',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='status_point.StatusPoint'),
        ),
    ]
