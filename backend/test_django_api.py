import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()
client = APIClient()

print("--- Testing Django API & SimpleJWT ---")

# 1. Health check
res = client.get('/api/health/')
assert res.status_code == 200, f"Health check failed: {res.status_code}"
print("1. Health check: OK", res.json())

# 2. Login as Admin
res = client.post('/api/auth/login/', {'email': 'admin@demo.local', 'password': 'DemoPassword123!'})
assert res.status_code == 200, f"Admin login failed: {res.data}"
admin_token = res.data['access']
admin_refresh = res.data['refresh']
print("2. Admin login: OK (role:", res.data['user']['role'], ")")

# 3. /api/auth/me/ with Bearer token
client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
res = client.get('/api/auth/me/')
assert res.status_code == 200, f"Auth me failed: {res.data}"
assert res.data['role'] == 'admin'
print("3. /api/auth/me/: OK (email:", res.data['email'], ")")

# 4. Token Refresh
res = client.post('/api/auth/refresh/', {'refresh': admin_refresh})
assert res.status_code == 200, f"Token refresh failed: {res.data}"
assert 'access' in res.data
print("4. Token refresh: OK")

# 5. Login as Startup
res = client.post('/api/auth/login/', {'email': 'startup@demo.local', 'password': 'DemoPassword123!'})
assert res.status_code == 200
startup_token = res.data['access']
print("5. Startup login: OK (role:", res.data['user']['role'], ")")

# 6. Startup GET /api/startups/me/
client.credentials(HTTP_AUTHORIZATION=f'Bearer {startup_token}')
res = client.get('/api/startups/me/')
assert res.status_code == 200
print("6. Startup /me/: OK (startup:", res.data['name'], ")")

# 7. Login as Investor
res = client.post('/api/auth/login/', {'email': 'investor@demo.local', 'password': 'DemoPassword123!'})
assert res.status_code == 200
investor_token = res.data['access']
print("7. Investor login: OK (role:", res.data['user']['role'], ")")

# 8. Investor GET /api/investor/profile/ & GET /api/startups/
client.credentials(HTTP_AUTHORIZATION=f'Bearer {investor_token}')
res = client.get('/api/investor/profile/')
assert res.status_code == 200
print("8. Investor profile: OK (firm:", res.data['company_name'], ")")

res = client.get('/api/startups/')
assert res.status_code == 200
print("   Investor Deal Flow: OK (count:", len(res.data), ")")

# 9. Register a new user
client.credentials() # clear headers
res = client.post('/api/auth/register/', {
    'email': 'new_founder@test.tn',
    'password': 'Password123!',
    'first_name': 'Amine',
    'last_name': 'Ben Salem',
    'role': 'startup'
})
assert res.status_code == 201, f"Registration failed: {res.data}"
print("9. Registration: OK (new user:", res.data['user']['email'], ")")

# 10. RAG Chat endpoint
res = client.post('/api/chat/', {'message': 'Comment créer une SARL en Tunisie ?', 'role': 'startup'})
assert res.status_code == 200, f"Chat failed: {res.data}"
assert 'answer' in res.data
print("10. RAG Chat: OK (sources:", len(res.data.get('sources', [])), ")")

print("\n--- ALL DJANGO BACKEND TESTS PASSED SUCCESSFULLY! ---")
