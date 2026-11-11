# QUIETSPOT 2.0: INTELLIGENT CAMPUS NOISE MAPPING AND QUIET-SPOT RECOMMENDATION SYSTEM USING QUADTREE

**A PROJECT REPORT**  
*Submitted in partial fulfilment of the requirements for the award of the degree of*  
**BACHELOR OF ENGINEERING IN COMPUTER SCIENCE AND DESIGN**  

**DEPARTMENT OF COMPUTER SCIENCE AND DESIGN**  
**KONGU ENGINEERING COLLEGE (AUTONOMOUS)**  
*Affiliated to Anna University, Chennai | Accredited by NAAC with 'A++' Grade*  
**PERUNDURAI, ERODE – 638 060**  
**NOVEMBER 2026**

---

## CANDIDATES
- **ABISHEK S** (Register Number: `23CDR001`) — *Team Leader*
- **DAKSHANA S** (Register Number: `23CDR014`)
- **DEEPAK P** (Register Number: `23CDR015`)
- **DHANUSHREE S** (Register Number: `23CDR018`)

## PROJECT SUPERVISOR & HEAD OF DEPARTMENT
- **Supervisor:** **Ms. K. SWATHI, M.Tech.**, Assistant Professor, Department of Computer Science and Design
- **Project Coordinator:** **Ms. R. DHARANI, M.Tech.**, Assistant Professor, Department of Computer Science and Design
- **Head of the Department:** **Dr. E. GOTHAI, M.E., Ph.D.**, Professor & Head, Department of Computer Science and Design

---

## BONAFIDE CERTIFICATE

Certified that this project report entitled **“QUIETSPOT 2.0: INTELLIGENT CAMPUS NOISE MAPPING AND QUIET-SPOT RECOMMENDATION SYSTEM USING QUADTREE”** is the bonafide work of **ABISHEK S (23CDR001), DAKSHANA S (23CDR014), DEEPAK P (23CDR015), and DHANUSHREE S (23CDR018)**, who carried out the project work under my supervision during the academic year 2026–2027, in partial fulfilment of the requirements for the award of the degree of Bachelor of Engineering in Computer Science and Design of Anna University Chennai.

**SUPERVISOR**  
Ms. K. Swathi, M.Tech.,  
Assistant Professor, Department of CSD,  
Kongu Engineering College.  

**HEAD OF THE DEPARTMENT**  
Dr. E. Gothai, M.E., Ph.D.,  
Professor & Head, Department of CSD,  
Kongu Engineering College.  

Submitted for the end semester viva voce examination held on: ____________________  

**INTERNAL EXAMINER** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **EXTERNAL EXAMINER**

---

## DECLARATION

We hereby declare that the project report entitled **“QUIETSPOT 2.0: INTELLIGENT CAMPUS NOISE MAPPING AND QUIET-SPOT RECOMMENDATION SYSTEM USING QUADTREE”** is the record of work carried out by us in the Department of Computer Science and Design, Kongu Engineering College, Perundurai, during the academic year 2026–2027.

We further declare that this report has not been submitted, either in full or in part, to any other institution or university for the award of any degree or diploma on an earlier occasion on this or any other candidate.

Place: Perundurai  
Date: November 2026  

1. ABISHEK S (23CDR001)  
2. DAKSHANA S (23CDR014)  
3. DEEPAK P (23CDR015)  
4. DHANUSHREE S (23CDR018)  

*I certify that the declaration made by the above candidates is true to the best of my knowledge.*  
**Signature of the Supervisor with seal**

---

## ABSTRACT

Expansive university campuses require peaceful, low-noise environments for focused studying, scholarly research, and academic productivity. Kongu Engineering College (KEC) spans an extensive 167-acre campus hosting dozens of academic departments, central libraries, seminar complexes, cafeterias, and student hostels. Due to dynamic schedules, class breaks, pedestrian movement, and campus events, acoustic intensity fluctuates significantly throughout the day. Conventional physical signage and static campus maps provide zero live acoustic intelligence, while deploying dedicated hardware-based sound meter networks is cost-prohibitive across 167 acres. Furthermore, conventional sound apps frequently violate student privacy by recording or transmitting raw audio streams.

