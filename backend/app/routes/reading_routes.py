import uuid
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from app.config import Config
from app.audio.noise_processing import validate_reading_payload
from app.models.schema import NoiseReading
from app.repositories.location_repo import LocationRepository
from app.repositories.reading_repo import ReadingRepository

reading_bp = Blueprint("readings", __name__)

@reading_bp.route("/api/readings", methods=["POST"])
def submit_reading():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}
    is_valid, err_msg, sanitized = validate_reading_payload(payload)

    if not is_valid:
        return jsonify({"success": False, "error": err_msg}), 400

    loc_repo = LocationRepository(Config.DATABASE_PATH)
    location = loc_repo.get_by_id(sanitized["location_id"])
    if not location:
        return jsonify({
            "success": False,
            "error": f"Invalid campus location ID '{sanitized['location_id']}'. Only verified KEC locations accept readings."
        }), 404

    now_iso = datetime.now(timezone.utc).isoformat()
    reading_id = f"read_{uuid.uuid4().hex[:12]}"
    measured_at = payload.get("measured_at") or now_iso

    new_reading = NoiseReading(
        id=reading_id,
        location_id=sanitized["location_id"],
        relative_intensity=sanitized["relative_intensity"],
        noise_category=sanitized["noise_category"],
        measured_at=measured_at,
        measurement_method=sanitized["measurement_method"],
        data_source=sanitized["data_source"],
        device_session_id=sanitized.get("device_session_id"),
        created_at=now_iso
    )

    read_repo = ReadingRepository(Config.DATABASE_PATH)
    created = read_repo.create(new_reading)

    return jsonify({
        "success": True,
        "message": "Derived noise observation recorded successfully.",
        "reading": created
    }), 201


@reading_bp.route("/api/locations/<location_id>/readings", methods=["GET"])
def get_location_readings(location_id: str):
    loc_repo = LocationRepository(Config.DATABASE_PATH)
    location = loc_repo.get_by_id(location_id)
    if not location:
        return jsonify({"success": False, "error": f"Campus location '{location_id}' not found"}), 404

    limit = request.args.get("limit", 50)
    try:
        limit_int = max(1, min(200, int(limit)))
    except ValueError:
        limit_int = 50

    read_repo = ReadingRepository(Config.DATABASE_PATH)
    history = read_repo.get_history_for_location(location_id, limit=limit_int)

    return jsonify({
        "success": True,
        "location_id": location_id,
        "location_name": location["name"],
        "count": len(history),
        "readings": history
    })
