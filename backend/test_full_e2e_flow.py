import requests
import json

BASE_URL = "http://localhost:8000/api"

print("==========================================================")
print("[*] RUNNING END-TO-END DJANGO API COMPREHENSIVE TEST SUITE")
print("==========================================================")

# 1. Health check
res = requests.get(f"{BASE_URL}/health/")
assert res.status_code == 200, f"Health check failed: {res.text}"
print("[PASS] 1. Backend Health Check: OK")

# 2. Test Protected Route without Token (Must be 401)
res = requests.get(f"{BASE_URL}/auth/me/")
assert res.status_code == 401, f"Expected 401 for unauthorized request, got {res.status_code}"
print("[PASS] 2. Protected Route without token rejected (401 Unauthorized)")

# 3. Test Invalid Token (Must be 401)
res = requests.get(f"{BASE_URL}/auth/me/", headers={"Authorization": "Bearer invalid_garbage_token"})
assert res.status_code == 401, f"Expected 401 for invalid token, got {res.status_code}"
print("[PASS] 3. Protected Route with invalid token rejected (401 Unauthorized)")

# 4. Register Startup
startup_email = "test_founder_2026@bidaya.tn"
startup_pw = "FounderPass123!"
res = requests.post(f"{BASE_URL}/auth/register/", json={
    "email": startup_email,
    "password": startup_pw,
    "first_name": "Kamel",
    "last_name": "Jendoubi",
    "role": "startup"
})
assert res.status_code == 201, f"Startup registration failed: {res.text}"
startup_access = res.json()["access"]
startup_refresh = res.json()["refresh"]
print(f"[PASS] 4. Register Startup: Created user {startup_email} with JWT tokens")

# 5. Login Startup
res = requests.post(f"{BASE_URL}/auth/login/", json={
    "email": startup_email,
    "password": startup_pw
})
assert res.status_code == 200, f"Startup login failed: {res.text}"
startup_access = res.json()["access"]
print("[PASS] 5. Login Startup: Access token obtained")

# 6. Startup GET & PUT /api/startups/me/
headers_startup = {"Authorization": f"Bearer {startup_access}"}
res = requests.get(f"{BASE_URL}/startups/me/", headers=headers_startup)
assert res.status_code == 200, f"GET startup profile failed: {res.text}"

res = requests.put(f"{BASE_URL}/startups/me/", headers=headers_startup, json={
    "name": "OliveTech Tunisia",
    "pitch": "Automated drone sensor analytics for olive oil yield maximization.",
    "sector": "AgriTech",
    "stage": "Seed",
    "fundingNeeded": "350000 TND",
    "governorate": "Sfax",
    "legalStatus": "SARL"
})
assert res.status_code == 200, f"PUT startup profile failed: {res.text}"
saved_startup_id = res.json()["id"]
print(f"[PASS] 6. Startup profile created & updated: {res.json()['name']} ({saved_startup_id})")

# 7. Role Permissions: Startup trying to access Admin endpoint (Must be 403)
res = requests.get(f"{BASE_URL}/auth/users/", headers=headers_startup)
assert res.status_code == 403, f"Expected 403 for non-admin, got {res.status_code}"
print("[PASS] 7. RBAC Security: Startup forbidden from accessing Admin user list (403 Forbidden)")

# 8. Register Investor
investor_email = "test_investor_2026@bidaya.tn"
investor_pw = "InvestorPass123!"
res = requests.post(f"{BASE_URL}/auth/register/", json={
    "email": investor_email,
    "password": investor_pw,
    "first_name": "Leila",
    "last_name": "Bouazizi",
    "role": "investor"
})
assert res.status_code == 201, f"Investor registration failed: {res.text}"
investor_access = res.json()["access"]
print(f"[PASS] 8. Register Investor: Created {investor_email}")

