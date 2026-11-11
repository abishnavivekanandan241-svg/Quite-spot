# QuietSpot — Implementation Plan & Traceability Matrix

## 1. Project Overview & Target Directory Structure

The project is structured into distinct, modular layers following clean software architecture principles:

```
quite spot 2/
├── design-references/          # Folder for Figma design screenshots (user uploads)
├── docs/                       # Specifications, plans, benchmarks & guides
│   ├── PROJECT_SPECIFICATION.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_DESIGN.md
│   ├── TEST_REPORT.md
│   └── USER_GUIDE.md
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask app factory, CORS, blueprints
│   │   ├── config.py           # Environment-based configuration
│   │   ├── models/
│   │   │   └── schema.py       # Dataclasses & SQLite schema definitions
│   │   ├── repositories/
│   │   │   ├── location_repo.py# Location persistence & queries
│   │   │   ├── reading_repo.py # Noise readings persistence & queries
│   │   │   └── feedback_repo.py# User feedback persistence
│   │   ├── services/
│   │   │   ├── recommendation_service.py # Multi-criteria ranking
│   │   │   ├── freshness_service.py      # Age calculation & category derivation
│   │   │   └── benchmark_service.py      # Runtime spatial benchmark
│   │   ├── algorithms/
│   │   │   ├── quadtree.py         # Custom 2D spatial quadtree
│   │   │   ├── custom_hash_map.py  # Custom hash table with collision handling
│   │   │   ├── min_heap.py         # Custom priority queue
│   │   │   ├── recommendation.py   # Mathematical scoring formulas
│   │   │   └── spatial_utils.py    # Haversine distance & bounding math
│   │   ├── audio/
│   │   │   └── noise_processing.py # Server-side payload validation & scales
│   │   └── routes/
│   │       ├── health_routes.py    # GET /api/health
│   │       ├── location_routes.py  # GET /api/locations, /api/locations/<id>
│   │       ├── reading_routes.py   # POST /api/readings, GET /api/locations/<id>/readings
│   │       ├── recommendation_routes.py # GET /api/recommendations
│   │       ├── feedback_routes.py  # POST /api/feedback
│   │       └── benchmark_routes.py # POST /api/benchmark
│   ├── tests/
│   │   ├── test_algorithms.py      # Quadtree, HashMap, MinHeap unit tests
│   │   ├── test_api_endpoints.py   # Health, locations, readings, benchmarks
│   │   └── test_noise_processing.py# Validation & threshold tests
│   ├── init_db.py              # Database initialization & seed script
│   ├── run.py                  # Entry point for backend server
│   ├── requirements.txt        # Backend dependencies
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React root mount
│   │   ├── App.jsx             # React Router routing & layout provider
│   │   ├── index.css           # Design tokens, variables & resets (Figma palette)
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Badge, Modal, Navbar, BottomNav
│   │   │   ├── map/            # CampusMap (Leaflet with Google Maps toggle)
│   │   │   ├── monitoring/     # LiveNoiseMonitor, AudioVisualizer, MicPermission
│   │   │   ├── cards/          # LocationCard, QuietSpotItem, MetricCard
│   │   │   └── charts/         # ReadingTrendChart (Recharts/Canvas)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, features, CTA
│   │   │   ├── DashboardPage.jsx       # Campus overview, live metrics, stats
│   │   │   ├── MapPage.jsx             # Full-screen interactive campus map
│   │   │   ├── QuietSpotsPage.jsx      # Filterable quiet spots list
│   │   │   ├── LocationDetailPage.jsx  # Location deep dive, history, navigation
│   │   │   ├── MonitoringPage.jsx      # Live microphone analysis studio
│   │   │   ├── RecommendationsPage.jsx # Ranked recommendation list
│   │   │   ├── BenchmarkLabPage.jsx    # Quadtree vs Linear search lab
│   │   │   ├── SettingsPage.jsx        # Privacy, permissions, data governance
│   │   │   └── AuthPage.jsx            # Login & registration demo / mock
│   │   ├── hooks/
│   │   │   ├── useNoiseMonitoring.js   # Web Audio API lifecycle hook
│   │   │   ├── useCampusLocations.js   # Fetch & filter locations
│   │   │   ├── useGeolocation.js       # Browser geolocation with manual fallback
│   │   │   └── useIntervalPolling.js   # Live data refresher hook
│   │   ├── services/
│   │   │   ├── api.js                  # Fetch wrapper for backend API
│   │   │   └── audioProcessor.js       # Web Audio RMS & dB calculation
│   │   └── utils/
│   │       ├── formatters.js           # Date, distance, decibel formatters
│   │       └── constants.js            # KEC coordinates, categories, colors
│   ├── public/
│   │   └── favicon.ico
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── tests/
│       ├── audioProcessor.test.js
│       └── components.test.jsx
├── README.md
└── .gitignore
```

