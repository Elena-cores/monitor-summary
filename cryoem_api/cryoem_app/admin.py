from django.contrib import admin
from .models import CTF, Micrograph, Config

# Register your models here.
admin.site.register(CTF)
admin.site.register(Micrograph)
admin.site.register(Config)