# QuietSpot — Automated Test Report

**Execution Timestamp:** 2026-10-14  
**Test Runners:** `pytest` 9.1.1 (Python 3.13.6), `vitest` 2.1.9 (Node v22.20.0)  
**Overall Result:** **28 / 28 Tests PASSED (100% Pass Rate)**

---

## 1. Backend Test Suite Summary (`pytest -v`)

Total backend tests executed: **21 passed in 1.00s**

### 1.1 Custom Algorithms & Spatial Mathematics (`tests/test_algorithms.py`)
| Test Case | Status | Verification Detail |
|---|---|---|
| `test_haversine_distance` | **PASSED** | Verifies accurate spherical distance between KEC Library and Food Court (~250-300m) and zero distance for identical points. |
| `test_bounding_box` | **PASSED** | Confirms rectangular lat/lon boundary math enclosing circular radius around KEC campus. |
| `test_quadtree_insert_and_query` | **PASSED** | Verifies 2D Spatial Quadtree quadrant subdivision, rectangular range filtering, and radius pruning. |
| `test_custom_hash_map` | **PASSED** | Verifies polynomial rolling hash, collision resolution via chaining, entry updates, and prime-based dynamic resizing. |
| `test_custom_min_heap` | **PASSED** | Verifies binary min-heap ordering, sift-up, sift-down, peek, and ascending extract-min priority ordering. |
| `test_recommendation_scoring` | **PASSED** | Validates composite multi-penalty scoring (noise, distance, age) producing low penalty scores for quiet, close spots. |
| `test_unmeasured_location_penalized_transparently` | **PASSED** | Enforces that unmeasured spots are NOT marked Quiet, but penalized transparently for data uncertainty. |

### 1.2 REST API Endpoints & Business Logic (`tests/test_api_endpoints.py`)
| Test Case | Status | Verification Detail |
|---|---|---|
| `test_health_endpoint` | **PASSED** | Verifies `GET /api/health` returns healthy database status and KEC institution metadata. |
| `test_get_locations` | **PASSED** | Confirms active campus locations retrieval with freshness enrichments. |
| `test_location_by_id` | **PASSED** | Validates single spot retrieval (`kec_cd_lib`) and 404 behavior for unknown IDs. |
| `test_submit_valid_reading` | **PASSED** | Verifies client-derived decibel submission persisting to SQLite. |
| `test_reject_raw_audio_submission` | **PASSED** | Confirms HTTP 400 rejection and privacy alert when raw audio bytes are passed. |
| `test_reject_out_of_campus_location` | **PASSED** | Rejects readings submitted for non-KEC locations. |
| `test_recommendations` | **PASSED** | Verifies Quadtree-backed recommendation ranking ordered by composite score. |
| `test_benchmark_endpoint` | **PASSED** | Runs live benchmark on synthetic points and verifies 100% equality between Quadtree and Linear search. |
| `test_user_feedback` | **PASSED** | Verifies student feedback persistence and retrieval. |
| `test_auth_registration_and_login` | **PASSED** | Verifies PBKDF2 password hashing, registration, login, and rejection of invalid passwords. |

### 1.3 Audio Processing & Security Safeguards (`tests/test_noise_processing.py`)
| Test Case | Status | Verification Detail |
|---|---|---|
| `test_classify_intensity` | **PASSED** | Verifies categorization thresholds: Quiet (< 45), Moderate (45-65), Noisy (> 65). |
| `test_reject_raw_audio_fields` | **PASSED** | Tests comprehensive blocklist: `raw_audio`, `audio_bytes`, `pcm_data`, `base64_audio`, `wav`, `mp3`, `blob`. |
| `test_valid_derived_payload` | **PASSED** | Accepts valid sanitized derived metrics. |
| `test_reject_invalid_numeric_values` | **PASSED** | Rejects non-numeric intensity values and out-of-physical-bounds values (> 140 dB). |

---

## 2. Frontend Test Suite Summary (`npm test` / `vitest run`)

Total frontend tests executed: **7 passed in 727ms**

### 2.1 Web Audio Processor (`src/tests/audioProcessor.test.js`)
| Test Case | Status | Verification Detail |
|---|---|---|
| `initializes with default options without allocating audio stream` | **PASSED** | Confirms no microphone stream is acquired prior to explicit user action. |
| `cleans up resources safely even when not started` | **PASSED** | Verifies safe teardown of unallocated nodes without throwing exceptions. |
| `handles pause and stop state updates` | **PASSED** | Validates state transitions between active, paused, and stopped monitoring. |

### 2.2 Formatters & Navigation Builders (`src/tests/formatters.test.js`)
| Test Case | Status | Verification Detail |
|---|---|---|
| `formats distance accurately in meters and km` | **PASSED** | Formats 150m, 1.50km, and null handling. |
| `formats relative decibels` | **PASSED** | Formats decibels with `(rel)` suffix. |
| `builds valid Google Maps navigation URL` | **PASSED** | Builds standard Google Maps directions link with lat/lon and encoded destination. |
| `formats relative timestamps` | **PASSED** | Formats `Just now`, `10m ago`, and historical timestamps. |

---

## 3. Build & Runtime Verification
- **Frontend Production Build (`npm run build`):**  
  `✓ 1595 modules transformed. built in 12.67s` with zero errors.
- **Backend Service (`python run.py`):**  
  Running on `http://127.0.0.1:5000` with active SQLite database.
- **Frontend Dev Server (`npm run dev`):**  
  Running on `http://localhost:5173/` responding with HTTP 200 OK.
