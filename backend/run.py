import os
from app import create_app
from app.config import Config

app = create_app(Config)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1")
    print(f"Starting QuietSpot Backend on http://{host}:{port} (debug={debug})")
    app.run(host=host, port=port, debug=debug)
