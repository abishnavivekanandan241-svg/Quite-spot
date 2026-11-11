import pytest
from app.audio.noise_processing import validate_reading_payload, classify_intensity, FORBIDDEN_AUDIO_FIELDS

def test_classify_intensity():
    assert classify_intensity(25.0) == "Quiet"
    assert classify_intensity(44.9) == "Quiet"
    assert classify_intensity(55.0) == "Moderate"
    assert classify_intensity(65.0) == "Noisy"
    assert classify_intensity(85.0) == "Noisy"


def test_reject_raw_audio_fields():
    for forbidden in FORBIDDEN_AUDIO_FIELDS:
        payload = {
            "location_id": "kec_cd_lib",
            "relative_intensity": 35.0,
            forbidden: "base64encodedrawaudiobufferbytes=="
        }
        is_valid, err, sanitized = validate_reading_payload(payload)
        assert is_valid is False
        assert "Privacy violation" in err
        assert forbidden in err


def test_valid_derived_payload():
    payload = {
        "location_id": "kec_cd_lib",
        "relative_intensity": 32.5,
        "noise_category": "Quiet",
        "measurement_method": "web_audio_rms"
    }
    is_valid, err, sanitized = validate_reading_payload(payload)
    assert is_valid is True
    assert err is None
    assert sanitized["relative_intensity"] == 32.5
    assert sanitized["noise_category"] == "Quiet"


def test_reject_invalid_numeric_values():
    payload = {
        "location_id": "kec_cd_lib",
        "relative_intensity": "not_a_number"
    }
    is_valid, err, sanitized = validate_reading_payload(payload)
    assert is_valid is False
    assert "numeric value" in err

    # Out of realistic physical bounds
    payload["relative_intensity"] = 250.0
    is_valid, err, sanitized = validate_reading_payload(payload)
    assert is_valid is False
    assert "physical bounds" in err
