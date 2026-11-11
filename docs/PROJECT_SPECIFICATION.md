# QuietSpot — Project Specification
**Intelligent Campus Noise Mapping and Quiet-Spot Recommendation System Using Quadtree**
*Institution:* Kongu Engineering College (KEC), Thoppupalayam, Perundurai, Erode, Tamil Nadu 638060, India.  
*Official Institution URL:* [https://kongu.ac.in/](https://kongu.ac.in/)  
*Verified Campus Center:* Latitude `11.27218° N`, Longitude `77.60400° E`  
*Campus Extent / Bounding Box:* Lat `[11.2670, 11.2765]`, Lon `[77.5990, 77.6105]`

---

## 1. System Vision & Objectives
QuietSpot is a full-stack, responsive, geospatial noise-monitoring and study spot recommendation system tailored specifically for students, faculty, and visitors at Kongu Engineering College. 

The application enables students to:
1. Discover verified study spots across the KEC campus (e.g., CD Memorial Central Library, quiet departmental reading areas, convention centre study rooms, outdoor lawns).
2. Inspect real, verified noise categorizations (**Quiet**, **Moderate**, **Noisy**, or **Unknown/Stale**) based on recent client-contributed environmental sound measurements.
3. Conduct local, in-browser environmental sound intensity analysis using the **Web Audio API** under strict privacy boundaries (raw audio is processed strictly client-side and never saved or transmitted).
4. Voluntarily contribute anonymous, derived relative sound intensity observations to the central campus database.
5. Search and filter quiet spots using a custom **Quadtree** spatial data structure compared against a linear search baseline in the interactive **Algorithm Performance Lab**.
6. Receive multi-factor recommendations ranked via a custom **Min-Heap** incorporating noise penalty, distance penalty, and measurement age/freshness penalty.
7. Navigate to verified campus locations with real navigation routes or straight-line distance fallback.

---

## 2. Non-Negotiable Rules & Data Integrity
1. **Zero Fake Metrics:** Hardcoded noise levels masquerading as live telemetry, fake online student counters, fabricated benchmark millisecond timers, and synthetic GPS traces are strictly prohibited.
2. **Clear Data Provenance:** Every point of data rendered in the UI is tagged as:
   - `Live Measurement`: Derived from the current client device's microphone during an active monitoring session.
   - `Stored Measurement`: Historical derived measurement stored in SQLite with recorded timestamp and method.
   - `Verified Campus Location`: Sourced from verified OpenStreetMap and official KEC campus survey data.
   - `Demonstration Data`: Clearly marked development seed records with transparent badges.
   - `Unknown / Stale`: Explicitly indicated when no recent reading (< 120 minutes configurable) exists.
3. **Privacy First (No Audio Capture/Upload):** Raw audio streams from `getUserMedia` are processed in volatile memory via Web Audio `AnalyserNode`. Samples are converted to root-mean-square (RMS) relative amplitude and discarded immediately. No raw audio byte, recording, or audio stream ever leaves the browser or touches the database.
4. **Authentic Campus Focus:** The application is exclusively centered on Kongu Engineering College. Coordinates outside the verified campus perimeter are rejected.
5. **Real Visual Direction:** Visual styling adopts the Figma green/white/neutral palette, clean typography, mobile-first responsive cards, and desktop/tablet/mobile layouts.

---

## 3. System Architecture & Component Breakdown

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  React (Vite) + Vanilla CSS / CSS Modules + React Router                        |
|                                                                                 |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  | Web Audio Engine   |  | Leaflet / G-Maps   |  | Algorithm Lab & Visualizer|  |
|  | RMS / Noise Filter |  | Campus Bounds & Pin|  | Quadtree vs Linear Search |  |
|  +--------------------+  +--------------------+  +---------------------------+  |
|                                                                                 |
+---------------------------------------+-----------------------------------------+
                                        | REST API (JSON)
+---------------------------------------v-----------------------------------------+
|                                BACKEND TIER                                     |
|  Python Flask Application + Flask-CORS + SQLite Persistence                     |
|                                                                                 |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  | Routes / API Layer |  | Services Layer     |  | Custom Data Structures    |  |
|  | /locations, /read  |  | Noise, Rec, Fresh  |  | Quadtree, HashMap, MinHeap|  |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  | Validation & Auth  |  | Repository / DAO   |  | Spatial & Audio Processing|  |
|  | Bounds, XSS Filter |  | Parameterized SQL  |  | Haversine, Decibel Scales |  |
|  +--------------------+  +--------------------+  +---------------------------+  |
+---------------------------------------+-----------------------------------------+
                                        | SQLite DB Engine
+---------------------------------------v-----------------------------------------+
|                                DATABASE TIER                                    |
|  campus_locations  |  noise_readings  |  user_feedback  |  app_users (auth)     |
+---------------------------------------------------------------------------------+
```

---

## 4. Hardware & Audio Specifications
- **Input API:** W3C Web Audio API (`AudioContext`, `MediaStreamAudioSourceNode`, `AnalyserNode`).
- **Sampling Window:** 2048 FFT window size, time-domain PCM float buffer.
- **Metric Formulation:**
  $$\text{RMS} = \sqrt{\frac{1}{N}\sum_{i=0}^{N-1} x[i]^2}$$
  $$\text{Relative Intensity (dBFS / Relative Scale)} = 20 \cdot \log_{10}(\text{RMS} + \epsilon) + \text{offset}$$
- **Categorization Thresholds (Configurable):**
  - **Quiet:** Relative Intensity $< 40$ (or $\text{RMS} < 0.035$)
  - **Moderate:** Relative Intensity $40 - 65$ (or $\text{RMS} \in [0.035, 0.085)$)
  - **Noisy:** Relative Intensity $> 65$ (or $\text{RMS} \ge 0.085$)
- **Freshness Policy:**
  - $\le 30 \text{ min}$: Fresh (Active badge, high confidence)
  - $30 - 120 \text{ min}$: Aging (Moderate confidence)
  - $> 120 \text{ min}$: Stale (Marked as Unknown/Stale)

---

## 5. Algorithmic Specifications
### 5.1 Custom 2D Spatial Quadtree (`quadtree.py`)
- **Node Structure:** Bounding box $[x_{\min}, y_{\min}, x_{\max}, y_{\max}]$, bucket capacity $K=4$, NW/NE/SW/SE child quadrants.
- **Operations:**
  - `insert(point)`: Inserts a spatial record $(lat, lon, data)$, splits upon exceeding capacity.
  - `query_range(boundary_box)`: Rectangular boundary filtering with pruning.
  - `query_radius(center_lat, center_lon, radius_km)`: Candidate spatial filtering using bounding box enclosing circle, followed by exact Haversine verification.
- **Academic Benchmark:** Side-by-side execution against linear search ($O(N)$ scan) on identical candidate sets with runtime microsecond timing and ID-equality verification.

### 5.2 Custom Hash Map (`custom_hash_map.py`)
- Array of buckets with prime capacity and chaining / open addressing for collision resolution.
- Polynomial rolling hash function on string keys (UUIDs / IDs).
- Average $O(1)$ lookup for location metadata caching.

### 5.3 Custom Min-Heap (`min_heap.py`)
- Array-backed binary min-heap with standard `sift_up` and `sift_down`.
- Priority queue for top-$K$ recommendation retrieval based on composite suitability score.

### 5.4 Recommendation Metric
$$\text{Score} = w_N \cdot \text{NoisePenalty} + w_D \cdot \text{DistancePenalty} + w_A \cdot \text{AgePenalty}$$
Default weights: $w_N = 0.50$, $w_D = 0.30$, $w_A = 0.20$. Lower score indicates a better quiet-spot candidate.

---

## 6. Verified Campus Locations (Kongu Engineering College)
1. **CD Memorial Central Library** (`11.270962`, `77.605285`) — Primary academic library, central quiet zone.
2. **KEC Food Court** (`11.272635`, `77.606788`) — Dining & social area (typically Moderate/Noisy).
3. **Maharaja Auditorium** (`11.272366`, `77.605972`) — Indoor cultural & convention venue.
4. **Kongu Convention Centre** (`11.272887`, `77.602171`) — West campus conference complex.
5. **IT Block Study Lounge** (`11.273394`, `77.606904`) — Department of Computer Science & IT.
6. **Admin Block Reading Room** (`11.274293`, `77.607054`) — Central administrative complex.
7. **Science & Humanities Lawn** (`11.274878`, `77.607789`) — North-east green corridor.
8. **ECE Block Study Hall** (`11.272208`, `77.605420`) — Electronics & Communication Block.
9. **EEE Block Courtyard** (`11.274277`, `77.607723`) — Electrical Engineering wing.
10. **Mechanical & Mechatronics Block** (`11.270299`, `77.603801`) — South-west academic wing.
11. **CT-UG Block** (`11.273681`, `77.605985`) — Undergraduate computational wing.
12. **Chemical & Food Block** (`11.272521`, `77.607408`) — East academic laboratory cluster.
13. **Main Entrance & Gate 1** (`11.275020`, `77.608550`) — Perundurai road campus access point.
14. **Valluvar & Bharathi Hostel Gardens** (`11.269720`, `77.606050`) — Residential study area.

---

## 7. Deliverables & Acceptance Checklist
- [x] Clean architecture separating presentation, business logic, data structures, and persistence.
- [x] Fully functioning Flask backend with RESTful endpoints and SQLite database.
- [x] Responsive React frontend (360px mobile up to 1440px desktop) matching Figma green/white visual identity.
- [x] Working Web Audio API local sound analysis (start/pause/stop, throttle, privacy safeguard).
- [x] Working Quadtree, HashMap, MinHeap algorithms with runtime benchmark lab.
- [x] Interactive campus map with verified markers and custom category styling.
- [x] Automated test suites (pytest + Vitest).
