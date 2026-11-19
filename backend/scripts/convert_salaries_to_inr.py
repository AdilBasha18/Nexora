import os
import sys
import json
from decimal import Decimal

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from jobs.models import Job

# Step 1: Backup current salary data
backup_data = []
for j in Job.objects.all():
    backup_data.append({
        "id": j.id,
        "title": j.title,
        "salary_min": str(j.salary_min) if j.salary_min else None,
        "salary_max": str(j.salary_max) if j.salary_max else None,
        "salary_currency": j.salary_currency
    })

backup_path = os.path.join(os.path.dirname(__file__), "salaries_usd_backup.json")
with open(backup_path, "w", encoding="utf-8") as f:
    json.dump(backup_data, f, indent=2)
print(f"Backed up {len(backup_data)} job salary records to {backup_path}")

# Step 2: Convert USD salaries to INR using verified exchange rate (1 USD = 85.00 INR)
EXCHANGE_RATE = Decimal('85.00')

updated_count = 0
for j in Job.objects.all():
    if j.salary_currency == 'USD':
        orig_min = j.salary_min
        orig_max = j.salary_max
        if j.salary_min:
            j.salary_min = (j.salary_min * EXCHANGE_RATE).quantize(Decimal('1.00'))
        if j.salary_max:
            j.salary_max = (j.salary_max * EXCHANGE_RATE).quantize(Decimal('1.00'))
        j.salary_currency = 'INR'
        j.save(update_fields=['salary_min', 'salary_max', 'salary_currency'])
        s_min = f"₹{j.salary_min:,}" if j.salary_min else "None"
        s_max = f"₹{j.salary_max:,}" if j.salary_max else "None"
        print(f"Converted Job {j.id} ({j.title[:30]}): ${orig_min}-${orig_max} USD -> {s_min}-{s_max} INR")
        updated_count += 1
    else:
        # Already INR or other, ensure currency is INR
        j.salary_currency = 'INR'
        j.save(update_fields=['salary_currency'])

print(f"\nSuccessfully converted {updated_count} jobs to INR at rate {EXCHANGE_RATE} INR/USD.")
