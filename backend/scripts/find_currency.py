import pathlib
frontend_dir = pathlib.Path(r'c:\Users\SHAIK ADIL BASHA\.gemini\antigravity\scratch\nexora\frontend\src')
files = list(frontend_dir.rglob('*.jsx'))
for f in files:
    content = f.read_text(encoding='utf-8')
    for idx, line in enumerate(content.splitlines(), 1):
        if 'salary_min' in line or 'salary_max' in line:
            print(f"{f.relative_to(frontend_dir)}:{idx} | {line.strip()[:100]}")