---

## 2. Implementation Phases & Milestones

### Phase 1: Workspace Inspection, Setup & Design Verification (Current)
- Inspect environment tools: Python 3.13, Node 22, npm 10 verified.
- Confirm missing Figma assets: Notify user to place images in `design-references/`.
- Establish project documents (`PROJECT_SPECIFICATION.md`, `IMPLEMENTATION_PLAN.md`).

### Phase 2: Project Foundation & Environment Setup
- Initialize Python backend: virtualenv or direct dependencies, `requirements.txt`, `config.py`.
- Initialize Vite + React frontend with modern scripts.
- Implement database initialization script (`init_db.py`) with authentic KEC campus seed points and clear provenance tags.
- Implement `GET /api/health` and verify frontend-to-backend communication.

### Phase 3: Design System & Core UI Shell (Figma Fidelity)
- Configure CSS design tokens: Green (`#16a34a`, `#22c55e`, `#15803d`), neutral darks (`#0f172a`, `#1e293b`), whites/grays, card shadows, pill buttons, badges.
- Responsive layout shell: Desktop persistent navigation sidebar / header, mobile sticky bottom navigation bar.
- Reusable components: Button variants, LocationCard, NoiseBadge, StatusIndicator, PrivacyNoticeModal.

### Phase 4: Spatial Algorithms & Backend Architecture
- Custom 2D Spatial Quadtree (`quadtree.py`): Subdivide, insert, bounding box search, circle radius pruning.
- Custom Hash Map (`custom_hash_map.py`): Chained collision handling, load factor re-hashing, O(1) lookup.
- Custom Min-Heap (`min_heap.py`): Array-backed priority queue, sift-up, sift-down, extract-min.
- Spatial utilities (`spatial_utils.py`): Authentic Haversine distance formula, bounding box calculation.
- Recommendation algorithm (`recommendation.py`): Normalized multi-penalty score calculation.
- Unit tests for all algorithms with edge case coverage.

### Phase 5: RESTful API & Persistence Layer
- SQLite database schema: `campus_locations`, `noise_readings`, `user_feedback`, `app_users`.
- Repositories with parameterized queries and strict input validation.
- Audio validation module: Reject raw audio payloads, validate derived metrics, verify campus bounds.
- Full API routes: `/api/locations`, `/api/readings`, `/api/recommendations`, `/api/benchmark`, `/api/feedback`.

### Phase 6: Web Audio API & In-Browser Noise Monitoring
- Local Web Audio API pipeline (`useNoiseMonitoring.js`):
  - Safe user-initiated microphone stream acquisition.
  - `AudioContext` + `AnalyserNode` real-time RMS calculation.
  - Visual frequency / amplitude waveform canvas or bar indicator.
  - Clean resource teardown (tracks stopped, context closed) on pause/stop/unmount.
  - Contribution toggle: sends throttled JSON payload with derived RMS and relative intensity every N seconds.
  - Strict privacy safeguards: no raw audio upload, no persistent audio buffers.

### Phase 7: Interactive Campus Map & KEC Data
- Leaflet / React Leaflet centered on verified KEC campus coordinates (`11.27218° N, 77.60400° E`).
- Clean Google Maps integration toggle interface (`VITE_GOOGLE_MAPS_API_KEY`).
- Location markers with custom SVG noise category pins (Quiet = Emerald Green, Moderate = Amber, Noisy = Rose, Unknown/Stale = Slate Gray).
- Recenter on KEC button, locate-me button, interactive popup with navigation link.

