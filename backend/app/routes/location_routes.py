from flask import Blueprint, jsonify, request
from app.config import Config
from app.repositories.location_repo import LocationRepository
from app.repositories.reading_repo import ReadingRepository
from app.services.freshness_service import FreshnessService

location_bp = Blueprint("locations", __name__)

def get_repos():
    loc_repo = LocationRepository(Config.DATABASE_PATH)
    read_repo = ReadingRepository(Config.DATABASE_PATH)
    fresh_service = FreshnessService()
    return loc_repo, read_repo, fresh_service


@location_bp.route("/api/locations", methods=["GET"])
def get_locations():
    loc_repo, read_repo, fresh_service = get_repos()
    
    loc_type = request.args.get("type", None)
    category_filter = request.args.get("category", None)
    search_query = request.args.get("search", "").strip().lower()

    locations = loc_repo.get_all(active_only=True, location_type=loc_type)
    latest_readings = read_repo.get_latest_for_all_locations()

    enriched_list = []
    for loc in locations:
        latest = latest_readings.get(loc["id"])
        enriched = fresh_service.enrich_location_with_freshness(loc, latest)

        # Search filter
        if search_query and (search_query not in loc["name"].lower() and search_query not in (loc.get("description") or "").lower()):
            continue

        # Category filter (Quiet, Moderate, Noisy, Unknown / Stale)
        if category_filter and category_filter.lower() != "all":
            curr_cat = enriched["current_noise_category"].lower()
            target_cat = category_filter.lower()
            if target_cat in ("unknown", "stale", "unknown / stale"):
                if "unknown" not in curr_cat and "stale" not in curr_cat:
                    continue
            elif target_cat != curr_cat:
                continue

        enriched_list.append(enriched)

    return jsonify({
        "success": True,
        "count": len(enriched_list),
        "locations": enriched_list,
        "campus_center": {
            "latitude": Config.CAMPUS_BOUNDS["center_lat"],
            "longitude": Config.CAMPUS_BOUNDS["center_lon"]
        }
    })


@location_bp.route("/api/locations/<location_id>", methods=["GET"])
def get_location_by_id(location_id: str):
    loc_repo, read_repo, fresh_service = get_repos()
    loc = loc_repo.get_by_id(location_id)
    if not loc:
        return jsonify({"success": False, "error": f"Campus location '{location_id}' not found"}), 404

    latest = read_repo.get_latest_for_location(location_id)
    enriched = fresh_service.enrich_location_with_freshness(loc, latest)

    return jsonify({"success": True, "location": enriched})


@location_bp.route("/api/locations/<location_id>/summary", methods=["GET"])
def get_location_summary(location_id: str):
    loc_repo, read_repo, fresh_service = get_repos()
    loc = loc_repo.get_by_id(location_id)
    if not loc:
        return jsonify({"success": False, "error": f"Campus location '{location_id}' not found"}), 404

    latest = read_repo.get_latest_for_location(location_id)
    history = read_repo.get_history_for_location(location_id, limit=20)
    enriched = fresh_service.enrich_location_with_freshness(loc, latest)

    # Compute genuine trend from available history
    avg_intensity = None
    if history:
        intensities = [h["relative_intensity"] for h in history if "relative_intensity" in h]
        if intensities:
            avg_intensity = round(sum(intensities) / len(intensities), 1)

    return jsonify({
        "success": True,
        "location": enriched,
        "metrics": {
            "total_observations_recorded": len(history),
            "average_relative_intensity": avg_intensity,
            "has_live_reading": enriched["freshness"]["is_usable"]
        }
    })


@location_bp.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    """
    Returns authentic calculated metrics directly from SQLite database.
    Zero fabricated numbers.
    """
    loc_repo, read_repo, fresh_service = get_repos()
    locations = loc_repo.get_all(active_only=True)
    latest_readings = read_repo.get_latest_for_all_locations()
    total_readings = read_repo.count_total()

    active_fresh_count = 0
    quiet_count = 0
    moderate_count = 0
    noisy_count = 0
    stale_count = 0

    for loc in locations:
        latest = latest_readings.get(loc["id"])
        status = fresh_service.evaluate_reading_freshness(latest)
        if status["is_usable"]:
            active_fresh_count += 1
            cat = status["display_category"].lower()
            if "quiet" in cat:
                quiet_count += 1
            elif "moderate" in cat:
                moderate_count += 1
            elif "noisy" in cat:
                noisy_count += 1
        else:
            stale_count += 1

    return jsonify({
        "success": True,
        "stats": {
            "total_verified_locations": len(locations),
            "locations_with_fresh_readings": active_fresh_count,
            "locations_stale_or_unmeasured": stale_count,
            "total_historical_readings": total_readings,
            "category_distribution": {
                "quiet": quiet_count,
                "moderate": moderate_count,
                "noisy": noisy_count,
                "unknown_or_stale": stale_count
            }
        }
    })
