import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from jobs.models import Job

for j in Job.objects.all():
    comp = j.company.name if j.company else "None"
    print(f"Job {j.id}: '{j.title}' | company={comp} | min={j.salary_min} | max={j.salary_max} | currency={j.salary_currency} | created={j.created_at}")
