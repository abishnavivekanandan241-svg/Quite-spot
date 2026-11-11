from typing import List, Optional, Any, Dict
from dataclasses import dataclass
from app.algorithms.spatial_utils import (
    haversine_distance,
    calculate_bounding_box,
    validate_coordinates
)

@dataclass
class BoundingBox:
    min_lat: float
    min_lon: float
    max_lat: float
    max_lon: float

    def contains(self, lat: float, lon: float) -> bool:
        return (self.min_lat <= lat <= self.max_lat) and (self.min_lon <= lon <= self.max_lon)

    def intersects(self, other: 'BoundingBox') -> bool:
        return not (
            other.min_lat > self.max_lat or
            other.max_lat < self.min_lat or
            other.min_lon > self.max_lon or
            other.max_lon < self.min_lon
        )


@dataclass
class SpatialPoint:
    lat: float
    lon: float
    data: Any


class QuadtreeNode:
    def __init__(self, boundary: BoundingBox, capacity: int = 4):
        self.boundary = boundary
        self.capacity = capacity
        self.points: List[SpatialPoint] = []
        self.divided: bool = False
        self.north_west: Optional['QuadtreeNode'] = None
        self.north_east: Optional['QuadtreeNode'] = None
        self.south_west: Optional['QuadtreeNode'] = None
        self.south_east: Optional['QuadtreeNode'] = None

    def subdivide(self):
        mid_lat = (self.boundary.min_lat + self.boundary.max_lat) / 2.0
        mid_lon = (self.boundary.min_lon + self.boundary.max_lon) / 2.0

        # North-West (Higher lat, Lower lon)
        self.north_west = QuadtreeNode(
            BoundingBox(mid_lat, self.boundary.min_lon, self.boundary.max_lat, mid_lon),
            self.capacity
        )
        # North-East (Higher lat, Higher lon)
        self.north_east = QuadtreeNode(
            BoundingBox(mid_lat, mid_lon, self.boundary.max_lat, self.boundary.max_lon),
            self.capacity
        )
        # South-West (Lower lat, Lower lon)
        self.south_west = QuadtreeNode(
            BoundingBox(self.boundary.min_lat, self.boundary.min_lon, mid_lat, mid_lon),
            self.capacity
        )
        # South-East (Lower lat, Higher lon)
        self.south_east = QuadtreeNode(
            BoundingBox(self.boundary.min_lat, mid_lon, mid_lat, self.boundary.max_lon),
            self.capacity
        )
        self.divided = True

    def insert(self, point: SpatialPoint) -> bool:
        if not self.boundary.contains(point.lat, point.lon):
            return False

        # If capacity not reached and not subdivided, append here
        if len(self.points) < self.capacity and not self.divided:
            self.points.append(point)
            return True

        if not self.divided:
            self.subdivide()
            # Re-distribute existing points into quadrants
            existing_points = self.points
            self.points = []
            for p in existing_points:
                self._insert_into_children(p)

        return self._insert_into_children(point)

    def _insert_into_children(self, point: SpatialPoint) -> bool:
        if self.north_west.insert(point):
            return True
        if self.north_east.insert(point):
            return True
        if self.south_west.insert(point):
            return True
        if self.south_east.insert(point):
            return True
        # Edge case: if points share exact boundary boundary coordinates or duplicates
        self.points.append(point)
        return True

    def query_range(self, range_box: BoundingBox, results: List[SpatialPoint]):
        if not self.boundary.intersects(range_box):
            return

        for p in self.points:
            if range_box.contains(p.lat, p.lon):
                results.append(p)

        if self.divided:
            self.north_west.query_range(range_box, results)
            self.north_east.query_range(range_box, results)
            self.south_west.query_range(range_box, results)
            self.south_east.query_range(range_box, results)


class SpatialQuadtree:
    def __init__(self, boundary: BoundingBox, capacity: int = 4):
        self.root = QuadtreeNode(boundary, capacity)
        self.size = 0

    def insert(self, lat: float, lon: float, data: Any) -> bool:
        if not validate_coordinates(lat, lon):
            return False
        point = SpatialPoint(lat=lat, lon=lon, data=data)
        success = self.root.insert(point)
        if success:
            self.size += 1
        return success

    def query_range(self, min_lat: float, min_lon: float, max_lat: float, max_lon: float) -> List[Any]:
        """Query all elements in the given rectangular latitude/longitude range."""
        range_box = BoundingBox(min_lat, min_lon, max_lat, max_lon)
        results: List[SpatialPoint] = []
        self.root.query_range(range_box, results)
        return [p.data for p in results]

    def query_radius(self, center_lat: float, center_lon: float, radius_km: float) -> List[Dict[str, Any]]:
        """
        Query points within a radius (in km) from a center coordinate.
        First uses the Quadtree to filter candidates within the bounding box,
        then verifies the exact Haversine distance.
        Returns: list of dicts with {'item': data, 'distance_km': distance}
        """
        min_lat, max_lat, min_lon, max_lon = calculate_bounding_box(center_lat, center_lon, radius_km)
        range_box = BoundingBox(min_lat, min_lon, max_lat, max_lon)
        candidates: List[SpatialPoint] = []
        self.root.query_range(range_box, candidates)

        verified = []
        for p in candidates:
            dist = haversine_distance(center_lat, center_lon, p.lat, p.lon)
            if dist <= radius_km:
                verified.append({
                    "item": p.data,
                    "distance_km": dist,
                    "lat": p.lat,
                    "lon": p.lon
                })
        # Sort by distance
        verified.sort(key=lambda x: x["distance_km"])
        return verified
