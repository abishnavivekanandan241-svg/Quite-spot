import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = os.environ.get("DATABASE_PATH", str(BASE_DIR / "quietspot.db"))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "quietspot-dev-secret-key-change-in-production")
    DATABASE_PATH = DB_PATH
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1")
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "0.0.0.0")
    
    # Campus geospatial boundaries (Kongu Engineering College, Perundurai)
    CAMPUS_BOUNDS = {
        "min_lat": 11.2650,
        "max_lat": 11.2800,
        "min_lon": 77.5950,
        "max_lon": 77.6150,
        "center_lat": 11.27218,
        "center_lon": 77.60400,
        "campus_name": "Kongu Engineering College",
        "campus_address": "Perundurai Railway Station Road, Thoppupalayam, Perundurai, Erode, Tamil Nadu 638060"
    }
    
    # Freshness threshold in minutes (readings older than this are considered stale)
    STALE_THRESHOLD_MINUTES = int(os.environ.get("STALE_THRESHOLD_MINUTES", 120))
    FRESH_THRESHOLD_MINUTES = int(os.environ.get("FRESH_THRESHOLD_MINUTES", 30))
    
    # Noise classification thresholds (Relative intensity scale 0 - 100)
    NOISE_THRESHOLDS = {
        "quiet_max": 45.0,     # Below 45 is Quiet
        "moderate_max": 65.0,  # 45 to 65 is Moderate
                               # Above 65 is Noisy
    }
    
    # Default recommendation weights
    RECOMMENDATION_WEIGHTS = {
        "noise": 0.50,
        "distance": 0.30,
        "age": 0.20
    }
