import urllib.request, json, time

BASE = 'http://127.0.0.1:8000/api/v1'

def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        json.dumps(data).encode(),
        {'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

results = []

# 1 Candidate login
s, r = post('/auth/login/', {'email': 'alex.morgan@example.com', 'password': 'Candidate@123'})
role = r.get('user', {}).get('role', 'MISSING')
results.append(('Candidate login', s, role))

# 2 Recruiter login
s, r = post('/auth/login/', {'email': 'recruiter@cloudnova.io', 'password': 'Recruiter@123'})
role = r.get('user', {}).get('role', 'MISSING')
results.append(('Recruiter login', s, role))

# 3 Admin login
s, r = post('/auth/login/', {'email': 'admin@nexora.io', 'password': 'Admin@123'})
role = r.get('user', {}).get('role', 'MISSING')
results.append(('Admin login', s, role))

# 4 Wrong password
s, r = post('/auth/login/', {'email': 'admin@nexora.io', 'password': 'wrongpass'})
results.append(('Wrong password', s, str(r)[:60]))

# 5 Google endpoint (fake token)
s, r = post('/auth/google/', {'credential': 'fake-access-token'})
results.append(('Google fake token', s, str(r)[:60]))

# 6 New candidate registration
email = 'test' + str(int(time.time())) + '@testdev.com'
s, r = post('/auth/register/candidate/', {
    'full_name': 'Test Dev User',
    'email': email,
    'password': 'TestPass@123',
    'confirm_password': 'TestPass@123'
})
role = r.get('user', {}).get('role', 'MISSING')
results.append(('New candidate register', s, role))

for name, status, detail in results:
    ok = 'OK' if status < 400 else 'FAIL'
    print(ok, name, '|', status, '|', detail)

