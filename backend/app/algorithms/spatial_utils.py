import math
from typing import Tuple, Dict, Any

EARTH_RADIUS_KM = 6371.0088

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two geographic coordinates
    on Earth using the Haversine formula.
    Returns distance in kilometers.
    """
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    
    # Clamp to avoid floating point errors near 1.0
    a = min(1.0, max(0.0, a))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_KM * c


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Returns distance in meters."""
    return haversine_distance(lat1, lon1, lat2, lon2) * 1000.0


def calculate_bounding_box(center_lat: float, center_lon: float, radius_km: float) -> Tuple[float, float, float, float]:
    """
    Calculate a rectangular bounding box around a center point for a given radius in km.
    Returns: (min_lat, max_lat, min_lon, max_lon)
    """
    lat_delta = radius_km / 111.0
    # Guard against division by zero near poles
    cos_lat = math.cos(math.radians(center_lat))
    lon_delta = radius_km / (111.0 * max(0.001, cos_lat))
    
    return (
        center_lat - lat_delta,
        center_lat + lat_delta,
        center_lon - lon_delta,
        center_lon + lon_delta
    )


def is_point_in_bbox(lat: float, lon: float, min_lat: float, max_lat: float, min_lon: float, max_lon: float) -> bool:
    """Check if point is inside rectangular bounding box."""
    return (min_lat <= lat <= max_lat) and (min_lon <= lon <= max_lon)


def validate_coordinates(lat: Any, lon: Any) -> bool:
    """Validate latitude and longitude ranges."""
    try:
        f_lat = float(lat)
        f_lon = float(lon)
        return (-90.0 <= f_lat <= 90.0) and (-180.0 <= f_lon <= 180.0)
    except (ValueError, TypeError):
        return False
