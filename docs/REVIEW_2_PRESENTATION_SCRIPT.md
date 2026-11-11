# QuietSpot — Review 2 Presentation Script & Committee Q&A Guide
**Kongu Engineering College (Autonomous), Perundurai**  
**Department of Computer Science and Engineering**  
**Project:** QuietSpot — Intelligent Campus Noise Mapping and Quiet-Spot Recommendation System Using Quadtree  
**Presentation File:** [`QuietSpot_2.0_Review_2_Presentation.pptx`](file:///c:/Users/abish/OneDrive/Documents/quite%20spot%202/QuietSpot_2.0_Review_2_Presentation.pptx)

---

## 1. Slide-by-Slide Presentation Script

### Slide 1: Title Slide (Team Members & Guide)
- **Speaker:** Team Leader
- **Script:**
  > "Respected Review Committee members and our Project Guide, Good morning / afternoon. We are here to present our Review-2 progress for our college project titled **'QuietSpot: Intelligent Campus Noise Mapping and Quiet-Spot Recommendation System Using Quadtree'**, exclusively developed for **Kongu Engineering College**. 
  > In this review, we have crossed over **85% project completion**, featuring a functional full-stack application, custom spatial data structures, and in-browser edge audio processing. I am [Name], and along with my team members [Names], we will walk you through the implementation."

### Slide 2: Problem Statement
- **Speaker:** Team Member 2
- **Script:**
  > "Kongu Engineering College spans over 167 acres with dozens of academic blocks, reading lounges, laboratories, and cafeterias. During exam and project revision periods, students struggle to find quiet study locations because noise levels fluctuate dynamically.
  > Traditional campus maps are static and offer no acoustic intelligence. Meanwhile, deploying hardware-based dedicated decibel meters across a 167-acre campus is cost-prohibitive. Furthermore, students fear eavesdropping if apps record sound. Our problem was to build a real-time, privacy-guaranteed noise recommendation system without external hardware, accelerated by spatial Quadtrees."

### Slide 3: Domain Background
- **Speaker:** Team Member 2
- **Script:**
  > "Our domain bridges four core areas of Computer Science:
  > 1. **Geospatial Information Systems (GIS):** Modeling KEC campus coordinates with bounding-box perimeter validation.
  > 2. **Crowdsourced Environmental Sensing:** Utilizing existing student laptops and phones as passive, voluntary sensor nodes.
  > 3. **Edge Audio Processing:** Using the W3C Web Audio API to analyze audio in memory, discarding samples immediately to ensure zero eavesdropping.
  > 4. **Spatial Data Structures:** Moving beyond linear scanning to 2D Spatial Quadtrees and Min-Heap priority queues."

### Slide 4: Objectives of the Project
- **Speaker:** Team Member 3
- **Script:**
  > "Our project addresses six concrete objectives:
  > 1. Verified mapping of key KEC study spots (CD Memorial Library, IT Lounge, Admin Hall, Maharaja Auditorium, Hostels).
  > 2. A 100% privacy-guaranteed audio engine with zero raw audio persistence.
  > 3. Custom-built 2D Spatial Quadtree in Python for sub-millisecond candidate queries.
  > 4. Multi-factor recommendation ranking via Min-Heap incorporating noise, distance, and reading freshness.
  > 5. An empirical Algorithm Performance Lab comparing Quadtree vs Linear Scan.
  > 6. A fully responsive, modern web interface matching our Figma design."

### Slide 5: Existing System vs Limitations
- **Speaker:** Team Member 3
- **Script:**
  > "Looking at existing systems:
  > - Physical quiet zone signs are completely static and cannot reflect sudden overcrowding or event noise.
  > - Google Maps provides street routing but lacks indoor acoustic awareness.
  > - Hardware decibel meter grids cost tens of thousands of rupees to install and maintain across 167 acres.
  > - Third-party sound meter apps frequently record or upload raw audio buffers, violating student privacy."

### Slide 6: Proposed System (QuietSpot)
- **Speaker:** Team Leader
- **Script:**
  > "QuietSpot solves all these limitations:
  > - Distributed, zero-cost sensing: Runs directly in student web browsers.
  > - Edge computing: Processes Float32 PCM samples into Root-Mean-Square (RMS) amplitude locally in volatile memory.
  > - Custom Quadtree: Recursively subdivides 2D space, pruning irrelevant quadrants in $O(\log N + K)$ average time.
  > - Min-Heap priority queue: Ranks spots using our mathematical composite penalty formulation.
  > - Real navigation: 1-click Google Maps walking directions from the student's GPS location to the study spot."

### Slide 7: System Architecture / Workflow Diagram
- **Speaker:** Team Leader
- **Script:**
  > "Our 4-tier architecture separates concerns cleanly:
  > 1. **Client Tier:** React 19 + Vite with Web Audio AnalyserNode and Leaflet maps.
  > 2. **REST API & Security Layer:** Python Flask with CORS, campus boundary validators, and our raw-audio rejection guard.
  > 3. **Algorithm & Service Tier:** Custom Quadtree, Custom Hash Map, Binary Min-Heap, and Haversine distance calculations.
  > 4. **Persistence Tier:** SQLite database enforcing foreign keys, cascade deletes, and composite indexes."

### Slide 8: Modules Description
- **Speaker:** Team Member 4
- **Script:**
  > "We have partitioned our project into six functional modules:
  > - Module 1: In-Browser Web Audio Acoustic Engine (RMS calculation & decibel scaling).
  > - Module 2: Interactive Campus Geospatial Visualizer (Leaflet map with custom SVG pins).
  > - Module 3: Custom Spatial Quadtree Engine (2D recursive partitioning).
  > - Module 4: Multi-Criteria Quiet Recommendation & Min-Heap Ranking.
  > - Module 5: Student Ground-Truth Verification & Feedback System.
  > - Module 6: Empirical Algorithm Performance Lab."

### Slide 9: Tools and Technologies Used
- **Speaker:** Team Member 4
- **Script:**
  > "Our technology stack includes:
  > - **Frontend:** React 19, Vite 5, React Router v6, Leaflet, Lucide Icons, and Vanilla CSS tokens.
  > - **Backend:** Python 3.13, Flask 3.1, Flask-CORS, Werkzeug security (PBKDF2 password hashing).
  > - **Persistence:** SQLite 3 with parameterized queries.
  > - **Testing:** Pytest (21 automated backend tests) and Vitest (7 frontend tests) with 100% pass rates."

### Slide 10: Database Design & Campus Dataset
- **Speaker:** Team Member 3
- **Script:**
  > "Our database features four normalized tables: `campus_locations`, `noise_readings`, `user_feedback`, and `app_users`. 
  > Notice that our schema contains zero BLOB or audio columns. Our campus dataset contains authentic OpenStreetMap survey coordinates for Kongu Engineering College (Node 654765252, centered at 11.27218° N, 77.60400° E), encompassing the CD Memorial Central Library, IT Block, Admin Hall, Maharaja Auditorium, Food Court, and Hostels."

### Slide 11: Algorithm & Mathematical Methodology
- **Speaker:** Team Leader
- **Script:**
  > "The algorithmic heart of QuietSpot is built without third-party spatial packages:
  > 1. **Spatial Quadtree:** Partitioning space into NW, NE, SW, SE quadrants. Reduces candidate filtering from linear $O(N)$ to $O(\log N + K)$ average complexity.
  > 2. **Custom Hash Map:** Employs polynomial rolling hash with separate chaining and dynamic capacity doubling when load factor exceeds 0.75.
  > 3. **Custom Min-Heap:** Array-backed binary tree with sift-up and sift-down for top-K recommendation extraction.
  > 4. **Scoring Formulation:** $\text{Score} = 0.50 \cdot \text{Noise} + 0.30 \cdot \text{Distance} + 0.20 \cdot \text{Age}$. Unmeasured spots are penalized transparently rather than assumed quiet."

### Slide 12: Screenshots of Working Modules
- **Speaker:** Team Member 2
- **Script:**
  > "Here are our core working screens:
  > - Our Landing Page with official KEC branding.
  > - The Welcome Modal that prompts users upon entry with privacy assurances.
  > - The Interactive Leaflet Campus Map with noise pins.
  > - The Live Noise Monitoring Studio with decibel speedometer and frequency bars.
  > - The Filterable Quiet Spots directory and our Algorithm Performance Lab."

### Slide 13: Project Demonstration & Review 2 Status (>85% Complete)
- **Speaker:** Team Leader
- **Script:**
  > "For Review 2, our requirements mandated 70% completion. We are pleased to announce that **our prototype is over 85% completed**:
  > - The Flask backend and database are 100% operational.
  > - All custom algorithms (Quadtree, HashMap, MinHeap) are implemented and verified.
  > - The frontend is fully responsive across desktop and mobile browsers.
  > - All 28 automated tests are passing.
  > We will now perform a live demonstration of the running prototype on our system."

### Slide 14: Conclusion & Future Enhancements
- **Speaker:** Team Leader
- **Script:**
  > "In conclusion, QuietSpot demonstrates how distributed client-side Web Audio processing combined with custom 2D Spatial Quadtrees can solve campus noise navigation without costly hardware.
  > For our Final Review (Phase 3), we plan to add solar-powered ESP32 outdoor beacons for lawn coverage and machine learning timetable prediction.
  > We thank our Project Guide, the HOD, and the faculty of the Department of Computer Science and Engineering for their guidance. We now welcome questions from the review committee."

---

## 2. Review Committee Q&A Preparation

### Q1: "Why did you use a Quadtree instead of a traditional SQL spatial query (PostGIS or R-Tree)?"
- **Answer:**
  > "Our project is an academic algorithmic study. Traditional database spatial extensions like PostGIS introduce heavy server dependencies and obfuscate data structure mechanics. By building our own 2D Spatial Quadtree from scratch in Python, we demonstrate direct mastery of spatial bounding-box intersection, quadrant subdivision, and circular radius pruning with mathematical proof of complexity ($O(\log N + K)$ vs $O(N)$)."

### Q2: "How do you guarantee that a user's microphone doesn't violate privacy?"
- **Answer:**
  > "We enforce a three-layer privacy boundary:
  > 1. **Client-side edge isolation:** The browser's Web Audio API connects the audio stream strictly to an `AnalyserNode` in volatile RAM. Samples are immediately converted to Root-Mean-Square (RMS) amplitude and discarded.
  > 2. **No raw audio upload:** Only derived relative decibel numbers (e.g. 32.5 dB) are ever transmitted to the server.
  > 3. **Backend rejection gate:** The Flask backend inspects all incoming payloads. If any binary or raw audio field (`audio_bytes`, `pcm_data`, `base64_audio`) is detected, the API rejects the request immediately with HTTP 400."

### Q3: "What happens if a study spot has no recent readings?"
- **Answer:**
  > "We adhere to a strict zero-fake-data policy. If a spot has no reading within our configurable 120-minute freshness threshold, it is honestly labelled as **'Unknown / Stale'** in the UI. In our recommendation algorithm, unmeasured spots receive a transparent uncertainty penalty (0.65) rather than being falsely classified as Quiet."

### Q4: "How does your recommendation algorithm combine noise, distance, and freshness?"
- **Answer:**
  > "We compute a composite penalty score:  
  > $\text{Score} = w_N \cdot \text{NoisePenalty} + w_D \cdot \text{DistancePenalty} + w_A \cdot \text{AgePenalty}$  
  > where $w_N = 0.50$, $w_D = 0.30$, and $w_A = 0.20$. Each factor is normalized between 0.0 and 1.0. Lower scores indicate more suitable study environments. Candidates are inserted into our Custom Binary Min-Heap, allowing optimal top-K retrieval in $O(K \log N)$ time."

### Q5: "How did you verify that the Quadtree and Linear Search return the exact same results in the Algo Lab?"
- **Answer:**
  > "In `benchmark_service.py`, both the Quadtree and Linear Scan run over the exact same dataset, search center, and radius. We capture the sets of matched point IDs from both algorithms and assert `quadtree_ids == linear_ids`. If even a single point differs, the equality check fails. Our live benchmark confirms 100% result parity alongside empirical speedups."
