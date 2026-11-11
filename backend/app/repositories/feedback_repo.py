from typing import List, Dict, Any
from app.models.schema import get_db_connection, UserFeedback

class FeedbackRepository:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def create(self, feedback: UserFeedback) -> Dict[str, Any]:
        conn = get_db_connection(self.db_path)
        try:
            conn.execute(
                """
                INSERT INTO user_feedback (id, location_id, feedback_value, user_comment, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (feedback.id, feedback.location_id, feedback.feedback_value, feedback.user_comment, feedback.created_at)
            )
            conn.commit()
            return feedback.to_dict()
        finally:
            conn.close()

    def get_by_location(self, location_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        conn = get_db_connection(self.db_path)
        try:
            cursor = conn.execute(
                """
                SELECT * FROM user_feedback
                WHERE location_id = ?
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (location_id, limit)
            )
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()