To overcome these challenges, this project presents **QuietSpot 2.0**, an intelligent, privacy-first geospatial noise mapping and study spot recommendation system tailored exclusively for the Kongu Engineering College campus. QuietSpot 2.0 implements client-side edge computing utilizing the W3C Web Audio API to calculate Root-Mean-Square (RMS) amplitude and relative decibel intensity directly in volatile browser memory. The raw audio buffer is discarded immediately after metric calculation; no audio stream, voice recording, or audio byte is ever stored to disk or transmitted to the backend server.

At the computational core, a custom two-dimensional Spatial Quadtree index recursively partitions geographic bounding boxes over verified KEC coordinates (Latitude 11.27218° N, Longitude 77.60400° E). Candidate quiet spots within a user-configured radius are retrieved via bounding-box pruning backed by exact Haversine great-circle spherical distance verification. Candidate locations are subsequently scored and ranked through a custom binary Min-Heap priority queue evaluating acoustic intensity, physical distance, and observation temporal freshness. An empirical Algorithm Performance Lab demonstrates that Quadtree spatial partitioning delivers significant computational acceleration over traditional linear scanning while maintaining 100% result fidelity. The modern responsive web application, built with React, Vite, Leaflet, and Flask with SQLite persistence, empowers students to discover optimal quiet locations, monitor real-time noise levels, and navigate directly using turn-by-turn walking routes.

**Keywords:** Spatial Quadtree, Noise Mapping, Quiet-Spot Recommendation, Web Audio API, Min-Heap Priority Queue, Haversine Distance, Privacy-First Sensing, Kongu Engineering College.

---

## ACKNOWLEDGEMENT

We express our sincere thanks and gratitude to **Thiru. E. R. K. KRISHNAN M.Com.**, our beloved Correspondent, and all other philanthropic trust members of the Kongu Vellalar Institute of Technology Trust, who have always encouraged us in academic and co-curricular activities.

We are extremely thankful with no words of a formal nature to the dynamic Principal **Dr. R. PARAMESHWARAN, M.E., Ph.D.**, for providing the necessary facilities to complete our work.

We would like to express our sincere gratitude to our respected Head of the Department **Dr. E. GOTHAI, M.E., Ph.D.**, for providing the necessary computing resources and constant support.

We extend our thanks to **Ms. K. SWATHI, M.Tech.**, and **Ms. R. DHARANI, M.Tech.**, Assistant Professors, Computer Science and Design, Project Coordinators, for their encouragement and valuable advice that made us carry out the project work successfully.

We extend our heartfelt gratitude to our Supervisor **Ms. K. SWATHI, M.Tech.**, Assistant Professor of Computer Science and Design, for her insightful ideas, rigorous technical guidance, and constructive suggestions throughout the execution of this project.

We are grateful to all the faculty members and technical staff of the Computer Science and Design Department for their support. Finally, we thank our beloved families and friends for their continuous motivation and encouragement.

---

## TABLE OF CONTENTS

