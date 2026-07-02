# Test suite for AccessVerse FastAPI backend endpoints (auth-gated + public)
import pytest
import requests
import os
from dotenv import load_dotenv

# Load frontend env to get external backend URL if available, else fallback
frontend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", ".env")
if os.path.exists(frontend_env):
    load_dotenv(frontend_env)

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://a11y-studio.preview.emergentagent.com").rstrip("/")
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "aezakmiAEZAKMI12"


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def admin_token(api_client):
    resp = api_client.post(f"{BASE_URL}/api/auth/login",
                           json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    assert resp.status_code == 200, f"Admin login failed: {resp.status_code} {resp.text}"
    data = resp.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
    return data["token"]


@pytest.fixture
def auth_client(api_client, admin_token):
    api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
    return api_client


# ----- Health -----
class TestHealth:
    def test_root_endpoint(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"


# ----- Auth -----
class TestAuth:
    def test_login_success(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/auth/login",
                               json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert data.get("username") == ADMIN_USERNAME
        assert len(data["token"]) > 20

    def test_login_wrong_password(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/auth/login",
                               json={"username": ADMIN_USERNAME, "password": "totally-wrong"})
        assert resp.status_code == 401

    def test_login_wrong_username(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/auth/login",
                               json={"username": "nonexistent", "password": ADMIN_PASSWORD})
        assert resp.status_code == 401

    def test_me_without_token(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 401

    def test_me_with_token(self, auth_client):
        resp = auth_client.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 200
        assert resp.json().get("username") == ADMIN_USERNAME

    def test_me_with_bad_token(self, api_client):
        api_client.headers.update({"Authorization": "Bearer not-a-real-jwt"})
        resp = api_client.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 401


# ----- Public POST endpoints remain OPEN (no auth) -----
class TestPublicSubmissions:
    def test_public_post_quote_no_auth(self, api_client):
        payload = {
            "name": "TEST_Public_Quote",
            "email": "test_public_quote@accessverse.org",
            "company": "TEST_Public_Co",
            "website": "https://public.accessverse.org",
            "services": ["Web Accessibility Audits"],
            "details": "TEST_public quote submission without auth token.",
            "estimated_pages": 40
        }
        resp = api_client.post(f"{BASE_URL}/api/quotes", json=payload)
        assert resp.status_code == 201, f"Public quote submit failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert data["email"] == payload["email"]
        assert data["status"] == "Pending"
        assert "id" in data

    def test_public_post_consultation_no_auth(self, api_client):
        payload = {
            "name": "TEST_Public_Consult",
            "email": "test_public_consult@accessverse.org",
            "company": "TEST_Public_Consult_Co",
            "preferred_date": "2026-03-20",
            "preferred_time": "10:00",
            "accessibility_needs": "TEST_public consultation without auth token."
        }
        resp = api_client.post(f"{BASE_URL}/api/consultations", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == payload["email"]
        assert data["status"] == "Confirmed"


# ----- Protected endpoints require auth -----
class TestProtectedGet:
    def test_get_quotes_without_token(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/quotes")
        assert resp.status_code == 401

    def test_get_consultations_without_token(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/consultations")
        assert resp.status_code == 401

    def test_get_quotes_with_token(self, auth_client):
        resp = auth_client.get(f"{BASE_URL}/api/quotes")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_get_consultations_with_token(self, auth_client):
        resp = auth_client.get(f"{BASE_URL}/api/consultations")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


class TestProtectedPatch:
    def test_patch_quote_status_lifecycle(self, api_client, auth_client):
        # Create a quote publicly
        payload = {
            "name": "TEST_Patch_Quote",
            "email": "test_patch_quote@accessverse.org",
            "company": "TEST_Patch_Co",
            "services": ["PDF Accessibility Remediation"],
            "details": "TEST_patch quote lifecycle."
        }
        r = api_client.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 201
        qid = r.json()["id"]

        # PATCH without token -> 401
        r2 = requests.patch(f"{BASE_URL}/api/quotes/{qid}/status",
                            json={"status": "In Remediation"},
                            headers={"Content-Type": "application/json"})
        assert r2.status_code == 401

        # PATCH with token -> 200
        r3 = auth_client.patch(f"{BASE_URL}/api/quotes/{qid}/status",
                               json={"status": "In Remediation"})
        assert r3.status_code == 200
        assert r3.json()["status"] == "In Remediation"

        # GET (auth) to verify persistence
        r4 = auth_client.get(f"{BASE_URL}/api/quotes")
        assert r4.status_code == 200
        match = [q for q in r4.json() if q["id"] == qid]
        assert match and match[0]["status"] == "In Remediation"

    def test_patch_consultation_status_lifecycle(self, api_client, auth_client):
        payload = {
            "name": "TEST_Patch_Consult",
            "email": "test_patch_consult@accessverse.org",
            "company": "TEST_Patch_Consult_Co",
            "preferred_date": "2026-04-01",
            "preferred_time": "11:00",
            "accessibility_needs": "TEST_patch consultation lifecycle."
        }
        r = api_client.post(f"{BASE_URL}/api/consultations", json=payload)
        assert r.status_code == 201
        cid = r.json()["id"]

        # No token -> 401
        r2 = requests.patch(f"{BASE_URL}/api/consultations/{cid}/status",
                            json={"status": "Completed"},
                            headers={"Content-Type": "application/json"})
        assert r2.status_code == 401

        # With token -> 200
        r3 = auth_client.patch(f"{BASE_URL}/api/consultations/{cid}/status",
                               json={"status": "Completed"})
        assert r3.status_code == 200
        assert r3.json()["status"] == "Completed"
