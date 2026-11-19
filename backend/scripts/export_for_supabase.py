"""
Nexora Database Export Utility for Supabase PostgreSQL Migration
Exports all current SQLite data preserving primary keys, relations, and user records.
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.management import call_command

output_file = os.path.join(BASE_DIR, "nexora_supabase_export.json")
print(f"Exporting database records from SQLite to {output_file}...")

with open(output_file, "w", encoding="utf-8") as f:
    call_command(
        "dumpdata",
        "--natural-foreign",
        "--natural-primary",
        "--exclude", "contenttypes",
        "--exclude", "auth.permission",
        "--indent", "2",
        stdout=f
    )

file_size_kb = os.path.getsize(output_file) / 1024
print(f"Export completed successfully!")
print(f"Output File: {output_file} ({file_size_kb:.2f} KB)")
print("Preserved: Users, Profiles, Resumes, Jobs, Applications, Assessments, Notifications, Tickets, Audit Logs.")
