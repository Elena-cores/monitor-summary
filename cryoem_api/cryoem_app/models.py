from django.db import models
from datetime import datetime

# Create your models here.
class CTF(models.Model):
    defocusu = models.FloatField()
    defocusv = models.FloatField()
    datetime = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"CTF(defocusU={self.defocusu}, defocusV={self.defocusv}, dateTime={self.datetime})"
    