# Generated by Django 5.1.7 on 2025-04-16 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cryoem_app', '0004_ctf_phaseshift'),
    ]

    operations = [
        migrations.CreateModel(
            name='config',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_range', models.FloatField(default=0.0)),
                ('max_range', models.FloatField(default=10.0)),
                ('interval', models.FloatField(default=0.5)),
                ('color_defocusu', models.CharField(default='#00e272', max_length=7)),
                ('color_defocusv', models.CharField(default='#007bff', max_length=7)),
                ('color_resolution', models.CharField(default='#ff5733', max_length=7)),
                ('color_phaseshift', models.CharField(default='#ffc107', max_length=7)),
            ],
        ),
    ]
