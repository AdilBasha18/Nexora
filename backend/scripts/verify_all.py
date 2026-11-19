import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from assessments.code_sandbox import execute_code
from accounts.models import User
from jobs.models import Job
from applications.models import JobApplication

print("--- 1. DATABASE RECORD VERIFICATION ---")
print(f"Users in DB: {User.objects.count()}")
print(f"Jobs in DB: {Job.objects.count()}")
print(f"Applications in DB: {JobApplication.objects.count()}")

print("\n--- 2. SANDBOX EXECUTION VERIFICATION ---")
res_py = execute_code(
    "python", 
    "def solution(a, b):\n    return a + b", 
    [{"inputs": [2, 3], "expected": 5}, {"inputs": [10, -5], "expected": 5}], 
    "solution"
)
print("Python Sandbox Result:", res_py.get("all_passed"), f"({res_py.get('elapsed_ms')}ms)")
assert res_py.get("all_passed") is True, "Python sandbox failed"

res_java = execute_code(
    "java",
    "public class Solution {\n    public int add(int a, int b) {\n        return a + b;\n    }\n}",
    [{"inputs": [4, 6], "expected": 10}],
    "add"
)
print("Java Sandbox Result:", res_java.get("all_passed"), f"({res_java.get('elapsed_ms')}ms)")
assert res_java.get("all_passed") is True, "Java sandbox failed"

print("\nALL VERIFICATIONS PASSED: 100% OPERATIONAL")