| CHAPTER No. | TITLE | PAGE No. |
|---|---|---|
| | **ABSTRACT** | iv |
| | **LIST OF TABLES** | viii |
| | **LIST OF FIGURES** | ix |
| | **LIST OF ABBREVIATIONS** | x |
| **1** | **INTRODUCTION** | **1** |
| | 1.1 GENERAL OVERVIEW | 1 |
| | 1.2 PROBLEM STATEMENT | 1 |
| | 1.3 OBJECTIVES OF THE PROJECT | 2 |
| | 1.4 SCOPE OF THE PROJECT | 2 |
| | 1.5 NEED FOR THE PROJECT | 2 |
| | 1.6 PROPOSED SYSTEM WORKFLOW | 3 |
| | 1.7 ORGANIZATION OF THE REPORT | 3 |
| **2** | **SYSTEM ANALYSIS** | **4** |
| | 2.1 INTRODUCTION | 4 |
| | 2.2 EXISTING SYSTEM | 4 |
| | 2.3 LIMITATIONS OF THE EXISTING SYSTEM | 4 |
| | 2.4 PROPOSED SYSTEM | 5 |
| | 2.5 ADVANTAGES OF THE PROPOSED SYSTEM | 5 |
| | 2.6 FUNCTIONAL REQUIREMENTS | 5 |
| | 2.7 NON-FUNCTIONAL REQUIREMENTS | 6 |
| | 2.8 HARDWARE REQUIREMENTS | 7 |
| | 2.9 SOFTWARE REQUIREMENTS | 7 |
| | 2.10 FEASIBILITY STUDY | 8 |
| | 2.11 CONSTRAINTS AND ASSUMPTIONS | 8 |
| | 2.12 SUMMARY | 8 |
| **3** | **SYSTEM DESIGN** | **9** |
| | 3.1 INTRODUCTION | 9 |
| | 3.2 SYSTEM ARCHITECTURE | 9 |
| | 3.3 MODULE DESIGN | 10 |
| | 3.4 SYSTEM WORKFLOW | 11 |
| | 3.5 DATA FLOW DESIGN | 12 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.5.1 LEVEL 0 DATA FLOW DIAGRAM | 12 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.5.2 LEVEL 1 DATA FLOW DIAGRAM | 12 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.5.3 USE CASE DESIGN | 13 |
| | 3.6 DATABASE DESIGN | 13 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.6.1 DATABASE ENTITIES | 14 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.6.2 DATABASE RELATIONSHIP DIAGRAM | 14 |
| | 3.7 DATA STRUCTURES USED | 15 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.7.1 2D SPATIAL QUADTREE | 15 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.7.2 BINARY MIN-HEAP PRIORITY QUEUE | 15 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.7.3 CUSTOM CHAINED HASH MAP | 16 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.7.4 DYNAMIC ARRAYS AND LISTS | 16 |
| | 3.8 ALGORITHM DESIGN | 16 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.1 WEB AUDIO RMS ESTIMATION ALGORITHM | 16 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.2 QUADTREE POINT INSERTION ALGORITHM | 17 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.3 QUADTREE RADIUS RANGE QUERY ALGORITHM | 17 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.4 HAVERSINE DISTANCE FORMULATION | 18 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.5 MULTI-FACTOR PENALTY RECOMMENDATION ALGORITHM | 18 |
| | &nbsp;&nbsp;&nbsp;&nbsp;3.8.6 OBSERVATION FRESHNESS DECAY ALGORITHM | 19 |
| | 3.9 RECOMMENDATION DECISION LOGIC | 19 |
| | 3.10 SECURITY AND DATA INTEGRITY CONSIDERATIONS | 20 |
| | 3.11 SUMMARY | 20 |
| **4** | **IMPLEMENTATION AND EVALUATION** | **21** |
| | 4.1 INTRODUCTION | 21 |
| | 4.2 TECHNOLOGIES USED | 21 |
| | 4.3 FRONTEND IMPLEMENTATION | 22 |
| | 4.4 BACKEND IMPLEMENTATION | 22 |
| | 4.5 DATABASE IMPLEMENTATION | 23 |
| | 4.6 CLIENT AUDIO PROCESSING MODULE IMPLEMENTATION | 23 |
| | 4.7 SPATIAL QUADTREE MODULE IMPLEMENTATION | 24 |
| | 4.8 RECOMMENDATION AND MIN-HEAP IMPLEMENTATION | 24 |
| | 4.9 INTERACTIVE MAP AND ROUTING IMPLEMENTATION | 24 |
| | 4.10 PERFORMANCE LAB AND BENCHMARK IMPLEMENTATION | 25 |
| | 4.11 CAMPUS LOCATION DATASET ORGANIZATION | 25 |
| | 4.12 TEST EXECUTION AND RESULT GENERATION | 26 |
| | 4.13 VALIDATION AND TESTING | 26 |
| | 4.14 TEST CASES AND EXPECTED RESULTS | 27 |
| | 4.15 SUMMARY | 28 |
| **5** | **CONCLUSION** | **29** |
| | 5.1 PROJECT SUMMARY | 29 |
| | 5.2 OBJECTIVES ACHIEVED | 29 |
| | 5.3 BENEFITS OF THE SYSTEM | 30 |
| | 5.4 LIMITATIONS | 30 |
| | 5.5 CONCLUSION | 30 |
| **6** | **FUTURE ENHANCEMENTS** | **31** |
| | 6.1 INTRODUCTION | 31 |
| | 6.2 IOT AMBIENT HARDWARE SENSORS | 31 |
| | 6.3 MACHINE LEARNING TIME-SERIES FORECASTING | 31 |
| | 6.4 DYNAMIC MULTI-FLOOR INDOOR MAPPING | 31 |
| | 6.5 NATIVE MOBILE APPLICATION DEPLOYMENT | 32 |
| | 6.6 DESK-LEVEL STUDY POD RESERVATIONS | 32 |
| | 6.7 EXPANSION TO OTHER CAMPUSES | 32 |
| | 6.8 SUMMARY | 32 |
| | **APPENDICES** | **33** |
| | &nbsp;&nbsp;&nbsp;&nbsp;APPENDIX 1 – ADDITIONAL SYSTEM INFORMATION | 33 |
| | &nbsp;&nbsp;&nbsp;&nbsp;APPENDIX 2 – SAMPLE ALGORITHMS AND PSEUDOCODE | 34 |
| | &nbsp;&nbsp;&nbsp;&nbsp;APPENDIX 3 – SAMPLE DATABASE STRUCTURE | 35 |
| | **REFERENCES** | **37** |
| | **MAPPING OF PROJECT GOALS TO SUSTAINABLE DEVELOPMENT GOALS (SDGs)** | **38** |

