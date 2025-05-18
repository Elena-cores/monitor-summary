"""
models.py

This file defines the database models for the application. Each model represents a table in the database,
and the attributes of the models represent the fields of the tables.

The models are designed to handle the following entities of Single Particle Analysis (SPA): 
1. Micrograph, 2. CTF, 3. Coordinate2D, 4. Particle, 5. Class2D

Relationships:
- Micrograph has a one-to-many relationship with CTF, Coordinate2D, and Particle.
- Class2D and Particle have a one-to-many relationship.
"""

from django.db import models
from datetime import datetime
from django.core.validators import MinValueValidator

# Create your models here: 
# Micrograph model
class Micrograph(models.Model):
    filename = models.CharField(max_length=255) # filename = models.ImageField(upload_to='micrographs/') & 'upload_to' specifies route inside directory MEDIA_ROOT (defined in settings.py), where these images will be stored
    sampling = models.FloatField(validators=[MinValueValidator(0.0)]) # avoid negative values
    dose = models.FloatField(validators=[MinValueValidator(0.0)]) 
    datetime_micro = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return f"Micrograph(Filename={self.filename}, Sampling={self.sampling}, Dose={self.dose}, DateTime={self.datetime_micro})"

# CTF model
class CTF(models.Model):
    micrograph = models.ForeignKey(Micrograph, on_delete=models.CASCADE, related_name='ctfs') # in case of micrography elimination, all related ctfs will be deleted 
    defocusu = models.FloatField(validators=[MinValueValidator(0.0)]) # avoid negative values
    defocusv = models.FloatField(validators=[MinValueValidator(0.0)]) 
    phaseshift = models.FloatField()  # degrees 
    datetime_ctf = models.DateTimeField(default=datetime.now)
    resolution = models.FloatField(validators=[MinValueValidator(0.0)]) 
    psd = models.CharField(max_length=255) #psd = models.ImageField(upload_to='psds/')
    
    def __str__(self):
        return f"CTF(Micrograph={self.micrograph.id}, DefocusU={self.defocusu}, DefocusV={self.defocusv}, DateTime={self.datetime_ctf})"

# class config() for graph customisation 
class Config(models.Model):
    # range variables for max resolution
    maxres_min = models.FloatField(default=0.0)
    maxres_max = models.FloatField(default=10.0)
    maxres_interval = models.FloatField(default=0.5)
    
    # range variables for defocus coverage
    defocuscov_min = models.FloatField(default=0.0)  
    defocuscov_max = models.FloatField(default=4.0)
    defocuscov_interval = models.FloatField(default=0.5)
    defocuscov_recent_micrographs_count = models.IntegerField(default=50) 
    
    # colours for data
    color_defocusu = models.CharField(max_length=7, default="#00e272")  # green
    color_defocusv = models.CharField(max_length=7, default= "#00e272") # green
    color_resolution = models.CharField(max_length=7, default="#2CAFFE") # blue
    color_phaseshift = models.CharField(max_length=7, default="#544FC5") # purple
    color_recent_defocuscov = models.CharField(max_length=7, default="#544FC5")  # purple
     
    def __str__(self):
        return f"Config(MinRange={self.maxres_min}, MaxRange={self.maxres_max}, Interval={self.maxres_interval})"