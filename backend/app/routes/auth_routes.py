import uuid
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from app.config import Config
from app.models.schema import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not username or len(username) < 3:
        return jsonify({"success": False, "error": "Username must be at least 3 characters long"}), 400
    if not email or "@" not in email:
        return jsonify({"success": False, "error": "Valid email address is required"}), 400
    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters long"}), 400

    db_path = current_app.config.get("DATABASE_PATH", Config.DATABASE_PATH)
    conn = get_db_connection(db_path)
    try:
        # Check existing
        cursor = conn.execute("SELECT id FROM app_users WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            return jsonify({"success": False, "error": "A user with this username or email already exists"}), 409

        user_id = f"user_{uuid.uuid4().hex[:12]}"
        password_hash = generate_password_hash(password)
        now_iso = datetime.now(timezone.utc).isoformat()

        conn.execute(
            "INSERT INTO app_users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, email, password_hash, now_iso)
        )
        conn.commit()

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "username": username,
                "email": email,
                "created_at": now_iso
            }
        }), 201
    finally:
        conn.close()


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email_or_username = payload.get("email_or_username", "").strip()
    password = payload.get("password", "")

    if not email_or_username or not password:
        return jsonify({"success": False, "error": "Email/Username and password are required"}), 400

    db_path = current_app.config.get("DATABASE_PATH", Config.DATABASE_PATH)
    conn = get_db_connection(db_path)
    try:
        cursor = conn.execute(
            "SELECT id, username, email, password_hash, created_at FROM app_users WHERE email = ? OR username = ?",
            (email_or_username.lower(), email_or_username)
        )
        row = cursor.fetchone()
        if not row or not check_password_hash(row["password_hash"], password):
            return jsonify({"success": False, "error": "Invalid email/username or password"}), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": row["id"],
                "username": row["username"],
                "email": row["email"],
                "created_at": row["created_at"]
            }
        }), 200
    finally:
        conn.close()