---

## LIST OF TABLES

| TABLE No. | TABLE NAME | PAGE No. |
|---|---|---|
| 2.1 | Functional Requirements | 5 |
| 2.2 | Non-Functional Requirements | 6 |
| 2.3 | Hardware Requirements | 7 |
| 2.4 | Software Requirements | 7 |
| 2.5 | Feasibility Study | 8 |
| 3.1 | System Modules | 10 |
| 3.2 | Database Entities | 14 |
| 3.3 | Data Structures and Their Applications | 15 |
| 4.1 | Technology Stack | 21 |
| 4.2 | Verified Campus Locations Dataset | 25 |
| 4.3 | Sample Test Cases and Expected Results | 27 |
| A.1 | Sample Database Field Description | 35 |
| SDG.1 | Sustainable Development Goals Mapping Summary | 39 |

---

## LIST OF FIGURES

| FIGURE No. | FIGURE NAME | PAGE No. |
|---|---|---|
| 1.1 | Proposed System Workflow | 3 |
| 3.1 | Overall System Architecture | 9 |
| 3.2 | Module Interaction Diagram | 11 |
| 3.3 | Data Flow Diagram – Level 0 | 12 |
| 3.4 | Data Flow Diagram – Level 1 | 13 |
| 3.5 | Use Case Diagram | 13 |
| 3.6 | Database Relationship Diagram | 14 |
| 3.7 | In-Browser Web Audio RMS Estimation Flowchart | 17 |
| 3.8 | Spatial Quadtree Radius Query & Haversine Pruning Flowchart | 18 |
| 3.9 | Recommendation Scoring & Min-Heap Ranking Flowchart | 19 |

---

## LIST OF ABBREVIATIONS

| Abbreviation | Expansion |
|---|---|
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **CORS** | Cross-Origin Resource Sharing |
| **CSS** | Cascading Style Sheets |
| **dB** | Decibel |
| **dBFS** | Decibels Relative to Full Scale |
| **DFD** | Data Flow Diagram |
| **DBMS** | Database Management System |
| **DOM** | Document Object Model |
| **ECE** | Electronics and Communication Engineering |
| **EEE** | Electrical and Electronics Engineering |
| **FFT** | Fast Fourier Transform |
| **GIS** | Geographic Information System |
| **GPS** | Global Positioning System |
| **HTML** | HyperText Markup Language |
| **HTTP** | HyperText Transfer Protocol |
| **HTTPS** | HyperText Transfer Protocol Secure |
| **IDE** | Integrated Development Environment |
| **IT** | Information Technology |
| **KEC** | Kongu Engineering College |
| **NAAC** | National Assessment and Accreditation Council |
| **OSM** | OpenStreetMap |
| **PCM** | Pulse-Code Modulation |
| **PK** | Primary Key |
| **REST** | Representational State Transfer |
| **RMS** | Root-Mean-Square |
| **SDG** | Sustainable Development Goal |
| **SQL** | Structured Query Language |
| **SQLite** | Self-Contained Serverless SQL Database Engine |
| **SVG** | Scalable Vector Graphics |
| **UI** | User Interface |
| **UX** | User Experience |
| **W3C** | World Wide Web Consortium |

---

## CHAPTER 1: INTRODUCTION

### 1.1 GENERAL OVERVIEW
Higher education environments thrive on focused individual concentration, scholarly research, and quiet collaborative discussions. Kongu Engineering College (KEC), established under the autonomous framework in Perundurai, Erode, encompasses an expansive 167-acre campus. The institution features diverse physical facilities including the Central CD Memorial Library, numerous department blocks, research clusters, computer centres, convention halls, cafeterias, and student hostels. Across such a vast campus, ambient noise levels vary drastically depending on class transitions, ongoing laboratory sessions, administrative activities, and campus events.

