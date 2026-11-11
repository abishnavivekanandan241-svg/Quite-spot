import pytest
from app.algorithms.spatial_utils import haversine_distance, calculate_bounding_box, validate_coordinates
from app.algorithms.quadtree import SpatialQuadtree, BoundingBox
from app.algorithms.custom_hash_map import CustomHashMap
from app.algorithms.min_heap import CustomMinHeap
from app.algorithms.recommendation import compute_recommendation_score, rank_recommendations_with_heap

def test_haversine_distance():
    # Distance between KEC Central Library and Food Court (~250-300m)
    d = haversine_distance(11.2709624, 77.6052846, 11.2726352, 77.6067879)
    assert 0.20 < d < 0.40  # In kilometers
    # Zero distance test
    assert haversine_distance(11.27, 77.60, 11.27, 77.60) == 0.0


def test_bounding_box():
    min_lat, max_lat, min_lon, max_lon = calculate_bounding_box(11.272, 77.604, 0.5)
    assert min_lat < 11.272 < max_lat
    assert min_lon < 77.604 < max_lon


def test_quadtree_insert_and_query():
    box = BoundingBox(11.26, 77.59, 11.29, 77.62)
    qt = SpatialQuadtree(box, capacity=2)
    
    # Insert points
    assert qt.insert(11.270, 77.600, "loc1") is True
    assert qt.insert(11.275, 77.605, "loc2") is True
    assert qt.insert(11.272, 77.602, "loc3") is True
    assert qt.insert(11.285, 77.615, "loc4") is True
    # Out of bounds point
    assert qt.insert(12.500, 78.000, "out_of_bounds") is False
    assert qt.size == 4

    # Rectangular range query
    results = qt.query_range(11.269, 77.599, 11.276, 77.606)
    assert "loc1" in results
    assert "loc2" in results
    assert "loc3" in results
    assert "loc4" not in results

    # Radius query around center
    radius_results = qt.query_radius(11.272, 77.602, radius_km=0.5)
    found_ids = [r["item"] for r in radius_results]
    assert "loc3" in found_ids


def test_custom_hash_map():
    hmap = CustomHashMap(initial_capacity=5)
    # Test insertion
    hmap.put("key1", "val1")
    hmap.put("key2", "val2")
    hmap.put("key3", "val3")
    
    assert hmap.get("key1") == "val1"
    assert hmap.get("key2") == "val2"
    assert hmap.get("non_existent") is None

    # Test update
    hmap.put("key1", "updated_val1")
    assert hmap.get("key1") == "updated_val1"

    # Test collision handling & resizing
    for i in range(20):
        hmap.put(f"item_{i}", i * 10)

    assert len(hmap) == 23
    assert hmap.get("item_10") == 100

    # Test deletion
    assert hmap.delete("key2") is True
    assert hmap.get("key2") is None
    assert hmap.delete("non_existent") is False


def test_custom_min_heap():
    heap = CustomMinHeap()
    assert heap.is_empty() is True
    assert heap.peek() is None

    # Insert out of order
    heap.insert(4.5, "task_medium")
    heap.insert(1.2, "task_highest")
    heap.insert(8.9, "task_lowest")
    heap.insert(2.3, "task_high")

    assert heap.is_empty() is False
    assert len(heap) == 4
    assert heap.peek().data == "task_highest"

    # Extract minimums in ascending priority order
    extracted = []
    while not heap.is_empty():
        extracted.append(heap.extract_min().data)

    assert extracted == ["task_highest", "task_high", "task_medium", "task_lowest"]


def test_recommendation_scoring():
    location = {"id": "lib", "name": "Library"}
    reading = {
        "relative_intensity": 25.0,
        "noise_category": "Quiet",
        "measured_at": "2026-10-14T10:00:00Z"
    }

    score = compute_recommendation_score(
        location=location,
        latest_reading=reading,
        distance_km=0.2,
        max_radius_km=1.0,
        stale_threshold_minutes=120.0
    )

    assert score["score"] < 0.6  # Quiet and close should yield a low penalty score
    assert "reasons" in score
    assert len(score["reasons"]) > 0


def test_unmeasured_location_penalized_transparently():
    location = {"id": "hall", "name": "Study Hall"}
    # No reading passed
    score = compute_recommendation_score(
        location=location,
        latest_reading=None,
        distance_km=0.1
    )
    # Must NOT be classified as quiet (noise penalty > 0.5)
    assert score["noise_penalty"] >= 0.5
    assert any("uncertainty" in r.lower() or "no active" in r.lower() for r in score["reasons"])
