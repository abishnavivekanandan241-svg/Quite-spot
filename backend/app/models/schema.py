import sqlite3
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime, timezone

SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS campus_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    location_type TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    data_source TEXT NOT NULL DEFAULT 'verified_osm',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_locations_coords ON campus_locations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_locations_active ON campus_locations (is_active);

CREATE TABLE IF NOT EXISTS noise_readings (
    id TEXT PRIMARY KEY,
    location_id TEXT NOT NULL,
    relative_intensity REAL NOT NULL,
    noise_category TEXT NOT NULL,
    measured_at TEXT NOT NULL,
    measurement_method TEXT NOT NULL,
    data_source TEXT NOT NULL,
    device_session_id TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES campus_locations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_readings_loc_time ON noise_readings (location_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_time ON noise_readings (measured_at DESC);

CREATE TABLE IF NOT EXISTS user_feedback (
    id TEXT PRIMARY KEY,
    location_id TEXT NOT NULL,
    feedback_value TEXT NOT NULL,
    user_comment TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES campus_locations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_location ON user_feedback (location_id);

CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""

@dataclass
class CampusLocation:
    id: str
    name: str
    latitude: float
    longitude: float
    location_type: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: int = 1
    data_source: str = "verified_osm"
    created_at: str = ""
    updated_at: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class NoiseReading:
    id: str
    location_id: str
    relative_intensity: float
    noise_category: str
    measured_at: str
    measurement_method: str
    data_source: str
    device_session_id: Optional[str] = None
    created_at: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class UserFeedback:
    id: str
    location_id: str
    feedback_value: str
    user_comment: Optional[str] = None
    created_at: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def get_db_connection(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_database(db_path: str):
    conn = get_db_connection(db_path)
    try:
        conn.executescript(SCHEMA_SQL)
        conn.commit()
    finally:
        conn.close()
