from flask import Blueprint, jsonify, request
from app.config import Config
from app.repositories.location_repo import LocationRepository
from app.repositories.reading_repo import ReadingRepository
from app.services.recommendation_service import RecommendationService
from app.algorithms.spatial_utils import validate_coordinates

recommendation_bp = Blueprint("recommendations", __name__)

@recommendation_bp.route("/api/recommendations", methods=["GET"])
def get_recommendations():
    ref_lat = request.args.get("lat", type=float)
    ref_lon = request.args.get("lon", type=float)
    radius_km = request.args.get("radius", default=1.5, type=float)
    top_k = request.args.get("limit", default=10, type=int)

    # If coordinates are missing or invalid, default gracefully to verified KEC campus center
    if ref_lat is None or ref_lon is None or not validate_coordinates(ref_lat, ref_lon):
        ref_lat = Config.CAMPUS_BOUNDS["center_lat"]
        ref_lon = Config.CAMPUS_BOUNDS["center_lon"]
        is_default_center = True
    else:
        is_default_center = False

    loc_repo = LocationRepository(Config.DATABASE_PATH)
    read_repo = ReadingRepository(Config.DATABASE_PATH)
    rec_service = RecommendationService(loc_repo, read_repo)

    results = rec_service.get_recommendations(
        ref_lat=ref_lat,
        ref_lon=ref_lon,
        radius_km=radius_km,
        top_k=max(1, min(50, top_k))
    )

    return jsonify({
        "success": True,
        "reference_point": {
            "latitude": ref_lat,
            "longitude": ref_lon,
            "is_default_campus_center": is_default_center
        },
        "search_radius_km": radius_km,
        "count": len(results),
        "recommendations": results
    })