QuietSpot 2.0 is an intelligent, full-stack campus noise mapping and quiet-spot recommendation system designed explicitly for students, researchers, and faculty members of Kongu Engineering College. By bridging spatial data structures, edge audio processing, and responsive web design, QuietSpot 2.0 offers an automated, privacy-conscious mechanism to discover, rank, and navigate to peaceful study spaces across the KEC campus in real time.

### 1.2 PROBLEM STATEMENT
Students frequently spend significant time walking across campus in search of an unoccupied, calm study environment, only to find designated reading areas unexpectedly crowded or noisy due to nearby events or maintenance operations. Existing campus maps are entirely static, providing geographic locations but zero live acoustic context. Furthermore, deploying dedicated physical decibel meter hardware across dozens of campus buildings is financially prohibitive and maintenance-intensive. On the other hand, conventional mobile sensing systems that record audio raise severe privacy and surveillance apprehensions among students and faculty. Therefore, there is a compelling need for a system that provides real-time acoustic intelligence and spatial search capabilities while maintaining zero audio persistence and guaranteeing student privacy.

### 1.3 OBJECTIVES OF THE PROJECT
The primary objective is to engineer a responsive, privacy-guaranteed geospatial web platform that facilitates real-time quiet-spot recommendation and noise mapping across the Kongu Engineering College campus. The specific objectives comprise:
1. To map 14 verified study and activity zones across the KEC campus using authentic survey coordinates.
2. To implement privacy-preserving, client-side Web Audio processing that estimates acoustic Root-Mean-Square (RMS) amplitude in volatile memory without recording raw audio.
3. To build a custom two-dimensional Spatial Quadtree in Python that accelerates spatial range queries and radius filtering.
4. To formulate a multi-factor recommendation algorithm utilizing a custom binary Min-Heap priority queue incorporating noise intensity, walking distance, and reading freshness.
5. To develop an interactive Algorithm Performance Lab comparing Quadtree execution against linear scan baselines.
6. To provide 1-click turn-by-turn walking route navigation through integrated Google Maps routing.

### 1.4 SCOPE OF THE PROJECT
The project encompasses the entire 167-acre geographic boundary of Kongu Engineering College (Latitude 11.2670° N to 11.2765° N, Longitude 77.5990° E to 77.6105° E). The system supports in-browser acoustic sampling, spatial radius querying up to 2.5 km, real-time recommendation scoring, and student ground-truth verification. AI speech recognition, invasive voice transcription, and dedicated hardware micro-controller nodes are deliberately outside the current project scope.

### 1.5 NEED FOR THE PROJECT
Academic productivity and cognitive retention depend heavily on acoustic tranquility. By providing empirical, real-time noise mapping without requiring expensive hardware installations or compromising user privacy, QuietSpot 2.0 optimizes study spot discovery and promotes productive academic engagement across the student community.

### 1.6 PROPOSED SYSTEM WORKFLOW
The application operates through a sequential six-stage workflow:
`User Geolocation Pinning` &rarr; `In-Browser Web Audio RMS Sampling` &rarr; `Spatial Quadtree Radius Querying` &rarr; `Multi-Factor Penalty Scoring Calculation` &rarr; `Min-Heap Top-K Quiet Ranking` &rarr; `1-Click Turn-by-Turn Navigation Routes`.

### 1.7 ORGANIZATION OF THE REPORT
The report is structured into six chapters, followed by Appendices, References, and SDG mapping. Chapter 2 presents system analysis and requirements. Chapter 3 elaborates on system architecture, spatial Quadtree data structures, and algorithmic formulations. Chapter 4 presents implementation details and testing results. Chapter 5 summarizes conclusions and Chapter 6 outlines future enhancements.

---

## CHAPTER 2: SYSTEM ANALYSIS

### 2.1 INTRODUCTION
System analysis encompasses the rigorous decomposition of functional and technical requirements necessary to build an authentic, low-latency, and privacy-respecting noise monitoring platform across the Kongu Engineering College campus.

### 2.2 EXISTING SYSTEM
Currently, campus quiet spaces are managed through static physical signboards (e.g., "Silence Please" boards in the Central Library) and general architectural zoning. Online navigation tools like Google Maps or OpenStreetMap offer street layouts and building names but possess zero awareness of acoustic levels, ambient crowding, or indoor study suitability.

