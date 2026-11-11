import uuid
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from app.config import Config
from app.models.schema import UserFeedback
from app.repositories.location_repo import LocationRepository
from app.repositories.feedback_repo import FeedbackRepository

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/api/feedback", methods=["POST"])
def submit_feedback():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}
    location_id = payload.get("location_id")
    feedback_value = payload.get("feedback_value")
    user_comment = payload.get("user_comment", "")

    if not location_id or not feedback_value:
        return jsonify({"success": False, "error": "'location_id' and 'feedback_value' are required"}), 400

    loc_repo = LocationRepository(Config.DATABASE_PATH)
    location = loc_repo.get_by_id(location_id)
    if not location:
        return jsonify({"success": False, "error": f"Location '{location_id}' not found"}), 404

    now_iso = datetime.now(timezone.utc).isoformat()
    feedback = UserFeedback(
        id=f"fb_{uuid.uuid4().hex[:12]}",
        location_id=location_id,
        feedback_value=str(feedback_value)[:64],
        user_comment=str(user_comment)[:500] if user_comment else None,
        created_at=now_iso
    )

    feed_repo = FeedbackRepository(Config.DATABASE_PATH)
    created = feed_repo.create(feedback)

    return jsonify({
        "success": True,
        "message": "User feedback recorded. Thank you for helping keep campus data accurate!",
        "feedback": created
    }), 201


@feedback_bp.route("/api/locations/<location_id>/feedback", methods=["GET"])
def get_location_feedback(location_id: str):
    loc_repo = LocationRepository(Config.DATABASE_PATH)
    if not loc_repo.get_by_id(location_id):
        return jsonify({"success": False, "error": f"Location '{location_id}' not found"}), 404

    feed_repo = FeedbackRepository(Config.DATABASE_PATH)
    feedbacks = feed_repo.get_by_location(location_id)

    return jsonify({
        "success": True,
        "location_id": location_id,
        "count": len(feedbacks),
        "feedback": feedbacks
    })