### Phase 8: Frontend Pages & Feature Delivery
- **Landing Page**: QuietSpot branding, hero statement, value propositions, feature pills, CTAs.
- **Campus Dashboard**: Real calculated stats (total locations, active readings, quiet percentage), quick map preview, top recommendations.
- **Campus Map Page**: Full-screen responsive map with search, category filtering, freshness indicators.
- **Quiet Spots List Page**: Grid/list of campus locations with category badges, real distances, last reading timestamps.
- **Location Detail Page**: Historical trend chart, metadata, navigate action, user feedback widget.
- **Live Noise Monitoring Page**: Microphone controls, live gauge/meter, calibration notes, contribution status.
- **Algorithm Performance Lab**: Interactive runner comparing Quadtree vs Linear search on varying datasets, with execution timers and equality checks.
- **Settings & Privacy Page**: Detailed privacy disclosures, microphone/location permissions status.
- **Auth Page**: Clean login/register interface matching Figma design with client validation and demo mode.

### Phase 9: Automated Testing & Verification
- Backend pytest suite: 100% passing tests for algorithms, endpoints, validation, and security rules.
- Frontend test suite: Component rendering, audio calculation, mock API handling.
- Mobile and desktop responsive verification across 360px, 768px, 1024px, 1440px.

### Phase 10: Final Documentation & Delivery
- Comprehensive `README.md` with setup commands, environment variables, and architecture diagrams.
- API documentation, database schema docs, and verification report.

---

## 3. Requirements Traceability Checklist

| Requirement ID | Description | Primary Target Files | Automated Test / Verification |
|---|---|---|---|
| **REQ-01** | Zero fake metrics / Authentic provenance | `models/schema.py`, `services/freshness_service.py`, `utils/formatters.js` | `test_noise_processing.py` |
| **REQ-02** | Privacy-first local Web Audio RMS analysis | `frontend/src/hooks/useNoiseMonitoring.js`, `frontend/src/services/audioProcessor.js` | `audioProcessor.test.js`, Manual mic test |
| **REQ-03** | No raw audio upload / strict rejection | `backend/app/audio/noise_processing.py`, `backend/app/routes/reading_routes.py` | `test_noise_processing.py::test_reject_raw_audio` |
| **REQ-04** | Kongu Engineering College verified coordinates | `backend/init_db.py`, `frontend/src/utils/constants.js` | Verified against OpenStreetMap node 654765252 |
| **REQ-05** | Custom 2D Spatial Quadtree | `backend/app/algorithms/quadtree.py` | `test_algorithms.py::test_quadtree_*` |
| **REQ-06** | Custom Hash Map with collision handling | `backend/app/algorithms/custom_hash_map.py` | `test_algorithms.py::test_hash_map_*` |
| **REQ-07** | Custom Min-Heap priority queue | `backend/app/algorithms/min_heap.py` | `test_algorithms.py::test_min_heap_*` |
| **REQ-08** | Multi-factor Recommendation Algorithm | `backend/app/algorithms/recommendation.py`, `services/recommendation_service.py` | `test_algorithms.py::test_recommendations` |
| **REQ-09** | Algorithm Performance Lab & Equality Check | `backend/app/services/benchmark_service.py`, `frontend/src/pages/BenchmarkLabPage.jsx` | `test_api_endpoints.py::test_benchmark_endpoint` |
| **REQ-10** | Interactive Campus Map with KEC Bounds | `frontend/src/components/map/CampusMap.jsx`, `frontend/src/pages/MapPage.jsx` | Visual & Leaflet component tests |
| **REQ-11** | Location Filtering & Category Freshness | `frontend/src/pages/QuietSpotsPage.jsx`, `backend/app/services/freshness_service.py` | `test_api_endpoints.py::test_location_freshness` |
| **REQ-12** | Location Detail & Historical Noise Trends | `frontend/src/pages/LocationDetailPage.jsx`, `backend/app/routes/reading_routes.py` | `test_api_endpoints.py::test_location_readings` |
| **REQ-13** | User Feedback Persistence | `backend/app/routes/feedback_routes.py`, `backend/app/repositories/feedback_repo.py` | `test_api_endpoints.py::test_feedback_endpoint` |
| **REQ-14** | Responsive Mobile & Desktop Layout | `frontend/src/index.css`, `frontend/src/components/common/Navbar.jsx`, `BottomNav.jsx` | Responsive viewport testing (360px - 1440px) |
| **REQ-15** | Navigation & Real Directions Integration | `frontend/src/utils/formatters.js`, `frontend/src/pages/LocationDetailPage.jsx` | Real external Google Maps URL builder |
