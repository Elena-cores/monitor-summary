from django.contrib import admin
from .models import CTF, Micrograph, Config, Particle, Class2D, Coordinate2D

# Register your models here.
# This code registers the models with the Django admin site, allowing them to be managed through the admin interface.
admin.site.register(CTF)
admin.site.register(Micrograph)
admin.site.register(Config)
admin.site.register(Particle)
admin.site.register(Class2D)
admin.site.register(Coordinate2D)