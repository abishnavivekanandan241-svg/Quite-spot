from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.algorithms.min_heap import CustomMinHeap

def parse_iso_time(iso_str: str) -> Optional[datetime]:
    if not iso_str:
        return None
    try:
        # Handle 'Z' suffix or standard ISO format
        clean_str = iso_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


def calculate_age_minutes(measured_at_str: str, now: Optional[datetime] = None) -> float:
    """Calculate age of reading in minutes."""
    dt = parse_iso_time(measured_at_str)
    if not dt:
        return 999999.0
    if now is None:
        now = datetime.now(timezone.utc)
    diff = (now - dt).total_seconds()
    return max(0.0, diff / 60.0)


def compute_recommendation_score(
    location: Dict[str, Any],
    latest_reading: Optional[Dict[str, Any]],
    distance_km: float,
    max_radius_km: float = 1.0,
    stale_threshold_minutes: float = 120.0,
    weights: Optional[Dict[str, float]] = None,
    now: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Computes multi-factor score:
    Score = w_N * NoisePenalty + w_D * DistancePenalty + w_A * AgePenalty
    Lower score = more quiet, close, and fresh.
    """
    if weights is None:
        weights = {"noise": 0.50, "distance": 0.30, "age": 0.20}

    w_n = weights.get("noise", 0.50)
    w_d = weights.get("distance", 0.30)
    w_a = weights.get("age", 0.20)

    reasons = []

    # 1. Noise Penalty (0.0 to 1.0)
    if latest_reading and "relative_intensity" in latest_reading:
        intensity = float(latest_reading["relative_intensity"])
        category = latest_reading.get("noise_category", "Unknown")
        # Normalize: 20 -> 0.0, 80 -> 1.0
        clamped_intensity = max(20.0, min(80.0, intensity))
        noise_penalty = (clamped_intensity - 20.0) / 60.0

        if category == "Quiet":
            reasons.append(f"Quiet environment (est. {intensity:.1f})")
        elif category == "Moderate":
            reasons.append(f"Moderate sound levels (est. {intensity:.1f})")
        else:
            reasons.append(f"Elevated sound levels (est. {intensity:.1f})")
    else:
        # Transparent missing data penalty: do not assume unmeasured is quiet!
        noise_penalty = 0.65
        reasons.append("No active measurement (penalized for data uncertainty)")

    # 2. Distance Penalty (0.0 to 1.0)
    effective_max_radius = max(0.2, max_radius_km)
    distance_penalty = min(1.0, distance_km / effective_max_radius)
    dist_meters = distance_km * 1000.0
    if dist_meters < 300:
        reasons.append(f"Very close ({dist_meters:.0f}m away)")
    elif dist_meters < 800:
        reasons.append(f"Walking distance ({dist_meters:.0f}m away)")
    else:
        reasons.append(f"Across campus ({distance_km:.2f}km away)")

    # 3. Age / Freshness Penalty (0.0 to 1.0)
    if latest_reading and latest_reading.get("measured_at"):
        age_min = calculate_age_minutes(latest_reading["measured_at"], now)
        age_penalty = min(1.0, age_min / max(1.0, stale_threshold_minutes))
        if age_min <= 15:
            reasons.append("Very fresh observation (< 15 min)")
        elif age_min <= 60:
            reasons.append(f"Observation recorded {int(age_min)} min ago")
        else:
            reasons.append("Older observation, confidence reduced")
    else:
        age_penalty = 1.0
        reasons.append("No recent observations")

    # Composite Score
    total_score = (w_n * noise_penalty) + (w_d * distance_penalty) + (w_a * age_penalty)

    return {
        "score": round(total_score, 4),
        "noise_penalty": round(noise_penalty, 4),
        "distance_penalty": round(distance_penalty, 4),
        "age_penalty": round(age_penalty, 4),
        "distance_km": round(distance_km, 4),
        "distance_meters": round(dist_meters, 1),
        "reasons": reasons
    }


def rank_recommendations_with_heap(
    scored_candidates: List[Dict[str, Any]],
    top_k: int = 10
) -> List[Dict[str, Any]]:
    """
    Uses CustomMinHeap to extract the top_k best ranked candidates.
    """
    min_heap = CustomMinHeap()
    for item in scored_candidates:
        min_heap.insert(priority=item["score_details"]["score"], data=item)

    ranked = []
    count = 0
    while not min_heap.is_empty() and count < top_k:
        heap_item = min_heap.extract_min()
        ranked.append(heap_item.data)
        count += 1

    return ranked