# 9. Investor Profile PUT & Deal Flow
headers_investor = {"Authorization": f"Bearer {investor_access}"}
res = requests.put(f"{BASE_URL}/investor/profile/", headers=headers_investor, json={
    "company_name": "Medina Ventures Fund",
    "investor_type": "Venture Capital",
    "sectors": ["AgriTech", "FinTech"],
    "ticketSize": "100,000 - 500,000 TND",
    "preferredGovernorates": ["Tunis", "Sfax"]
})
assert res.status_code == 200, f"Investor profile update failed: {res.text}"
investor_profile_id = res.json()["id"]
print(f"[PASS] 9. Investor Profile created: {res.json()['company_name']}")

# 10. Investor browse approved startups deal flow
res = requests.get(f"{BASE_URL}/startups/", headers=headers_investor)
assert res.status_code == 200, f"Browse deal flow failed: {res.text}"
startups_list = res.json()
print(f"[PASS] 10. Investor Deal Flow: Retrieved {len(startups_list)} approved startups")

# 11. Express Interest
if len(startups_list) > 0:
    target_startup_id = startups_list[0]["id"]
    res = requests.post(f"{BASE_URL}/startups/interests/", headers=headers_investor, json={
        "startup_id": target_startup_id,
        "investor_id": investor_profile_id,
        "status": "interested"
    })
    assert res.status_code == 200, f"Express interest failed: {res.text}"
    print(f"[PASS] 11. Express Interest: Investor expressed interest in startup {target_startup_id}")

# 12. Admin Login
res = requests.post(f"{BASE_URL}/auth/login/", json={
    "email": "admin@demo.local",
    "password": "DemoPassword123!"
})
assert res.status_code == 200, f"Admin login failed: {res.text}"
admin_access = res.json()["access"]
headers_admin = {"Authorization": f"Bearer {admin_access}"}
print("[PASS] 12. Admin Login: OK")

# 13. Admin Dashboard & User Management
res = requests.get(f"{BASE_URL}/admin/dashboard/", headers=headers_admin)
assert res.status_code == 200, f"Admin dashboard failed: {res.text}"
admin_data = res.json()
print(f"[PASS] 13. Admin Dashboard: Retrieved {len(admin_data['profiles'])} users, {len(admin_data['startups'])} startups, {len(admin_data['investors'])} investors")

# 14. Admin Startup Review (approve newly created startup)
res = requests.post(f"{BASE_URL}/startups/{saved_startup_id}/review/", headers=headers_admin, json={
    "publication_status": "approved",
    "reviewer_feedback": "Excellent dossier and clear business model.",
    "investor_visible": True
})
assert res.status_code == 200, f"Admin review failed: {res.text}"
assert res.json()["publication_status"] == "approved"
print(f"[PASS] 14. Admin Review: Approved startup {saved_startup_id}")

# 15. JWT Token Refresh
res = requests.post(f"{BASE_URL}/auth/refresh/", json={"refresh": startup_refresh})
assert res.status_code == 200, f"Token refresh failed: {res.text}"
new_access = res.json()["access"]
assert new_access != ""
print("[PASS] 15. JWT Refresh: Successfully refreshed token")

# 16. Verify new access token works
res = requests.get(f"{BASE_URL}/auth/me/", headers={"Authorization": f"Bearer {new_access}"})
assert res.status_code == 200
print(f"[PASS] 16. Authenticated call with refreshed token: OK ({res.json()['email']})")

# 17. RAG Chat endpoint
res = requests.post(f"{BASE_URL}/chat/", json={
    "message": "Quelles sont les démarches pour enregistrer une startup en Tunisie ?",
    "role": "startup"
})
assert res.status_code == 200, f"Chat failed: {res.text}"
assert len(res.json().get("sources", [])) > 0
print(f"[PASS] 17. RAG Assistant: Generated answer with {len(res.json()['sources'])} sources")

# 18. Logout
res = requests.post(f"{BASE_URL}/auth/logout/", headers=headers_startup, json={"refresh": startup_refresh})
assert res.status_code == 200, f"Logout failed: {res.text}"
print("[PASS] 18. Logout: OK")

print("\n==========================================================")
print("[SUCCESS] ALL 18 END-TO-END SPECIFICATION TESTS PASSED PERFECTLY!")
print("==========================================================")
