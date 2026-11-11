from typing import List, Optional, Dict, Any
from app.models.schema import get_db_connection, NoiseReading

class ReadingRepository:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def create(self, reading: NoiseReading) -> Dict[str, Any]:
        conn = get_db_connection(self.db_path)
        try:
            conn.execute(
                """
                INSERT INTO noise_readings
                (id, location_id, relative_intensity, noise_category, measured_at, measurement_method, data_source, device_session_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    reading.id, reading.location_id, reading.relative_intensity,
                    reading.noise_category, reading.measured_at, reading.measurement_method,
                    reading.data_source, reading.device_session_id, reading.created_at
                )
            )
            conn.commit()
            return reading.to_dict()
        finally:
            conn.close()

    def get_latest_for_location(self, location_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute(
                """
                SELECT * FROM noise_readings
                WHERE location_id = ?
                ORDER BY measured_at DESC
                LIMIT 1
                """,
                (location_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def get_latest_for_all_locations(self) -> Dict[str, Dict[str, Any]]:
        """
        Returns a dictionary mapping location_id -> latest reading record.
        Uses SQLite window function ROW_NUMBER for high efficiency.
        """
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute(
                """
                WITH RankedReadings AS (
                    SELECT *,
                           ROW_NUMBER() OVER(PARTITION BY location_id ORDER BY measured_at DESC) as rn
                    FROM noise_readings
                )
                SELECT id, location_id, relative_intensity, noise_category, measured_at, measurement_method, data_source, device_session_id, created_at
                FROM RankedReadings
                WHERE rn = 1
                """
            )
            rows = cursor.fetchall()
            return {row["location_id"]: dict(row) for row in rows}
        finally:
            conn.close()

    def get_history_for_location(self, location_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute(
                """
                SELECT * FROM noise_readings
                WHERE location_id = ?
                ORDER BY measured_at DESC
                LIMIT ?
                """,
                (location_id, limit)
            )
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def count_total(self) -> int:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute("SELECT COUNT(*) FROM noise_readings")
            return cursor.fetchone()[0]
        finally:
            conn.close()
