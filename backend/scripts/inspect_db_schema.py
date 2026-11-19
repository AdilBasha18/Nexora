import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.apps import apps
from django.core.management import call_command
from io import StringIO

print("=================================================================")
print("NEXORA DATABASE COMPATIBILITY AUDIT: SQLITE -> SUPABASE POSTGRESQL")
print("=================================================================\n")

models = apps.get_models()
print(f"Total Registered Models: {len(models)}")

json_fields = []
foreign_keys = []
date_fields = []

for model in models:
    app_label = model._meta.app_label
    # Filter only our project apps
    if app_label in ['admin', 'contenttypes', 'auth', 'sessions', 'authtoken']:
        continue
    
    print(f"[{app_label.upper()}] {model.__name__} (Table: {model._meta.db_table})")
    for f in model._meta.get_fields():
        field_type = f.get_internal_type() if hasattr(f, 'get_internal_type') else type(f).__name__
        if field_type == 'JSONField':
            json_fields.append((model.__name__, f.name))
        elif field_type == 'ForeignKey':
            foreign_keys.append((model.__name__, f.name, f.remote_field.model.__name__))

print("\n--- JSON FIELDS (SQLite Text -> Postgres JSONB) ---")
for m, f in json_fields:
    print(f"  {m}.{f} -> Supported natively by Postgres JSONB")

print(f"\nTotal Foreign Keys across models: {len(foreign_keys)}")

print("\n--- VERIFYING FULL DATA SERIALIZATION ---")
buf = StringIO()
call_command("dumpdata", "--natural-foreign", "--natural-primary", "--exclude", "contenttypes", "--exclude", "auth.permission", stdout=buf)
data = json.loads(buf.getvalue())
print(f"Total serialized project records: {len(data)}")

counts = {}
for item in data:
    m = item["model"]
    counts[m] = counts.get(m, 0) + 1

for m, c in sorted(counts.items()):
    print(f"  - {m}: {c} records")

print("\nData serialization check: 100% SUCCESSFUL (0 errors)")
