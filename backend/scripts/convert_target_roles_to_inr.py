import os
import sys
import re
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from career.models import TargetRole

def format_inr_number(num):
    s = str(int(num))
    if len(s) <= 3:
        return s
    last3 = s[-3:]
    rest = s[:-3]
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return ",".join(parts) + "," + last3

backup = []
EXCHANGE_RATE = 85

# Realistic Indian market LPA ranges for roles, falling back to converted USD
ROLE_INR_MAP = {
    "Full Stack Software Engineer": "₹12,00,000 - ₹24,00,000 per annum",
    "Python Backend Developer": "₹14,00,000 - ₹26,00,000 per annum",
    "Frontend Web Engineer": "₹10,00,000 - ₹20,00,000 per annum",
    "Data Analyst": "₹6,00,000 - ₹12,00,000 per annum",
    "AI & Machine Learning Engineer": "₹18,00,000 - ₹35,00,000 per annum",
    "DevOps & Cloud Solutions Architect": "₹16,00,000 - ₹32,00,000 per annum",
    "Data Scientist & Advanced Analytics": "₹15,00,000 - ₹30,00,000 per annum",
    "Cybersecurity & Ethical Hacking Specialist": "₹14,00,000 - ₹28,00,000 per annum",
    "Mobile App Developer (Flutter & React Native)": "₹10,00,000 - ₹22,00,000 per annum",
    "Backend Systems Engineer (Go & Microservices)": "₹16,00,000 - ₹30,00,000 per annum",
    "Blockchain & Web3 Developer": "₹15,00,000 - ₹32,00,000 per annum",
    "Data Engineer & Big Data Architect": "₹15,00,000 - ₹28,00,000 per annum",
    "Full Stack Java & Spring Boot Architect": "₹14,00,000 - ₹26,00,000 per annum",
    "QA & Test Automation Architect": "₹8,00,000 - ₹16,00,000 per annum",
    "UI/UX & Product Design Specialist": "₹9,00,000 - ₹18,00,000 per annum",
    "Technical Product Manager": "₹18,00,000 - ₹35,00,000 per annum",
    "Cloud Security Engineer": "₹16,00,000 - ₹30,00,000 per annum",
    "Site Reliability Engineer (SRE)": "₹15,00,000 - ₹28,00,000 per annum",
    "MLOps & GenAI Platform Engineer": "₹20,00,000 - ₹40,00,000 per annum",
    "iOS Native Mobile Developer (Swift)": "₹12,00,000 - ₹24,00,000 per annum",
    "Android Native Developer (Kotlin)": "₹12,00,000 - ₹24,00,000 per annum",
    "Embedded Systems & IoT Engineer": "₹8,00,000 - ₹18,00,000 per annum",
    "Database Administrator (PostgreSQL & NoSQL)": "₹10,00,000 - ₹20,00,000 per annum",
    "Enterprise Solutions Architect": "₹25,00,000 - ₹50,00,000 per annum",
    "Prompt Engineer & LLM Application Specialist": "₹15,00,000 - ₹30,00,000 per annum",
    "Business Intelligence (BI) Developer": "₹8,00,000 - ₹16,00,000 per annum"
}

for tr in TargetRole.objects.all():
    backup.append({"id": tr.id, "title": tr.title, "average_salary": tr.average_salary})
    if tr.title in ROLE_INR_MAP:
        tr.average_salary = ROLE_INR_MAP[tr.title]
    else:
        # Check if contains $ amounts
        nums = [int(n.replace(',', '')) for n in re.findall(r'\$([0-9,]+)', tr.average_salary)]
        if len(nums) == 2:
            tr.average_salary = f"₹{format_inr_number(nums[0]*EXCHANGE_RATE)} - ₹{format_inr_number(nums[1]*EXCHANGE_RATE)} per annum"
        else:
            tr.average_salary = "₹10,00,000 - ₹20,00,000 per annum"
    tr.save(update_fields=['average_salary'])
    print(f"Role {tr.id}: {tr.title} -> {tr.average_salary}")

with open(os.path.join(os.path.dirname(__file__), "target_roles_usd_backup.json"), "w", encoding="utf-8") as f:
    json.dump(backup, f, indent=2)
print("Saved target_roles_usd_backup.json")
