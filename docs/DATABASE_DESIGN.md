# QuietSpot — Database Design Specification

QuietSpot uses **SQLite** with strict foreign key constraints, parameterized prepared statements, and targeted composite indexes.

---

## 1. Entity Relationship Overview

```
+---------------------------------------+
|          campus_locations             |
+---------------------------------------+
| id (PK, TEXT)                         |<---+
| name (TEXT)                           |    |
| latitude (REAL)                       |    |
| longitude (REAL)                      |    |
| location_type (TEXT)                  |    |
| description (TEXT)                    |    |
| image_url (TEXT)                      |    |
| is_active (INTEGER)                   |    |
| data_source (TEXT)                    |    |
| created_at (TEXT)                     |    |
| updated_at (TEXT)                     |    |
+---------------------------------------+    |
                   |                         |
                   | 1:N                     | 1:N
                   |                         |
+------------------v--------------------+    |
|           noise_readings              |    |
+---------------------------------------+    |
| id (PK, TEXT)                         |    |
| location_id (FK, TEXT) ---------------+    |
| relative_intensity (REAL)             |    |
| noise_category (TEXT)                 |    |
| measured_at (TEXT)                    |    |
| measurement_method (TEXT)             |    |
| data_source (TEXT)                    |    |
| device_session_id (TEXT)              |    |
| created_at (TEXT)                     |    |
+---------------------------------------+    |
                                             |
+---------------------------------------+    |
|            user_feedback              |    |
+---------------------------------------+    |
| id (PK, TEXT)                         |    |
| location_id (FK, TEXT) --------------------+
| feedback_value (TEXT)                 |
| user_comment (TEXT)                   |
| created_at (TEXT)                     |
+---------------------------------------+

+---------------------------------------+
|              app_users                |
+---------------------------------------+
| id (PK, TEXT)                         |
| username (TEXT, UNIQUE)               |
| email (TEXT, UNIQUE)                  |
| password_hash (TEXT)                  |
| created_at (TEXT)                     |
+---------------------------------------+
```

---

## 2. Table Specifications & Schema Details

### 2.1 `campus_locations`
Stores verified geographic boundaries, amenities, and facility metadata for Kongu Engineering College.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Unique identifier (e.g. `kec_cd_lib`) |
| `name` | `TEXT` | `NOT NULL` | Official campus building/spot name |
| `latitude` | `REAL` | `NOT NULL` | WGS84 decimal latitude |
| `longitude` | `REAL` | `NOT NULL` | WGS84 decimal longitude |
| `location_type` | `TEXT` | `NOT NULL` | Type: `Library`, `Academic`, `Cafeteria`, etc. |
| `description` | `TEXT` | `NULL` | Verification notes and study features |
| `image_url` | `TEXT` | `NULL` | Optional facility photograph reference |
| `is_active` | `INTEGER` | `NOT NULL DEFAULT 1` | 1 if active, 0 if decommissioned |
| `data_source` | `TEXT` | `NOT NULL` | Provenance tag (e.g. `verified_osm_node_10274963803`) |
| `created_at` | `TEXT` | `NOT NULL` | ISO 8601 UTC timestamp |
| `updated_at` | `TEXT` | `NOT NULL` | ISO 8601 UTC timestamp |

**Indexes:**
- `idx_locations_coords ON campus_locations (latitude, longitude)`
- `idx_locations_active ON campus_locations (is_active)`

---

### 2.2 `noise_readings`
Records client-derived environmental sound intensity telemetry.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Observation UUID (`read_...`) |
| `location_id` | `TEXT` | `NOT NULL, FK` | References `campus_locations(id)` ON DELETE CASCADE |
| `relative_intensity` | `REAL` | `NOT NULL` | Scaled relative decibel intensity (0 - 100) |
| `noise_category` | `TEXT` | `NOT NULL` | `Quiet`, `Moderate`, `Noisy`, `Unknown` |
| `measured_at` | `TEXT` | `NOT NULL` | Observation timestamp (UTC ISO 8601) |
| `measurement_method` | `TEXT` | `NOT NULL` | Telemetry algorithm (`web_audio_rms_client`) |
| `data_source` | `TEXT` | `NOT NULL` | Origin (`consented_client_monitoring` or `demonstration_seed`) |
| `device_session_id` | `TEXT` | `NULL` | Anonymized session identifier |
| `created_at` | `TEXT` | `NOT NULL` | Server receipt timestamp |

**Indexes:**
- `idx_readings_loc_time ON noise_readings (location_id, measured_at DESC)`
- `idx_readings_time ON noise_readings (measured_at DESC)`

---

### 2.3 `user_feedback`
Stores ground-truth student verification reports.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Feedback identifier (`fb_...`) |
| `location_id` | `TEXT` | `NOT NULL, FK` | References `campus_locations(id)` |
| `feedback_value` | `TEXT` | `NOT NULL` | Value (e.g. `Quiet & Accurate`, `Loud`) |
| `user_comment` | `TEXT` | `NULL` | Student revision context note |
| `created_at` | `TEXT` | `NOT NULL` | ISO 8601 UTC timestamp |

---

### 2.4 `app_users`
Stores student authentication accounts with cryptographically secure PBKDF2 password hashes. Plaintext passwords are never stored.

---

## 3. Data Integrity & Privacy Safeguards
1. **Zero Raw Audio Storage:** The database schema has no BLOB, binary, or base64 column for audio samples. Attempts to insert raw audio are rejected at the service and route layer before touching SQLite.
2. **Provenance Accountability:** All records contain a mandatory `data_source` column differentiating live client telemetry (`consented_client_monitoring`) from initial seed records (`demonstration_seed`).
3. **Window Function Queries:** The latest observation per location is queried using high-performance SQLite analytical window functions:
   ```sql
   WITH RankedReadings AS (
       SELECT *, ROW_NUMBER() OVER(PARTITION BY location_id ORDER BY measured_at DESC) as rn
       FROM noise_readings
   )
   SELECT * FROM RankedReadings WHERE rn = 1;
   ```
