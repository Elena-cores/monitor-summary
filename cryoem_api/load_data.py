import json
from datetime import datetime
import os
import django
from django.utils import timezone

# django configuration
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cryoem_api.settings')
django.setup()

from cryoem_app.models import Micrograph, CTF

# clean up the database before loading new data
Micrograph.objects.all().delete()
CTF.objects.all().delete()

# load and process data
with open('db.json') as f:
    data = json.load(f)

    # create micrograhs
    for m in data['micrographs']:
        try:
            Micrograph.objects.create(
                id=m['id'],  # use original id from json file
                filename=m['filename'],
                sampling=m['sampling'],
                dose=m['dose'],
                datetime_micro=timezone.make_aware(datetime.fromisoformat(m['datetime_micro']))
            )
        except Exception as e:
            print(f"Error creando micrografía {m['id']}: {str(e)}")

    # Create CTFs
    for c in data['ctfs']:
        try:
            CTF.objects.create(
                id=c['id'],
                micrograph=Micrograph.objects.get(id=c['micrographId']),
                defocusu=c['defocusu'],
                defocusv=c['defocusv'],
                phaseshift=c['phaseshift'],
                datetime_ctf=timezone.make_aware(datetime.fromisoformat(c['datetime_ctf'])),
                resolution=c['resolution'],
                psd=c['psd']
            )
        except Exception as e:
            print(f"Error creando CTF {c['id']}: {str(e)}")

print("¡Datos cargados exitosamente!")
print(f"Micrografías creadas: {Micrograph.objects.count()}")
print(f"CTFs creados: {CTF.objects.count()}")