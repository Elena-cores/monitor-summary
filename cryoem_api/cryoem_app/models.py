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

# Create your models here: 
# Micrograph model
class Micrograph(models.Model):
    filename = models.ImageField(upload_to='micrographs/') # 'upload_to' specifies route inside directory MEDIA_ROOT (defined in settings.py), where these images will be stored
    sampling = models.FloatField()
    dose = models.FloatField()
    datetime_micro = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return f"Micrograph(Filename={self.filename}, Sampling={self.sampling}, Dose={self.dose}, DateTime={self.datetime_micro})"

# CTF model
class CTF(models.Model):
    micrograph = models.ForeignKey(Micrograph, on_delete=models.CASCADE, related_name='ctfs') # in case of micrography elimination, all related ctfs will be deleted 
    defocusu = models.FloatField()
    defocusv = models.FloatField()
    phaseshift = models.FloatField()  # degrees 
    datetime_ctf = models.DateTimeField(default=datetime.now)
    resolution = models.FloatField()
    psd = models.ImageField(upload_to='psds/')
    
    def __str__(self):
        return f"CTF(Micrograph={self.micrograph.id}, DefocusU={self.defocusu}, DefocusV={self.defocusv}, DateTime={self.datetime_ctf})"