from django.db import models

# Create your models here.
class CTF(models.Model):
    defocusu = models.FloatField()
    defocusv = models.FloatField()

    def __str__(self):
        return f"CTF(defocusU={self.defocusu}, defocusV={self.defocusv})"
    