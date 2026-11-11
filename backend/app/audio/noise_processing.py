from typing import Dict, Any, Tuple, Optional
import re
from app.config import Config

FORBIDDEN_AUDIO_FIELDS = [
    "audio", "raw_audio", "audio_buffer", "audio_data", "audio_bytes",
    "pcm", "pcm_data", "samples", "waveform", "blob", "wav", "mp3",
    "ogg", "base64_audio", "recording", "voice"
]

def classify_intensity(intensity: float, thresholds: Optional[Dict[str, float]] = None) -> str:
    """
    Classify relative noise intensity into Quiet, Moderate, or Noisy.
    """
    if thresholds is None:
        thresholds = Config.NOISE_THRESHOLDS

    quiet_max = thresholds.get("quiet_max", 45.0)
    moderate_max = thresholds.get("moderate_max", 65.0)

    if intensity < quiet_max:
        return "Quiet"
    elif intensity < moderate_max:
        return "Moderate"
    else:
        return "Noisy"


def validate_reading_payload(payload: Dict[str, Any]) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """
    Validates a submitted noise reading payload:
    1. Rejects any attempt to upload raw audio buffers or binary payloads.
    2. Validates location_id, relative_intensity, measurement_method, and data_source.
    3. Returns (is_valid, error_message, sanitized_data).
    """
    if not isinstance(payload, dict):
        return False, "Payload must be a JSON object", None

    # Check for forbidden raw audio fields (Privacy Protection)
    for field in FORBIDDEN_AUDIO_FIELDS:
        if field in payload:
            return False, f"Privacy violation: raw audio field '{field}' is strictly prohibited. Only client-derived relative intensity is accepted.", None

    # Check location_id
    location_id = payload.get("location_id")
    if not location_id or not isinstance(location_id, str):
        return False, "Valid 'location_id' string is required", None

    # Check relative intensity
    if "relative_intensity" not in payload:
        return False, "'relative_intensity' metric is required", None

    try:
        intensity = float(payload["relative_intensity"])
    except (ValueError, TypeError):
        return False, "'relative_intensity' must be a numeric value", None

    if intensity < 0.0 or intensity > 140.0:
        return False, f"'relative_intensity' value {intensity} is out of realistic physical bounds (0 - 140)", None

    # Derive or check category
    provided_category = payload.get("noise_category")
    derived_category = classify_intensity(intensity)
    
    # If user sent a category, ensure it is one of the allowed categories
    valid_categories = {"Quiet", "Moderate", "Noisy", "Unknown"}
    if provided_category and provided_category not in valid_categories:
        noise_category = derived_category
    else:
        noise_category = provided_category or derived_category

    # Method and source
    measurement_method = payload.get("measurement_method", "web_audio_rms")
    data_source = payload.get("data_source", "client_contribution")
    device_session_id = payload.get("device_session_id")
    if device_session_id and not isinstance(device_session_id, str):
        device_session_id = str(device_session_id)

    sanitized = {
        "location_id": location_id.strip(),
        "relative_intensity": round(intensity, 2),
        "noise_category": noise_category,
        "measurement_method": str(measurement_method)[:64],
        "data_source": str(data_source)[:64],
        "device_session_id": device_session_id[:64] if device_session_id else None
    }

    return True, None, sanitized
