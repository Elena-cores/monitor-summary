# Generated by Django 5.2 on 2025-05-14 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cryoem_app', '0009_config_color_recent_defocuscov_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='config',
            name='defocuscov_special_max',
        ),
        migrations.RemoveField(
            model_name='config',
            name='defocuscov_special_min',
        ),
        migrations.AlterField(
            model_name='config',
            name='defocuscov_min',
            field=models.FloatField(default=0.0),
        ),
    ]
