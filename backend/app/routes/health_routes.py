from flask import Blueprint, jsonify, current_app
from datetime import datetime, timezone
from app.config import Config
from app.models.schema import get_db_connection

health_bp = Blueprint("health", __name__)

@health_bp.route("/api/health", methods=["GET"])
def health_check():
    db_ok = False
    try:
        db_path = current_app.config.get("DATABASE_PATH", Config.DATABASE_PATH)
        conn = get_db_connection(db_path)
        cursor = conn.execute("SELECT 1")
        db_ok = (cursor.fetchone()[0] == 1)
        conn.close()
    except Exception as e:
        db_ok = False

    return jsonify({
        "status": "healthy" if db_ok else "degraded",
        "service": "QuietSpot API",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": {
            "status": "connected" if db_ok else "error",
            "type": "SQLite"
        },
        "campus": {
            "institution": Config.CAMPUS_BOUNDS["campus_name"],
            "coordinates": {
                "latitude": Config.CAMPUS_BOUNDS["center_lat"],
                "longitude": Config.CAMPUS_BOUNDS["center_lon"]
            }
        }
    }), 200 if db_ok else 503
