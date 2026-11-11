from typing import List, Optional, Dict, Any
from app.models.schema import get_db_connection, CampusLocation

class LocationRepository:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def get_all(self, active_only: bool = True, location_type: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_db_connection(self.db_path)
        try:
            query = "SELECT * FROM campus_locations WHERE 1=1"
            params = []
            if active_only:
                query += " AND is_active = 1"
            if location_type and location_type.lower() != "all":
                query += " AND location_type = ?"
                params.append(location_type)
            query += " ORDER BY name ASC"

            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def get_by_id(self, location_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute("SELECT * FROM campus_locations WHERE id = ?", (location_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def create(self, loc: CampusLocation) -> Dict[str, Any]:
        conn = get_db_connection(self.db_path)
        try:
            conn.execute(
                """
                INSERT INTO campus_locations 
                (id, name, latitude, longitude, location_type, description, image_url, is_active, data_source, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    loc.id, loc.name, loc.latitude, loc.longitude, loc.location_type,
                    loc.description, loc.image_url, loc.is_active, loc.data_source,
                    loc.created_at, loc.updated_at
                )
            )
            conn.commit()
            return loc.to_dict()
        finally:
            conn.close()

    def count(self) -> int:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute("SELECT COUNT(*) FROM campus_locations WHERE is_active = 1")
            return cursor.fetchone()[0]
        finally:
            conn.close()
