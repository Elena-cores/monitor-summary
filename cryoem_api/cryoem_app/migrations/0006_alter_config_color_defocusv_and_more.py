# Generated by Django 5.1.7 on 2025-04-16 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cryoem_app', '0005_config'),
    ]

    operations = [
        migrations.AlterField(
            model_name='config',
            name='color_defocusv',
            field=models.CharField(default='#00e272', max_length=7),
        ),
        migrations.AlterField(
            model_name='config',
            name='color_phaseshift',
            field=models.CharField(default='#544FC5', max_length=7),
        ),
        migrations.AlterField(
            model_name='config',
            name='color_resolution',
            field=models.CharField(default='#2CAFFE', max_length=7),
        ),
    ]
