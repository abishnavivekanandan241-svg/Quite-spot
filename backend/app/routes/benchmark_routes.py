from flask import Blueprint, jsonify, request
from app.services.benchmark_service import BenchmarkService

benchmark_bp = Blueprint("benchmark", __name__)

@benchmark_bp.route("/api/benchmark", methods=["POST"])
def run_benchmark():
    payload = request.get_json(silent=True) or {}
    dataset_size = payload.get("dataset_size", 1000)
    search_radius_km = payload.get("search_radius_km", 0.5)
    center_lat = payload.get("center_lat")
    center_lon = payload.get("center_lon")

    try:
        dataset_size = int(dataset_size)
        search_radius_km = float(search_radius_km)
        if center_lat is not None:
            center_lat = float(center_lat)
        if center_lon is not None:
            center_lon = float(center_lon)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid benchmark parameters"}), 400

    results = BenchmarkService.run_benchmark(
        dataset_size=dataset_size,
        search_radius_km=search_radius_km,
        center_lat=center_lat,
        center_lon=center_lon
    )

    return jsonify({
        "success": True,
        "benchmark": results
    })


@benchmark_bp.route("/api/benchmark/info", methods=["GET"])
def get_benchmark_info():
    return jsonify({
        "success": True,
        "description": "Spatial Search Performance Comparison: Custom Quadtree vs Linear Scan",
        "algorithms": {
            "quadtree": {
                "name": "Custom 2D Spatial Quadtree",
                "space_complexity": "O(N)",
                "build_complexity": "O(N log N)",
                "average_query_complexity": "O(log N + K)",
                "worst_case_query": "O(N) when spatial points cluster in a single quadrant",
                "principles": "Hierarchical spatial decomposition into 4 quadrants (NW, NE, SW, SE) with bounding box pruning"
            },
            "linear_search": {
                "name": "Linear Scan Baseline",
                "space_complexity": "O(N)",
                "build_complexity": "O(1)",
                "query_complexity": "O(N)",
                "principles": "Exhaustive iteration over all candidate points with full trigonometric Haversine evaluation"
            }
        }
    })
