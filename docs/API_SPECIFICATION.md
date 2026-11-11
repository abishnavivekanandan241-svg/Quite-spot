# QuietSpot — RESTful API Specification

**Base URL:** `http://localhost:5000/api`  
**Data Exchange Format:** `application/json`  
**Authentication:** Optional session-based / token-ready (demo accounts supported)

---

## 1. System Health

### `GET /api/health`
Returns system status, active database connection, and institution metadata.
- **Request:** None
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "service": "QuietSpot API",
    "version": "2.0.0",
    "timestamp": "2026-10-14T16:35:19.281605+00:00",
    "database": {
      "status": "connected",
      "type": "SQLite"
    },
    "campus": {
      "institution": "Kongu Engineering College",
      "coordinates": {
        "latitude": 11.27218,
        "longitude": 77.60400
      }
    }
  }
  ```

---

## 2. Campus Locations

### `GET /api/locations`
Retrieves verified campus locations filtered by category, type, or search term.
- **Query Parameters:**
  - `category` (string, optional): `Quiet`, `Moderate`, `Noisy`, `Unknown`, `all`
  - `type` (string, optional): `Library`, `Academic`, `Cafeteria`, `Hostel`, `Convention`, `Transit`
  - `search` (string, optional): Search string matched against location name or description
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "count": 12,
    "locations": [
      {
        "id": "kec_cd_lib",
        "name": "CD Memorial Central Library",
        "latitude": 11.2709624,
        "longitude": 77.6052846,
        "location_type": "Library",
        "description": "Multi-storey central institutional library spanning 3,286 sqm...",
        "image_url": "https://...",
        "is_active": 1,
        "data_source": "verified_osm_node_10274963803",
        "current_noise_category": "Quiet",
        "has_recent_reading": true,
        "latest_reading": {
          "id": "demo_read_01",
          "relative_intensity": 28.4,
          "noise_category": "Quiet",
          "measured_at": "2026-10-14T16:27:00Z"
        },
        "freshness": {
          "status": "Fresh",
          "is_usable": true,
          "age_minutes": 8.0,
          "label": "Fresh (8m ago)",
          "display_category": "Quiet"
        }
      }
    ],
    "campus_center": {
      "latitude": 11.27218,
      "longitude": 77.60400
    }
  }
  ```

### `GET /api/locations/<id>`
Retrieves full details for a single campus spot.
- **Path Parameter:** `id` (e.g. `kec_cd_lib`)
- **Response `200 OK`** or `404 Not Found`

### `GET /api/locations/<id>/summary`
Returns aggregated trend metrics for a specific campus spot.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "location": { ... },
    "metrics": {
      "total_observations_recorded": 15,
      "average_relative_intensity": 29.8,
      "has_live_reading": true
    }
  }
  ```

### `GET /api/locations/<id>/readings`
Returns chronological observations for plotting trend graphs.
- **Query Parameter:** `limit` (integer, default 50, max 200)

---

## 3. Acoustic Observations (Telemetry)

### `POST /api/readings`
Accepts client-derived environmental sound intensity telemetry.
- **Privacy Rule:** Strictly rejects raw audio payloads (`audio_bytes`, `pcm_data`, `base64_audio`).
- **Request Body:**
  ```json
  {
    "location_id": "kec_cd_lib",
    "relative_intensity": 32.5,
    "noise_category": "Quiet",
    "measurement_method": "web_audio_rms_client",
    "data_source": "consented_client_monitoring",
    "device_session_id": "session_anon_92384"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Derived noise observation recorded successfully.",
    "reading": {
      "id": "read_8f3a91c2b5",
      "location_id": "kec_cd_lib",
      "relative_intensity": 32.5,
      "noise_category": "Quiet",
      "measured_at": "2026-10-14T16:35:00Z"
    }
  }
  ```
- **Error Response `400 Bad Request`:** If forbidden raw audio fields or invalid numeric bounds are detected.
- **Error Response `404 Not Found`:** If `location_id` does not match an active KEC campus spot.

---

## 4. Quiet-Spot Recommendations

### `GET /api/recommendations`
Ranks campus quiet spots using spatial Quadtree filtering and Min-Heap scoring.
- **Query Parameters:**
  - `lat` (float): User reference latitude (defaults to KEC center)
  - `lon` (float): User reference longitude (defaults to KEC center)
  - `radius` (float, km): Search radius (default `1.5` km)
  - `limit` (int): Number of top results (default `10`)
- **Scoring Formulation:**
  $$\text{Score} = 0.50 \cdot \text{NoisePenalty} + 0.30 \cdot \text{DistancePenalty} + 0.20 \cdot \text{AgePenalty}$$
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "count": 5,
    "recommendations": [
      {
        "location": { ... },
        "score_details": {
          "score": 0.2312,
          "noise_penalty": 0.1400,
          "distance_penalty": 0.1250,
          "age_penalty": 0.0667,
          "distance_meters": 187.5,
          "reasons": [
            "Quiet environment (est. 28.4)",
            "Very close (188m away)",
            "Very fresh observation (< 15 min)"
          ]
        }
      }
    ]
  }
  ```

---

## 5. Algorithm Performance Lab

### `POST /api/benchmark`
Executes real side-by-side performance benchmarks between custom 2D Spatial Quadtree and Linear Scan.
- **Request Body:**
  ```json
  {
    "dataset_size": 1000,
    "search_radius_km": 0.5
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "benchmark": {
      "parameters": {
        "dataset_size": 1000,
        "search_radius_km": 0.5,
        "center": { "latitude": 11.27218, "longitude": 77.60400 }
      },
      "quadtree_metrics": {
        "query_time_ms": 0.2010,
        "query_time_ns": 201000,
        "build_time_ms": 4.0458,
        "points_found": 128
      },
      "linear_metrics": {
        "query_time_ms": 0.6056,
        "query_time_ns": 605600,
        "points_found": 128
      },
      "verification": {
        "results_match": true,
        "matched_count": 128,
        "speedup_factor": 3.01,
        "status": "Verified: Quadtree and Linear search returned identical results."
      }
    }
  }
  ```

---

## 6. Feedback & Ground Truth

### `POST /api/feedback`
Submits user ground-truth verification for an acoustic location.
- **Request Body:**
  ```json
  {
    "location_id": "kec_cd_lib",
    "feedback_value": "Quiet & Accurate",
    "user_comment": "AC is running quietly, great revision zone"
  }
  ```
- **Response `201 Created`**

### `GET /api/locations/<id>/feedback`
Returns recent student verification notes for a location.
