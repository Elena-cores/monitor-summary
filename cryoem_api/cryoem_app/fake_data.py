from faker import Faker
import json
from datetime import datetime, timedelta
import random

fake = Faker()

# Generate data for Micrographs
micrographs = []
for i in range(50):  # Generate 50 micrographs
    micrograph = {
        "id": i + 1,
        "filename": f"micrograph_{i}.png",
        "sampling": round(random.uniform(0, 2.0), 2),
        "dose": round(random.uniform(0.1, 1.0), 2),
        "datetime_micro": (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
    }
    micrographs.append(micrograph)

# Generate data for CTF (associated to existing micrographs)
ctfs = []
for i in range(30):  # generate 150 CTFs (some micrographs will have multiple CTFs)
    # Select random micrograph 
    micrograph = random.choice(micrographs)
    
    ctf = {
        "id": i + 1,
        "micrographId": micrograph["id"],  # foreign key
        "defocusu": round(random.uniform(0, 5.0), 2),
        "defocusv": round(random.uniform(0, 5.0), 2),
        "phaseshift": round(random.uniform(0, 100), 2),
        "datetime_ctf": (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat(),
        "resolution": round(random.uniform(2, 5), 2),
        "psd": f"psd_{i}.png"
    }
    ctfs.append(ctf)

# Save in JSON script 
data = {
    "micrographs": micrographs,
    "ctfs": ctfs,
}


with open('db.json', 'w') as f:
    json.dump(data, f, indent=4)

print("Datos generados y guardados en db.json")


