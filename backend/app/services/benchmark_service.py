import time
import random
from typing import Dict, Any, List
from app.algorithms.quadtree import SpatialQuadtree, BoundingBox
from app.algorithms.spatial_utils import haversine_distance, calculate_bounding_box
from app.config import Config

class BenchmarkService:
    @staticmethod
    def generate_synthetic_points(count: int, center_lat: float, center_lon: float, spread_km: float = 2.0) -> List[Dict[str, Any]]:
        """
        Generates synthetic benchmark points around center.
        Clearly tagged as benchmark_synthetic.
        """
        random.seed(42)  # Consistent reproducible points for fair testing
        lat_delta = spread_km / 111.0
        lon_delta = spread_km / (111.0 * 0.98)

        points = []
        for i in range(count):
            plat = center_lat + random.uniform(-lat_delta, lat_delta)
            plon = center_lon + random.uniform(-lon_delta, lon_delta)
            points.append({
                "id": f"bench_pt_{i}",
                "latitude": plat,
                "longitude": plon,
                "name": f"Benchmark Point #{i}",
                "data_provenance": "synthetic_benchmark_dataset"
            })
        return points

    @staticmethod
    def run_benchmark(dataset_size: int = 1000, search_radius_km: float = 0.5, center_lat: float = None, center_lon: float = None) -> Dict[str, Any]:
        """
        Executes genuine side-by-side performance benchmark between
        Spatial Quadtree and Linear Search baseline.
        Records exact nanosecond runtimes and verifies 100% result equality.
        """
        if center_lat is None:
            center_lat = Config.CAMPUS_BOUNDS["center_lat"]
        if center_lon is None:
            center_lon = Config.CAMPUS_BOUNDS["center_lon"]

        dataset_size = max(10, min(50000, dataset_size))
        search_radius_km = max(0.05, min(10.0, search_radius_km))

        # Generate test points
        dataset = BenchmarkService.generate_synthetic_points(
            count=dataset_size,
            center_lat=center_lat,
            center_lon=center_lon,
            spread_km=max(1.0, search_radius_km * 2.5)
        )

        # 1. Quadtree Build & Query
        bounds = BoundingBox(
            min_lat=center_lat - 0.2,
            min_lon=center_lon - 0.2,
            max_lat=center_lat + 0.2,
            max_lon=center_lon + 0.2
        )

        build_start = time.perf_counter_ns()
        quadtree = SpatialQuadtree(bounds, capacity=8)
        for pt in dataset:
            quadtree.insert(pt["latitude"], pt["longitude"], pt["id"])
        build_time_ns = time.perf_counter_ns() - build_start

        # Warmup
        _ = quadtree.query_radius(center_lat, center_lon, search_radius_km)

        # Timed Quadtree Search
        qt_start = time.perf_counter_ns()
        qt_raw_results = quadtree.query_radius(center_lat, center_lon, search_radius_km)
        qt_duration_ns = time.perf_counter_ns() - qt_start

        qt_ids = sorted([r["item"] for r in qt_raw_results])

        # 2. Linear Search Baseline
        # Warmup
        _ = [p["id"] for p in dataset if haversine_distance(center_lat, center_lon, p["latitude"], p["longitude"]) <= search_radius_km]

        # Timed Linear Search
        linear_start = time.perf_counter_ns()
        linear_results = []
        for p in dataset:
            dist = haversine_distance(center_lat, center_lon, p["latitude"], p["longitude"])
            if dist <= search_radius_km:
                linear_results.append(p["id"])
        linear_duration_ns = time.perf_counter_ns() - linear_start

        linear_ids = sorted(linear_results)

        # 3. Equality & Validation
        results_equal = (qt_ids == linear_ids)

        qt_ms = qt_duration_ns / 1_000_000.0
        linear_ms = linear_duration_ns / 1_000_000.0
        speedup_factor = round(linear_ms / max(0.0001, qt_ms), 2) if qt_ms > 0 else 1.0

        return {
            "parameters": {
                "dataset_size": dataset_size,
                "search_radius_km": search_radius_km,
                "center": {"latitude": center_lat, "longitude": center_lon}
            },
            "quadtree_metrics": {
                "query_time_ms": round(qt_ms, 4),
                "query_time_ns": qt_duration_ns,
                "build_time_ms": round(build_time_ns / 1_000_000.0, 4),
                "points_found": len(qt_ids)
            },
            "linear_metrics": {
                "query_time_ms": round(linear_ms, 4),
                "query_time_ns": linear_duration_ns,
                "points_found": len(linear_ids)
            },
            "verification": {
                "results_match": results_equal,
                "matched_count": len(qt_ids),
                "speedup_factor": speedup_factor,
                "status": "Verified: Quadtree and Linear search returned identical results." if results_equal else "Mismatch detected"
            },
            "theoretical_complexity": {
                "quadtree": "O(log N + K) on average for 2D spatial candidate pruning",
                "linear": "O(N) full dataset scan with Haversine computation on every point"
            }
        }
