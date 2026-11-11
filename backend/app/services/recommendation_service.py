from typing import List, Dict, Any, Optional
from app.config import Config
from app.algorithms.quadtree import SpatialQuadtree, BoundingBox
from app.algorithms.custom_hash_map import CustomHashMap
from app.algorithms.recommendation import compute_recommendation_score, rank_recommendations_with_heap
from app.algorithms.spatial_utils import haversine_distance
from app.repositories.location_repo import LocationRepository
from app.repositories.reading_repo import ReadingRepository
from app.services.freshness_service import FreshnessService

class RecommendationService:
    def __init__(self, location_repo: LocationRepository, reading_repo: ReadingRepository):
        self.location_repo = location_repo
        self.reading_repo = reading_repo
        self.freshness_service = FreshnessService()

    def get_recommendations(
        self,
        ref_lat: float,
        ref_lon: float,
        radius_km: float = 1.0,
        top_k: int = 10,
        weights: Optional[Dict[str, float]] = None
    ) -> List[Dict[str, Any]]:
        # Fetch all active locations
        locations = self.location_repo.get_all(active_only=True)
        if not locations:
            return []

        # Get latest readings mapped by location_id
        latest_readings = self.reading_repo.get_latest_for_all_locations()

        # Cache locations in custom hash map for fast ID lookup
        loc_map = CustomHashMap()
        for loc in locations:
            loc_map.put(loc["id"], loc)

        # Build Quadtree bounded to the campus area (with margin)
        bounds = Config.CAMPUS_BOUNDS
        campus_box = BoundingBox(
            min_lat=bounds["min_lat"] - 0.05,
            min_lon=bounds["min_lon"] - 0.05,
            max_lat=bounds["max_lat"] + 0.05,
            max_lon=bounds["max_lon"] + 0.05
        )
        quadtree = SpatialQuadtree(campus_box, capacity=4)
        for loc in locations:
            quadtree.insert(loc["latitude"], loc["longitude"], loc["id"])

        # Query candidates within radius using Quadtree
        candidates = quadtree.query_radius(ref_lat, ref_lon, radius_km)

        # If radius query returned few results, expand search slightly to all campus locations
        if not candidates and radius_km < 3.0:
            for loc in locations:
                dist = haversine_distance(ref_lat, ref_lon, loc["latitude"], loc["longitude"])
                candidates.append({
                    "item": loc["id"],
                    "distance_km": dist,
                    "lat": loc["latitude"],
                    "lon": loc["longitude"]
                })

        # Score candidates
        scored_candidates = []
        for cand in candidates:
            loc_id = cand["item"]
            loc_data = loc_map.get(loc_id)
            if not loc_data:
                continue

            latest_rd = latest_readings.get(loc_id)
            enriched_loc = self.freshness_service.enrich_location_with_freshness(loc_data, latest_rd)

            score_details = compute_recommendation_score(
                location=enriched_loc,
                latest_reading=latest_rd,
                distance_km=cand["distance_km"],
                max_radius_km=max(radius_km, 1.0),
                stale_threshold_minutes=Config.STALE_THRESHOLD_MINUTES,
                weights=weights
            )

            scored_candidates.append({
                "location": enriched_loc,
                "score_details": score_details
            })

        # Rank using Min-Heap
        ranked = rank_recommendations_with_heap(scored_candidates, top_k=top_k)
        return ranked
