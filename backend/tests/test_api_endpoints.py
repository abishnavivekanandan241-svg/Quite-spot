import pytest
import os
import tempfile
from app import create_app
from app.config import Config
from app.models.schema import init_database
from init_db import seed_database

@pytest.fixture
def client():
    # Setup temporary test database
    db_fd, temp_db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)

    class TestConfig(Config):
        TESTING = True
        DATABASE_PATH = temp_db_path

    # Seed the test database
    seed_database(temp_db_path)

    app = create_app(TestConfig)
    with app.test_client() as client:
        yield client

    # Cleanup
    if os.path.exists(temp_db_path):
        try:
            os.remove(temp_db_path)
        except Exception:
            pass


def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert "Kongu Engineering College" in data["campus"]["institution"]


def test_get_locations(client):
    res = client.get("/api/locations")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["count"] >= 12
    # Verify campus location properties
    first = data["locations"][0]
    assert "name" in first
    assert "latitude" in first
    assert "longitude" in first
    assert "freshness" in first


def test_location_by_id(client):
    res = client.get("/api/locations/kec_cd_lib")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["location"]["id"] == "kec_cd_lib"
    assert "CD Memorial Central Library" in data["location"]["name"]

    # Not found
    res_404 = client.get("/api/locations/non_existent_loc")
    assert res_404.status_code == 404


def test_submit_valid_reading(client):
    payload = {
        "location_id": "kec_cd_lib",
        "relative_intensity": 31.5,
        "noise_category": "Quiet",
        "measurement_method": "web_audio_rms",
        "data_source": "client_contribution"
    }
    res = client.post("/api/readings", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert data["reading"]["relative_intensity"] == 31.5


def test_reject_raw_audio_submission(client):
    payload = {
        "location_id": "kec_cd_lib",
        "relative_intensity": 31.5,
        "audio_bytes": "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    }
    res = client.post("/api/readings", json=payload)
    assert res.status_code == 400
    data = res.get_json()
    assert data["success"] is False
    assert "Privacy violation" in data["error"]


def test_reject_out_of_campus_location(client):
    payload = {
        "location_id": "stanford_university_library",
        "relative_intensity": 25.0
    }
    res = client.post("/api/readings", json=payload)
    assert res.status_code == 404
    data = res.get_json()
    assert "Invalid campus location ID" in data["error"]


def test_recommendations(client):
    # Centered around KEC campus
    res = client.get("/api/recommendations?lat=11.272&lon=77.604&radius=1.5")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["count"] > 0
    # Check that recommendations are ordered by score
    scores = [r["score_details"]["score"] for r in data["recommendations"]]
    assert scores == sorted(scores)


def test_benchmark_endpoint(client):
    res = client.post("/api/benchmark", json={"dataset_size": 200, "search_radius_km": 0.5})
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    bench = data["benchmark"]
    assert bench["verification"]["results_match"] is True
    assert "quadtree_metrics" in bench
    assert "linear_metrics" in bench


def test_user_feedback(client):
    payload = {
        "location_id": "kec_cd_lib",
        "feedback_value": "Very quiet and cool today",
        "user_comment": "Ideal for concentrated exam revision"
    }
    res = client.post("/api/feedback", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True

    # Read back feedback
    get_res = client.get("/api/locations/kec_cd_lib/feedback")
    assert get_res.status_code == 200
    fb_data = get_res.get_json()
    assert fb_data["count"] >= 1


def test_auth_registration_and_login(client):
    reg_payload = {
        "username": "student_test",
        "email": "student@kongu.edu",
        "password": "securepassword123"
    }
    res_reg = client.post("/api/auth/register", json=reg_payload)
    assert res_reg.status_code == 201

    # Login
    login_payload = {
        "email_or_username": "student@kongu.edu",
        "password": "securepassword123"
    }
    res_log = client.post("/api/auth/login", json=login_payload)
    assert res_log.status_code == 200
    assert res_log.get_json()["user"]["username"] == "student_test"

    # Bad password
    bad_log = client.post("/api/auth/login", json={"email_or_username": "student@kongu.edu", "password": "wrong"})
    assert bad_log.status_code == 401
