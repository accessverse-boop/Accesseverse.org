# Test suite for AccessVerse FastAPI backend endpoints
import pytest
import requests
import os
from dotenv import load_dotenv

# Load frontend env to get external backend URL if available, else fallback
frontend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", ".env")
if os.path.exists(frontend_env):
    load_dotenv(frontend_env)

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://a11y-studio.preview.emergentagent.com").rstrip("/")

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

class TestBackendAPI:
    """Tests for all core FastAPI backend endpoints"""

    def test_root_endpoint(self, api_client):
        """Verify the health check/root endpoint is operational"""
        url = f"{BASE_URL}/api"
        response = api_client.get(url)
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "version" in data
        assert "message" in data

    def test_quote_request_lifecycle(self, api_client):
        """Verify POST /api/quotes, GET /api/quotes, and PATCH /api/quotes/{id}/status"""
        # 1. Create a quote request
        payload = {
            "name": "TEST_User_Backend",
            "email": "test_backend@accessverse.org",
            "company": "TEST_Company_Inc",
            "website": "https://test.accessverse.org",
            "services": ["PDF Accessibility Remediation", "Web Accessibility Audits"],
            "details": "TEST_Details showing enterprise document requirements.",
            "estimated_pages": 120
        }
        create_url = f"{BASE_URL}/api/quotes"
        create_response = api_client.post(create_url, json=payload)
        assert create_response.status_code == 201
        
        created_data = create_response.json()
        assert "id" in created_data
        quote_id = created_data["id"]
        assert created_data["name"] == payload["name"]
        assert created_data["email"] == payload["email"]
        assert created_data["company"] == payload["company"]
        assert created_data["website"] == payload["website"]
        assert created_data["services"] == payload["services"]
        assert created_data["details"] == payload["details"]
        assert created_data["estimated_pages"] == payload["estimated_pages"]
        assert created_data["status"] == "Pending"

        # 2. GET all quotes and verify the created one is persisted
        get_url = f"{BASE_URL}/api/quotes"
        get_response = api_client.get(get_url)
        assert get_response.status_code == 200
        quotes_list = get_response.json()
        assert isinstance(quotes_list, list)
        
        found_quote = None
        for q in quotes_list:
            if q["id"] == quote_id:
                found_quote = q
                break
        
        assert found_quote is not None, "Created quote was not found in GET /api/quotes response"
        assert found_quote["name"] == payload["name"]
        assert found_quote["company"] == payload["company"]

        # 3. PATCH status of the quote request
        patch_url = f"{BASE_URL}/api/quotes/{quote_id}/status"
        patch_payload = {"status": "In Remediation"}
        patch_response = api_client.patch(patch_url, json=patch_payload)
        assert patch_response.status_code == 200
        
        patched_data = patch_response.json()
        assert patched_data["id"] == quote_id
        assert patched_data["status"] == "In Remediation"

        # 4. Verify update was persisted in database via another GET call
        get_response_2 = api_client.get(get_url)
        assert get_response_2.status_code == 200
        quotes_list_2 = get_response_2.json()
        
        updated_quote = None
        for q in quotes_list_2:
            if q["id"] == quote_id:
                updated_quote = q
                break
                
        assert updated_quote is not None
        assert updated_quote["status"] == "In Remediation"

    def test_consultation_lifecycle(self, api_client):
        """Verify POST /api/consultations, GET /api/consultations, and PATCH /api/consultations/{id}/status"""
        # 1. Create a consultation
        payload = {
            "name": "TEST_Consult_User",
            "email": "test_consult@accessverse.org",
            "company": "TEST_Consult_Company",
            "preferred_date": "2026-02-15",
            "preferred_time": "14:30",
            "accessibility_needs": "TEST_Accessibility_Needs screen reader NVDA validation."
        }
        create_url = f"{BASE_URL}/api/consultations"
        create_response = api_client.post(create_url, json=payload)
        assert create_response.status_code == 201
        
        created_data = create_response.json()
        assert "id" in created_data
        consultation_id = created_data["id"]
        assert created_data["name"] == payload["name"]
        assert created_data["email"] == payload["email"]
        assert created_data["company"] == payload["company"]
        assert created_data["preferred_date"] == payload["preferred_date"]
        assert created_data["preferred_time"] == payload["preferred_time"]
        assert created_data["accessibility_needs"] == payload["accessibility_needs"]
        assert created_data["status"] == "Confirmed"

        # 2. GET all consultations and verify persistence
        get_url = f"{BASE_URL}/api/consultations"
        get_response = api_client.get(get_url)
        assert get_response.status_code == 200
        consults_list = get_response.json()
        assert isinstance(consults_list, list)
        
        found_consult = None
        for c in consults_list:
            if c["id"] == consultation_id:
                found_consult = c
                break
                
        assert found_consult is not None, "Created consultation was not found in GET /api/consultations response"
        assert found_consult["name"] == payload["name"]
        assert found_consult["company"] == payload["company"]

        # 3. PATCH status of the consultation
        patch_url = f"{BASE_URL}/api/consultations/{consultation_id}/status"
        patch_payload = {"status": "Completed"}
        patch_response = api_client.patch(patch_url, json=patch_payload)
        assert patch_response.status_code == 200
        
        patched_data = patch_response.json()
        assert patched_data["id"] == consultation_id
        assert patched_data["status"] == "Completed"

        # 4. Verify update was persisted in database via another GET call
        get_response_2 = api_client.get(get_url)
        assert get_response_2.status_code == 200
        consults_list_2 = get_response_2.json()
        
        updated_consult = None
        for c in consults_list_2:
            if c["id"] == consultation_id:
                updated_consult = c
                break
                
        assert updated_consult is not None
        assert updated_consult["status"] == "Completed"
