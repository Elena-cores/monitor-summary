"""
models.py

This file defines the database models for the application. Each model represents a table in the database,
and the attributes of the models represent the fields of the tables.

The models are designed to handle the following entities of Single Particle Analysis (SPA): 
1. Micrograph, 2. CTF, 3. Coordinate2D, 4. Particle, 5. Class2D

Relationships:
- Micrograph has a one-to-many relationship with CTF, Coordinate2D, and Particle.
- Class2D and Particle have a one-to-many relationship.
- Coordinate2D has a one-to-one relationship with Particle.
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

# CTF model - stores Contrast Transfer Function (CTF) parameters for each micrograph
class CTF(models.Model):
    micrograph = models.ForeignKey(Micrograph, on_delete=models.CASCADE, related_name='ctfs') # in case of micrography elimination, all related ctfs will be deleted 
    defocusu = models.FloatField(validators=[MinValueValidator(0.0)]) 
    defocusv = models.FloatField(validators=[MinValueValidator(0.0)]) 
    phaseshift = models.FloatField()  # degrees 
    datetime_ctf = models.DateTimeField(default=datetime.now)
    resolution = models.FloatField(validators=[MinValueValidator(0.0)]) 
    psd = models.CharField(max_length=255) # for simulation purposes, psd = models.ImageField(upload_to='psds/' in production)
    
    def __str__(self):
        return f"CTF(Micrograph={self.micrograph.id}, DefocusU={self.defocusu}, DefocusV={self.defocusv}, DateTime={self.datetime_ctf})"


# Coordinate2D model - stores particle coordinates within micrographs
class Coordinate2D(models.Model):
    coordx = models.FloatField() 
    coordy = models.FloatField()
    score = models.FloatField()    
    micrograph = models.ForeignKey(Micrograph, on_delete=models.CASCADE, related_name='coordinate') 
    
    def __str__(self):
        return f"Coordinate2D(X={self.coordx}, Y={self.coordy}, Micrograph={self.micrograph.id})"

# Class2D model for 2D class averages representation
class Class2D(models.Model):
    filename = models.CharField(max_length=255)  # Class2D image path (ImageField in production)
    size = models.IntegerField()  
    
    def __str__(self):
        return f"Class2D(Filename={self.filename}, Size={self.size})"
    
# Particle model - represents extracted particle images
class Particle(models.Model):
    coordinate2d = models.OneToOneField(Coordinate2D, on_delete=models.CASCADE, related_name='particle')  # One-to-one with Coordinate2D
    micrograph = models.ForeignKey(Micrograph, on_delete=models.CASCADE, related_name='particle')  # Many particles can come from one micrograph
    class2d = models.ForeignKey(Class2D, on_delete=models.CASCADE, related_name='particle') # Many particles can belong to one class2d

    image_particle = models.CharField(max_length=255)  # Particle image path (ImageField in production)
    index = models.IntegerField()
    sampling = models.FloatField() 
    rot = models.FloatField()  # Euler angle rotation in degrees
    tilt = models.FloatField() 
    psi = models.FloatField()  # Euler angle psi in degrees
    shiftx = models.FloatField()  
    shifty = models.FloatField() 
    
    def __str__(self):
        return f"Particle(Index={self.index}, Micrograph={self.micrograph.id})"
 
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