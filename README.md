# QuietSpot — Intelligent Campus Noise Mapping and Quiet-Spot Recommendation System Using Quadtree

**Institution:** Kongu Engineering College (KEC), Perundurai, Erode, Tamil Nadu, India  
**Official Website:** [https://kongu.ac.in/](https://kongu.ac.in/)  
**Verified Campus Reference Coordinates:** Latitude `11.27218° N`, Longitude `77.60400° E`

---

## 1. Project Overview

QuietSpot is a full-stack, responsive, geospatial noise-monitoring and study spot recommendation system tailored specifically for students, researchers, and faculty at Kongu Engineering College.

The application allows students to discover verified study spaces across campus (such as the CD Memorial Central Library, academic reading halls, and quiet department zones), inspect real client-contributed sound intensity levels, monitor their own local acoustic environment using in-browser Web Audio processing, and explore custom spatial data structures (2D Quadtree, Min-Heap, and Hash Map) with empirical runtime benchmarks.

---

## 2. Key Features

- **Verified Campus Geography:** Built on real OpenStreetMap survey coordinates for Kongu Engineering College buildings, libraries, canteens, and hostels.
- **Strict Privacy-First Audio Processing:** Client-side Web Audio API RMS estimation. Raw audio is never recorded, never stored on disk, and never transmitted to the server.
- **Authentic Data Provenance:** Zero fake metrics, zero fabricated benchmark numbers, and zero hard-coded noise values disguised as live telemetry. Unmeasured and stale spots (> 120 min) are honestly labelled.
- **Custom Spatial Quadtree:** Built from scratch in Python (`quadtree.py`) with 2D bounding-box subdivision, range queries, and circular radius pruning with Haversine distance verification.
- **Custom Min-Heap Priority Queue:** Array-backed binary Min-Heap (`min_heap.py`) for multi-factor candidate scoring and top-K recommendation retrieval.
- **Custom Hash Map:** Custom collision-handled hash map (`custom_hash_map.py`) using polynomial rolling hash and separate chaining.
- **Algorithm Performance Lab:** Interactive benchmarking suite comparing Quadtree against Linear Scan with high-resolution nanosecond timers and 100% result equality verification.
- **Interactive Campus Map:** Responsive Leaflet map with custom SVG noise-coded pins, recenter, locate-me, and direct navigation links.
- **Real Navigation Routing:** 1-click turn-by-turn walking routes opened directly in Google Maps.
- **Student Verification Feedback:** Ground-truth reporting system allowing students to confirm or dispute live acoustic levels.
- **Mobile-First Responsive UI:** Engineered to match the Figma visual direction (green, white, neutral darks) with desktop header and sticky mobile bottom navigation.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + Vite 5
- **Routing:** React Router v6 (HashRouter for single-page routing resilience)
- **Map Engine:** Leaflet with OpenStreetMap tiles (with clean Google Maps Platform toggle)
- **Audio Processing:** W3C Web Audio API (`AudioContext`, `AnalyserNode`, Float32 PCM RMS)
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with custom design tokens matching Figma specifications
- **Testing:** Vitest

### Backend
- **Framework:** Python 3.13 + Flask 3.1 + Flask-CORS
- **Persistence:** SQLite with foreign key enforcement and composite indexes
- **Algorithms:** Custom 2D Spatial Quadtree, Custom Binary Min-Heap, Custom Hash Map
- **Validation:** Strict payload sanitizer rejecting raw audio fields
- **Testing:** pytest 9.1

---

## 4. Project Directory Structure

```
quietspot/
├── design-references/          # Folder for Figma screenshot references
│   └── README.md
├── docs/                       # Comprehensive project documentation
│   ├── PROJECT_SPECIFICATION.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_DESIGN.md
│   ├── TEST_REPORT.md
│   └── USER_GUIDE.md
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask application factory & CORS setup
│   │   ├── config.py           # Configuration & KEC campus boundary coordinates
│   │   ├── models/
│   │   │   └── schema.py       # Dataclass models & SQLite schema definitions
│   │   ├── repositories/       # Location, Reading, and Feedback data access
│   │   ├── services/           # Freshness, Recommendation, and Benchmark services
│   │   ├── algorithms/
│   │   │   ├── quadtree.py         # Custom 2D Spatial Quadtree
│   │   │   ├── custom_hash_map.py  # Custom Hash Map with collision chaining
│   │   │   ├── min_heap.py         # Custom binary Min-Heap
│   │   │   ├── recommendation.py   # Multi-penalty scoring formulas
│   │   │   └── spatial_utils.py    # Haversine distance & bounding math
│   │   ├── audio/
│   │   │   └── noise_processing.py # Payload validation & raw-audio rejection
│   │   └── routes/             # REST API Blueprints
│   ├── tests/                  # Pytest automated test suite
│   ├── init_db.py              # Database initialization & seed script
│   ├── run.py                  # Backend server entrypoint
│   ├── requirements.txt        # Python dependencies
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React root mount
│   │   ├── App.jsx             # Main Router layout
│   │   ├── index.css           # Figma-matched design tokens & responsive CSS
│   │   ├── components/         # Navbar, BottomNav, CampusMap, LocationCard, Visualizer
│   │   ├── pages/              # Landing, Dashboard, Map, Spots, Detail, Monitor, Lab, Settings, Auth
│   │   ├── hooks/              # useNoiseMonitoring, useGeolocation
│   │   ├── services/           # api.js, audioProcessor.js
│   │   ├── utils/              # constants.js, formatters.js
│   │   └── tests/              # Vitest test suite
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 5. Prerequisites

Before running the application, ensure the following are installed on your machine:
- **Python:** 3.10 or higher (Python 3.13 recommended)
- **Node.js:** v18 or higher (Node v22 recommended)
- **npm:** v9 or higher

---

## 6. Installation & Setup

### 6.1 Backend Installation

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

3. Initialize and seed the SQLite database with verified KEC campus coordinates:
   ```bash
   python init_db.py
   ```
   *Expected output: `Successfully seeded 12 verified KEC locations and 7 demonstration readings.`*

4. Start the Flask backend server:
   ```bash
   python run.py
   ```
   The backend will start on `http://127.0.0.1:5000`.

---

### 6.2 Frontend Installation

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173/`.

---

## 7. Running Automated Tests

### 7.1 Backend Tests (`pytest`)
To run all 21 backend unit and integration tests (algorithms, endpoints, validation):
```bash
cd backend
python -m pytest -v
```
*Result: 21 passed in 1.00s.*

### 7.2 Frontend Tests (`vitest`)
To run the frontend unit tests (audio processor, formatting, navigation URL builder):
```bash
cd frontend
npm test
```
*Result: 7 passed in 727ms.*

---

## 8. Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Port for Flask REST API |
| `HOST` | `0.0.0.0` | Binding interface |
| `FLASK_DEBUG` | `True` | Debug mode |
| `DATABASE_PATH` | `quietspot.db` | Path to SQLite database file |
| `STALE_THRESHOLD_MINUTES` | `120` | Threshold after which readings are marked Stale |
| `FRESH_THRESHOLD_MINUTES` | `30` | Threshold for Fresh observation badge |

### Frontend (`frontend/.env`)
| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API endpoint |
| `VITE_GOOGLE_MAPS_API_KEY` | *(optional)* | Google Maps JavaScript API key (OpenStreetMap used automatically if omitted) |

---

## 9. Google Maps Configuration

The application includes an integrated navigation interface that works automatically with:
1. **Interactive Leaflet Campus Map:** Uses authentic OpenStreetMap tiles with custom SVG noise markers centered on KEC.
2. **Turn-by-Turn Navigation:** When clicking **Navigate**, the app generates a direct directions URL:
   `https://www.google.com/maps/dir/?api=1&destination=11.2709624,77.6052846`
   This opens the user's native Google Maps app or browser tab with turn-by-turn walking guidance from their current location to the KEC building.
3. **Optional Google Maps API Key:** If you have a Google Cloud project with Maps JavaScript API enabled, add your key to `frontend/.env` as `VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY`.

---

## 10. Privacy Model & Audio Processing

- **No Secret Audio Capture:** Monitoring can only begin after the user explicitly clicks **Start Monitoring** and grants browser microphone permission.
- **In-Memory RMS Calculation:** The browser's `AudioContext` connects the microphone stream to an `AnalyserNode` which calculates:
  $$\text{RMS} = \sqrt{\frac{1}{N}\sum_{i=0}^{N-1} x[i]^2}$$
  The audio buffers are never written to disk or storage and are immediately discarded.
- **No Speaker Output:** The analyser node is deliberately disconnected from `audioContext.destination`, ensuring sound is never played through speakers.
- **Server Safeguards:** The Flask backend inspects all incoming payloads. If any raw audio field (`audio_bytes`, `pcm_data`, `base64_audio`) is detected, the request is immediately rejected with HTTP 400.

---

## 11. Adding Verified Campus Locations

To add more campus buildings to the database:
1. Obtain verified coordinates from OpenStreetMap or GPS measurements on campus.
2. Add the record to `VERIFIED_KEC_LOCATIONS` in `backend/init_db.py` or execute an SQL insert:
   ```sql
   INSERT INTO campus_locations (id, name, latitude, longitude, location_type, description, is_active, data_source, created_at, updated_at)
   VALUES ('kec_new_block', 'Civil Engineering Block', 11.27150, 77.60450, 'Academic', 'Classrooms and study lounge', 1, 'verified_survey', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   ```
3. Re-run `python init_db.py`.

---

## 12. Troubleshooting

- **Microphone permission denied:** Open browser site settings (`chrome://settings/content/microphone`), ensure microphone access is set to *Allow*, and reload the page.
- **Backend connection error:** Verify that `python run.py` is running in the `backend/` folder and listening on port 5000. Test with `curl http://127.0.0.1:5000/api/health`.
- **Map tiles not loading:** Ensure you have an active internet connection to download OpenStreetMap tile imagery.
