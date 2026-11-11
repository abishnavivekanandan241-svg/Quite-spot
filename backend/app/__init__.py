import logging
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.models.schema import init_database
from app.routes.health_routes import health_bp
from app.routes.location_routes import location_bp
from app.routes.reading_routes import reading_bp
from app.routes.recommendation_routes import recommendation_bp
from app.routes.feedback_routes import feedback_bp
from app.routes.benchmark_routes import benchmark_bp
from app.routes.auth_routes import auth_bp

def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Logging setup
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database Schema if needed
    init_database(app.config["DATABASE_PATH"])

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(location_bp)
    app.register_blueprint(reading_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(benchmark_bp)
    app.register_blueprint(auth_bp)

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": "Requested resource was not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {error}")
        return jsonify({"success": False, "error": "Internal server error occurred"}), 500

    return app
