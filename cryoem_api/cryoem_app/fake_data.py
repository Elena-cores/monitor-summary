from faker import Faker 
import json
from datetime import datetime, timedelta
import random

fake = Faker()

# Base date: March 6th, 2025
base_date = datetime(2025, 3, 6)

# Generate micrographs (all within the same day, between 4-7am)
micrographs = []
for i in range(50):
    # Random time between 4-7am
    hour = random.randint(4, 6)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    
    # Create micrograph data
    micrograph = {
        "id": i + 1,
        "filename": f"micrograph_{i}.png",
        "sampling": round(random.uniform(0, 2.0), 2),
        "dose": round(random.uniform(0.1, 1.0), 2),
        "datetime_micro": base_date.replace(hour=hour, minute=minute, second=second).isoformat()
    }
    micrographs.append(micrograph)

# Sort micrographs by datetime
micrographs.sort(key=lambda x: x["datetime_micro"])

# Generate CTFs (keep the temporal order)
ctfs = []
for i in range(30):
    # Select a random micrograph
    micrograph = random.choice(micrographs)
    micrograph_time = datetime.fromisoformat(micrograph["datetime_micro"])
    
    # Add a random time within the same 4-7am range
    ctf_time = micrograph_time + timedelta(
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59)
    )
    
    # Create CTF data
    ctf = {
        "id": i + 1,
        "micrographId": micrograph["id"],
        "defocusu": round(random.uniform(0, 3.0), 2),
        "defocusv": round(random.uniform(0, 3.0), 2),
        "phaseshift": 0,  # All phaseshift set to 0 as SPA example
        "datetime_ctf": ctf_time.isoformat(),
        "resolution": round(random.uniform(0, 4), 2),
        "psd": f"psd_{i}.png"
    }
    ctfs.append(ctf)

# Sort CTFs by datetime
ctfs.sort(key=lambda x: x["datetime_ctf"])

# Save the generated data into a JSON file
with open('db.json', 'w') as f:
    json.dump({"micrographs": micrographs, "ctfs": ctfs}, f, indent=4)

print("Data generated and saved to db.json")