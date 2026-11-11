# QuietSpot 2.0 — Student & Faculty User Guide

Welcome to **QuietSpot 2.0**, the intelligent campus acoustic mapping and quiet-spot recommendation system for **Kongu Engineering College (KEC)**.

---

## 1. Getting Started

### 1.1 Accessing the Application
Open your browser (Chrome, Edge, Safari, Firefox) and navigate to the application URL:
- **Local Development URL:** `http://localhost:5173/`

The application is fully responsive. You can open it on your laptop or mobile phone.

---

## 2. Core Feature Walkthrough

### 2.1 Exploring the Campus Map (`#/map`)
1. Click **Campus Map** in the navigation bar.
2. Centered on Kongu Engineering College, the map displays verified campus facilities:
   - **Green Pins:** Quiet spots (&lt; 45 rel. dB).
   - **Amber Pins:** Moderate sound levels (45 - 65 rel. dB).
   - **Red Pins:** Noisy environments (&gt; 65 rel. dB, e.g. Food Court or Bus Stand during peak hours).
   - **Gray Pins:** Unknown or stale readings (&gt; 120 minutes old).
3. Click any marker to view the location name, estimated noise, observation timestamp, and quick navigation actions.
4. Click **Locate Me** to find your current position on campus, or **Campus Center** to recenter.

### 2.2 Finding Quiet Study Spots (`#/quiet-spots`)
1. Browse through the directory of study spots.
2. Filter dynamically by clicking:
   - **Quiet (&lt; 45 dB)**
   - **Moderate (45 - 65 dB)**
   - **Unknown / Stale**
3. Use the search bar to locate specific facilities (e.g., *"Library"*, *"IT Block"*, *"Convention"*).
4. Click **Navigate** on any card to open turn-by-turn walking directions directly in Google Maps.

### 2.3 Starting Live Noise Monitoring (`#/monitoring`)
1. Navigate to **Live Monitor**.
2. Select your current campus study location from the dropdown menu.
3. Click **Start Monitoring**.
4. When prompted by your browser, grant **Microphone Permission**.
5. Observe the live decibel gauge and frequency spectrum bars as they update in real time.
6. **Contribution:** If the contribution toggle is enabled, your device will automatically transmit an anonymous derived decibel reading every 8 seconds to help other students know if the spot is currently quiet!
7. Click **Pause** or **Stop Monitoring** at any time. The microphone stream is immediately released.

### 2.4 Algorithm Performance Lab (`#/benchmark`)
1. Navigate to **Algo Lab**.
2. Choose a synthetic dataset size (e.g., 2,500 to 20,000 points) and a search radius.
3. Click **Run Performance Benchmark**.
4. Review the empirical nanosecond/millisecond execution times for the custom **2D Spatial Quadtree** versus the **Linear Scan** baseline.
5. Notice the **Equality Verification Banner** confirming 100% result identity.

### 2.5 Providing Ground Truth Feedback
1. Open any location's details page (e.g., `#/locations/kec_cd_lib`).
2. Scroll to the **Student Feedback** section.
3. Select whether the location is currently *Quiet & Accurate*, *Moderately Noisy*, or *Crowded*.
4. Submit your feedback to help improve campus data freshness.
