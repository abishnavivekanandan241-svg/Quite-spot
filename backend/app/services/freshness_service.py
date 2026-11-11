from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.config import Config
from app.algorithms.recommendation import calculate_age_minutes

class FreshnessService:
    def __init__(self, fresh_minutes: int = Config.FRESH_THRESHOLD_MINUTES, stale_minutes: int = Config.STALE_THRESHOLD_MINUTES):
        self.fresh_minutes = fresh_minutes
        self.stale_minutes = stale_minutes

    def evaluate_reading_freshness(self, reading: Optional[Dict[str, Any]], now: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Determines whether a reading is Fresh, Aging, Stale, or Missing.
        Returns a rich status object.
        """
        if not reading or not reading.get("measured_at"):
            return {
                "status": "No Data",
                "is_usable": False,
                "age_minutes": None,
                "label": "No Readings Yet",
                "display_category": "Unknown"
            }

        age_min = calculate_age_minutes(reading["measured_at"], now)
        raw_category = reading.get("noise_category", "Unknown")

        if age_min <= self.fresh_minutes:
            return {
                "status": "Fresh",
                "is_usable": True,
                "age_minutes": round(age_min, 1),
                "label": f"Fresh ({int(age_min)}m ago)",
                "display_category": raw_category
            }
        elif age_min <= self.stale_minutes:
            return {
                "status": "Aging",
                "is_usable": True,
                "age_minutes": round(age_min, 1),
                "label": f"Aging ({int(age_min)}m ago)",
                "display_category": raw_category
            }
        else:
            return {
                "status": "Stale",
                "is_usable": False,
                "age_minutes": round(age_min, 1),
                "label": f"Stale (> {int(self.stale_minutes)}m ago)",
                "display_category": "Unknown / Stale"
            }

    def enrich_location_with_freshness(self, location: Dict[str, Any], latest_reading: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Merges location data with its latest reading and computed freshness.
        """
        enriched = dict(location)
        freshness_info = self.evaluate_reading_freshness(latest_reading)
        
        enriched["latest_reading"] = latest_reading
        enriched["freshness"] = freshness_info
        enriched["current_noise_category"] = freshness_info["display_category"]
        enriched["has_recent_reading"] = freshness_info["is_usable"]

        return enriched
