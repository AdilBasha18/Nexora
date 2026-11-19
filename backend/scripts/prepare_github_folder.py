import os
import shutil
import pathlib

SRC = pathlib.Path(r"c:\Users\SHAIK ADIL BASHA\.gemini\antigravity\scratch\nexora")
DST = pathlib.Path(r"c:\Users\SHAIK ADIL BASHA\.gemini\antigravity\scratch\NEXORA_READY_FOR_GITHUB")

if DST.exists():
    shutil.rmtree(DST)
DST.mkdir(parents=True, exist_ok=True)

# 1. Root files
root_files = [
    'README.md',
    '.gitignore',
    'START_LOCAL.bat',
    'START_ONLINE_NGROK.bat',
    'STOP_SERVERS.bat'
]
for rf in root_files:
    src_file = SRC / rf
    if src_file.exists():
        shutil.copy2(src_file, DST / rf)

# 2. Backend
backend_dst = DST / 'backend'
backend_dst.mkdir(parents=True, exist_ok=True)

for folder in ['apps', 'config', 'scripts']:
    src_dir = SRC / 'backend' / folder
    if src_dir.exists():
        shutil.copytree(src_dir, backend_dst / folder, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '*backup*'))

for bfile in ['manage.py', 'requirements.txt', '.env.example']:
    src_file = SRC / 'backend' / bfile
    if src_file.exists():
        shutil.copy2(src_file, backend_dst / bfile)

# 3. Frontend
frontend_dst = DST / 'frontend'
frontend_dst.mkdir(parents=True, exist_ok=True)

for folder in ['src', 'public']:
    src_dir = SRC / 'frontend' / folder
    if src_dir.exists():
        shutil.copytree(src_dir, frontend_dst / folder, ignore=shutil.ignore_patterns('*.bak', '*backup*'))

for ffile in [
    'index.html',
    'package.json',
    'package-lock.json',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    '.env.example'
]:
    src_file = SRC / 'frontend' / ffile
    if src_file.exists():
        shutil.copy2(src_file, frontend_dst / ffile)

# Count copied items
files_count = sum(1 for _ in DST.rglob('*') if _.is_file())
print(f"Successfully prepared clean folder: {DST}")
print(f"Total clean files: {files_count}")
print("No .env, no node_modules, no databases, no secrets.")