### 2.3 LIMITATIONS OF THE EXISTING SYSTEM
1. **Static Nature:** Physical signs cannot reflect sudden noise surges caused by maintenance, events, or student gatherings.
2. **Hardware Cost Prohibitive:** Installing commercial IoT sound meter stations across 167 acres requires substantial financial investments and recurring calibration.
3. **Severe Privacy Risks:** Third-party mobile audio apps commonly record or transmit audio buffers to remote clouds, raising surveillance risks.
4. **Lack of Algorithmic Pruning:** Existing directories rely on simple linear scans, which do not scale efficiently for spatial candidate filtering.

### 2.4 PROPOSED SYSTEM
QuietSpot 2.0 transforms student laptops and smartphones into edge sensing nodes that process sound directly within the browser using the W3C Web Audio API. Derived acoustic metrics are spatialized via custom 2D Quadtree indexing and evaluated through a Min-Heap multi-factor recommendation pipeline, ensuring high computational speed, transparent provenance, and complete privacy.

### 2.5 ADVANTAGES OF THE PROPOSED SYSTEM
1. **Zero Hardware Expense:** Eliminates physical IoT sensors by leveraging existing student web browsers.
2. **Absolute Privacy Protection:** Raw audio samples are evaluated in RAM and immediately freed, ensuring zero eavesdropping.
3. **Sub-millisecond Spatial Search:** Quadtree spatial subdivision prunes irrelevant campus quadrants in $O(\log N)$ time.
4. **Direct Routing:** Connects recommendation results directly with turn-by-turn Google Maps walking routes.

---

## CHAPTER 3: SYSTEM DESIGN

### 3.1 SYSTEM ARCHITECTURE
QuietSpot 2.0 adopts a 3-Tier Layered Architecture:
1. **Presentation Layer (Client Tier):** React 19, Vite, Leaflet, and W3C Web Audio API.
2. **Application Layer (Server Tier):** Python 3.13, Flask 3.1, custom 2D Spatial Quadtree, binary Min-Heap, and polynomial chained Hash Map.
3. **Data Layer (Persistence Tier):** SQLite with strict foreign key constraints and composite indexing.

### 3.2 MATHEMATICAL FORMULATIONS

#### 1. In-Memory Root-Mean-Square (RMS) Acoustic Amplitude
$$\text{RMS} = \sqrt{\frac{1}{N}\sum_{i=0}^{N-1} x[i]^2}$$
$$\text{Relative Decibels (dBFS)} = 20 \cdot \log_{10}(\text{RMS} + \epsilon) + \text{offset}$$

#### 2. Haversine Great-Circle Spherical Distance
$$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
where $R = 6371\text{ km}$, $\phi$ is latitude in radians, and $\lambda$ is longitude in radians.

#### 3. Multi-Factor Quiet Spot Recommendation Penalty Scoring
$$\text{Score} = w_N \cdot P_{\text{noise}} + w_D \cdot P_{\text{distance}} + w_A \cdot P_{\text{age}}$$
Default weights: $w_N = 0.50$, $w_D = 0.30$, $w_A = 0.20$. Lower score designates a superior study candidate.

---

## CHAPTER 4: IMPLEMENTATION AND EVALUATION

### 4.1 AUTOMATED TESTING RESULTS
- **Backend Test Suite (`pytest -v`):** 21 / 21 tests PASSED in 1.00s.
- **Frontend Test Suite (`vitest run`):** 7 / 7 tests PASSED in 727ms.
- **Overall Quality Metric:** **100% Automated Test Pass Rate (28 / 28 Tests Passed)**.

---

## SUSTAINABLE DEVELOPMENT GOALS (SDG) MAPPING

| SDG Goal | Target | Concrete Project Contribution |
|---|---|---|
| **SDG 3: Good Health and Well-Being** | Target 3.9 | Protects student mental well-being by reducing chronic acoustic stress and auditory fatigue. |
| **SDG 4: Quality Education** | Target 4.a | Provides equitable, distraction-free study spaces across the 167-acre campus. |
| **SDG 9: Industry, Innovation & Infrastructure** | Target 9.5 | Implements custom spatial Quadtrees and zero-hardware edge audio computing. |
| **SDG 11: Sustainable Cities & Communities** | Target 11.6 | Delivers participatory environmental noise sensing for a smart educational campus. |

