import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Official Kongu Engineering College Colors
    KEC_GREEN_DARK = RGBColor(10, 84, 46)     # #0a542e
    KEC_GREEN_PRIMARY = RGBColor(16, 128, 67)  # #108043
    KEC_GREEN_LIGHT = RGBColor(240, 253, 244)  # #f0fdf4
    KEC_GOLD = RGBColor(202, 138, 4)           # #ca8a04
    TEXT_DARK = RGBColor(15, 23, 42)           # #0f172a
    TEXT_MUTED = RGBColor(100, 116, 139)       # #64748b
    BG_CARD = RGBColor(255, 255, 255)
    BORDER_LIGHT = RGBColor(226, 232, 240)
    BG_PAGE = RGBColor(248, 250, 252)

    def add_header(slide, title_text, category_text="REVIEW 2 PRESENTATION"):
        # Top banner background
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = KEC_GREEN_DARK
        top_bar.line.fill.background()

        # Thin gold separator line
        gold_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.15), Inches(13.333), Inches(0.06))
        gold_line.fill.solid()
        gold_line.fill.fore_color.rgb = KEC_GOLD
        gold_line.line.fill.background()

        # Institution and department header text
        tb_inst = slide.shapes.add_textbox(Inches(0.6), Inches(0.1), Inches(8.5), Inches(0.35))
        tf_inst = tb_inst.text_frame
        tf_inst.word_wrap = True
        p_inst = tf_inst.paragraphs[0]
        p_inst.text = "KONGU ENGINEERING COLLEGE (Autonomous), PERUNDURAI - 638060"
        p_inst.font.name = "Arial"
        p_inst.font.size = Pt(10.5)
        p_inst.font.bold = True
        p_inst.font.color.rgb = RGBColor(220, 252, 231)

        # Slide Title
        tb_title = slide.shapes.add_textbox(Inches(0.6), Inches(0.42), Inches(9.5), Inches(0.65))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.color.rgb = RGBColor(255, 255, 255)

        # Right category tag
        tb_tag = slide.shapes.add_textbox(Inches(9.5), Inches(0.25), Inches(3.2), Inches(0.6))
        tf_tag = tb_tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.alignment = PP_ALIGN.RIGHT
        p_tag.text = category_text
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = KEC_GOLD

        # Slide Footer
        footer_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.05), Inches(13.333), Inches(0.04))
        footer_line.fill.solid()
        footer_line.fill.fore_color.rgb = BORDER_LIGHT
        footer_line.line.fill.background()

        tb_foot = slide.shapes.add_textbox(Inches(0.6), Inches(7.1), Inches(12.133), Inches(0.35))
        tf_foot = tb_foot.text_frame
        p_foot = tf_foot.paragraphs[0]
        p_foot.text = "QuietSpot — Campus Noise Mapping & Quiet-Spot Recommendation System Using Quadtree  |  Department of CSE"
        p_foot.font.name = "Arial"
        p_foot.font.size = Pt(9.5)
        p_foot.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title=None, bg_color=BG_CARD, border_color=BORDER_LIGHT):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = "Arial"
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = KEC_GREEN_DARK

        return card

    # =========================================================================
    # SLIDE 1: Title Slide with Team Members and Guide Details
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)

    # Full background cover with dark green banner
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(248, 250, 252)
    bg1.line.fill.background()

    top_banner1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(3.2))
    top_banner1.fill.solid()
    top_banner1.fill.fore_color.rgb = KEC_GREEN_DARK
    top_banner1.line.fill.background()

    accent_bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(3.2), Inches(13.333), Inches(0.08))
    accent_bar1.fill.solid()
    accent_bar1.fill.fore_color.rgb = KEC_GOLD
    accent_bar1.line.fill.background()

    # College Title
    tb_inst1 = slide1.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.8))
    tf1 = tb_inst1.text_frame
    p1 = tf1.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    p1.text = "KONGU ENGINEERING COLLEGE (AUTONOMOUS)"
    p1.font.name = "Arial"
    p1.font.size = Pt(21)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)

    p1_sub = tf1.add_paragraph()
    p1_sub.alignment = PP_ALIGN.CENTER
    p1_sub.text = "Affiliated to Anna University | Accredited by NAAC with 'A++' Grade\nPerundurai, Erode - 638 060, Tamil Nadu, India"
    p1_sub.font.name = "Arial"
    p1_sub.font.size = Pt(11)
    p1_sub.font.color.rgb = RGBColor(220, 252, 231)

    # Project Title Box
    tb_proj = slide1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(1.4))
    tf_proj = tb_proj.text_frame
    p_proj = tf_proj.paragraphs[0]
    p_proj.alignment = PP_ALIGN.CENTER
    p_proj.text = "QUIETSPOT"
    p_proj.font.name = "Arial"
    p_proj.font.size = Pt(32)
    p_proj.font.bold = True
    p_proj.font.color.rgb = KEC_GOLD

    p_proj_sub = tf_proj.add_paragraph()
    p_proj_sub.alignment = PP_ALIGN.CENTER
    p_proj_sub.text = "Intelligent Campus Noise Mapping and Quiet-Spot Recommendation System Using Quadtree"
    p_proj_sub.font.name = "Arial"
    p_proj_sub.font.size = Pt(15)
    p_proj_sub.font.bold = True
    p_proj_sub.font.color.rgb = RGBColor(255, 255, 255)

    p_rev = tf_proj.add_paragraph()
    p_rev.alignment = PP_ALIGN.CENTER
    p_rev.text = "PROJECT REVIEW - II (Phase of 70%+ Prototype Completion)"
    p_rev.font.name = "Arial"
    p_rev.font.size = Pt(12)
    p_rev.font.bold = True
    p_rev.font.color.rgb = RGBColor(187, 247, 208)

    # Card 1: Team Members
    add_card(slide1, Inches(1.2), Inches(3.6), Inches(5.2), Inches(3.1), title="PROJECT TEAM MEMBERS")
    tb_team = slide1.shapes.add_textbox(Inches(1.5), Inches(4.2), Inches(4.6), Inches(2.3))
    tf_team = tb_team.text_frame
    team_members = [
        ("Student 1 (Team Leader)", "Roll No: 22CSRxxx"),
        ("Student 2", "Roll No: 22CSRxxx"),
        ("Student 3", "Roll No: 22CSRxxx"),
        ("Student 4", "Roll No: 22CSRxxx"),
    ]
    for name, roll in team_members:
        p = tf_team.add_paragraph()
        p.text = f"• {name}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        p_sub = tf_team.add_paragraph()
        p_sub.text = f"   {roll}  |  B.E. Computer Science and Engineering"
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = TEXT_MUTED

    # Card 2: Supervisor / Guide Details
    add_card(slide1, Inches(6.9), Inches(3.6), Inches(5.2), Inches(3.1), title="SUPERVISOR & INSTITUTION DETAILS")
    tb_guide = slide1.shapes.add_textbox(Inches(7.2), Inches(4.2), Inches(4.6), Inches(2.3))
    tf_guide = tb_guide.text_frame
    guide_info = [
        ("Project Supervisor / Guide:", Pt(11), TEXT_MUTED, False),
        ("Dr. / Prof. [Guide Name], M.E., Ph.D.", Pt(13), KEC_GREEN_DARK, True),
        ("Assistant Professor / Associate Professor", Pt(11), TEXT_DARK, False),
        ("Department of Computer Science and Engineering", Pt(11), TEXT_DARK, False),
        ("\nAcademic Year & Semester:", Pt(11), TEXT_MUTED, False),
        ("2024 - 2025  |  Pre-Final / Final Year Mini-Project", Pt(11), TEXT_DARK, True),
        ("Institution: Kongu Engineering College (Autonomous), Perundurai", Pt(10.5), KEC_GREEN_PRIMARY, True)
    ]
    for text, sz, col, bld in guide_info:
        p = tf_guide.add_paragraph()
        p.text = text
        p.font.name = "Arial"
        p.font.size = sz
        p.font.color.rgb = col
        p.font.bold = bld

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "2. Problem Statement", "CHALLENGE & MOTIVATION")

    add_card(slide2, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), title="Campus Scale & Noise Challenges")
    tb2_left = slide2.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.2), Inches(4.4))
    tf2_left = tb2_left.text_frame
    tf2_left.word_wrap = True

    pts2_left = [
        ("Vast Academic Campus:", "Kongu Engineering College (KEC) spans over 167 acres with dozens of departmental blocks, reading halls, food courts, and convention centers."),
        ("Dynamic Noise Fluctuations:", "Campus noise varies drastically by hour (lectures, laboratory machinery, lunch peak, cultural events, and vehicle commute at main gates)."),
        ("Productivity Loss for Students:", "Students waste 15 to 30 minutes walking between blocks searching for quiet revision spots during exams and project work."),
        ("Lack of Real-time Awareness:", "Existing campus maps and notice boards provide only static physical locations with zero dynamic environmental awareness.")
    ]
    for head, body in pts2_left:
        p = tf2_left.add_paragraph()
        p.text = f"• {head} "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = KEC_GREEN_DARK
        p2 = tf2_left.add_paragraph()
        p2.text = f"  {body}"
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_DARK

    add_card(slide2, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), title="Technical & Privacy Dilemma")
    tb2_right = slide2.shapes.add_textbox(Inches(7.0), Inches(2.1), Inches(5.3), Inches(4.4))
    tf2_right = tb2_right.text_frame
    tf2_right.word_wrap = True

    pts2_right = [
        ("Prohibitive Hardware Costs:", "Deploying thousands of dedicated calibrated decibel IoT sound sensors across a 167-acre campus requires massive capital and ongoing maintenance."),
        ("Eavesdropping & Privacy Fears:", "Traditional crowdsourcing acoustic apps often capture or upload raw audio buffers, causing students to reject microphone permissions due to privacy concerns."),
        ("Inefficient Spatial Search ($O(N)$):", "Naively querying all campus coordinates using linear search scales poorly as geographic telemetry points grow."),
        ("Our Core Problem Statement:", "How can we provide KEC students with real-time, privacy-guaranteed quiet study recommendations using existing devices, accelerated by custom 2D Spatial Quadtree indexing?")
    ]
    for head, body in pts2_right:
        p = tf2_right.add_paragraph()
        p.text = f"• {head} "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = KEC_GOLD if "Core" in head else KEC_GREEN_DARK
        p2 = tf2_right.add_paragraph()
        p2.text = f"  {body}"
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 3: Domain Background
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "3. Domain Background", "LITERATURE & FOUNDATIONS")

    domains = [
        ("1. Smart Campus Geospatial Systems (GIS)", 
         "• Integrates OpenStreetMap (OSM) vector geometry and GPS coordinates to model real-world campus facilities.\n• Requires spatial boundary containment to prevent spurious out-of-campus data.\n• KEC campus bounds: Latitude [11.2650, 11.2800] N, Longitude [77.5950, 77.6150] E."),
        
        ("2. Pervasive Crowd-Sensing & Acoustic Monitoring", 
         "• Transforms everyday mobile devices into distributed environmental sensor nodes without capital expense.\n• Addresses coverage gaps through consensual peer telemetry contributions.\n• Replaces centralized sensor grids with decentralized, high-availability mobile crowd-sensing."),
        
        ("3. Edge Audio Processing (W3C Web Audio API)", 
         "• Enables hardware-accelerated Digital Signal Processing (DSP) directly inside the client browser sandbox.\n• Processes PCM Float32 time-domain audio buffers into Root-Mean-Square (RMS) amplitude locally in volatile RAM.\n• Eliminates audio upload bandwidth and enforces zero raw audio persistence."),
        
        ("4. Spatial Data Structures & Algorithmic Optimization", 
         "• Spatial Quadtree: Hierarchical 2D space partitioning decomposing quadrants (NW, NE, SW, SE).\n• Prunes non-candidate search branches in O(log N + K) time vs O(N) linear exhaustion.\n• Min-Heap priority queues enable optimal top-K multi-criteria ranking.")
    ]

    coords = [(Inches(0.8), Inches(1.5)), (Inches(6.8), Inches(1.5)), (Inches(0.8), Inches(4.2)), (Inches(6.8), Inches(4.2))]
    for i, (title, content) in enumerate(domains):
        x, y = coords[i]
        add_card(slide3, x, y, Inches(5.7), Inches(2.6), title=title)
        tb = slide3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.6), Inches(5.3), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        for line in content.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Arial"
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 4: Objectives of the Project
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "4. Objectives of the Project", "PROJECT GOALS")

    objs = [
        ("OBJ-1: Verified Campus Geospatial Mapping", "Map and verify key quiet study locations within Kongu Engineering College (CD Memorial Central Library, IT Lounge, Admin Hall, Maharaja Auditorium, Hostels) using authentic OpenStreetMap data."),
        ("OBJ-2: Strict Zero-Audio-Upload Privacy Engine", "Implement in-browser client-side Web Audio API RMS estimation where raw audio buffers are processed in volatile memory and immediately discarded. Never record, persist, or transmit audio bytes."),
        ("OBJ-3: Custom 2D Spatial Quadtree Implementation", "Develop a custom 2D Quadtree from scratch in Python to achieve hierarchical spatial quadrant subdivision, rectangular range filtering, and radius candidate pruning without external spatial libraries."),
        ("OBJ-4: Multi-Criteria Quiet Recommendation Engine", "Engineer a weighted scoring model: Score = wN * Noise + wD * Distance + wA * Age, ranked via a custom binary Min-Heap priority queue to recommend optimal quiet study zones."),
        ("OBJ-5: Empirical Algorithm Performance Lab", "Build an interactive benchmark module comparing Custom Quadtree vs Linear Scan over varying dataset sizes (500 to 20,000 points) with high-resolution nanosecond timers and equality verification."),
        ("OBJ-6: Fully Responsive Student Web & Mobile Interface", "Deliver a unified responsive web application matching Figma specifications with interactive Leaflet map, live decibel gauge, 1-click Google Maps navigation, and community ground-truth verification.")
    ]

    for i, (head, desc) in enumerate(objs):
        col = i % 2
        row = i // 2
        left = Inches(0.8) if col == 0 else Inches(6.8)
        top = Inches(1.5 + row * 1.8)
        add_card(slide4, left, top, Inches(5.7), Inches(1.65))
        
        # Pill badge on card
        tb = slide4.shapes.add_textbox(left + Inches(0.2), top + Inches(0.12), Inches(5.3), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = head
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = KEC_GREEN_DARK

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 5: Existing System
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "5. Existing System vs Limitations", "COMPARATIVE ANALYSIS")

    # Table comparing existing systems
    table_shape = slide5.shapes.add_table(5, 4, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.2))
    table = table_shape.table
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(3.2)
    table.columns[2].width = Inches(3.2)
    table.columns[3].width = Inches(3.133)

    headers = ["Existing Approach", "Working Mechanism", "Key Limitations", "Impact on Students"]
    for col_idx, text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = KEC_GREEN_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)
        p.alignment = PP_ALIGN.CENTER

    data = [
        ("Physical Signboards & Static Notice Boards", "Printed quiet zone signs placed at library and seminar entrance doors.", "Static, non-dynamic, cannot reflect sudden overcrowding, event noise, or maintenance work.", "Students walk across campus only to find the spot crowded or noisy."),
        ("Generic Map Apps (Google Maps, Apple Maps)", "Displays road network, building footprint, and generic navigation routes.", "Zero acoustic awareness; no indoor noise data; no quiet study recommendations.", "Helps reach a building, but cannot indicate acoustic comfort inside."),
        ("Dedicated IoT Hardware Decibel Meters", "Microcontroller boards (ESP32/Raspberry Pi) hardwired with sound sensors.", "Exorbitant setup and maintenance cost; vulnerable to vandalism and weather damage.", "Unscalable across a 167-acre campus; limited to 2-3 isolated test points."),
        ("Third-Party Acoustic Sound Apps", "Smartphone microphone recording apps measuring decibels on device.", "Often upload raw audio or audio buffers, triggering severe privacy and data security concerns.", "Students hesitate or reject installation due to eavesdropping fears.")
    ]

    for row_idx, row_data in enumerate(data, start=1):
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = BG_PAGE if row_idx % 2 == 1 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = KEC_GREEN_DARK if col_idx == 0 else TEXT_DARK
            p.font.bold = True if col_idx == 0 else False

    # Summary callout bottom
    tb_sum = slide5.shapes.add_textbox(Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.8))
    tf_sum = tb_sum.text_frame
    p_sum = tf_sum.paragraphs[0]
    p_sum.text = "Summary of Gaps: High infrastructure cost, lack of real-time acoustic updates, zero algorithmic candidate pruning, and lack of client-side privacy guarantees in existing systems."
    p_sum.font.name = "Arial"
    p_sum.font.size = Pt(11)
    p_sum.font.bold = True
    p_sum.font.color.rgb = KEC_GOLD

    # =========================================================================
    # SLIDE 6: Proposed System
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "6. Proposed System — QuietSpot", "SOLUTION ARCHITECTURE")

    props = [
        ("1. Client-Side Distributed Sensing", 
         "Leverages students' existing smartphones and laptops without requiring expensive external hardware sensors. Runs purely in modern web browsers."),
        ("2. W3C Web Audio Privacy Pipeline", 
         "Calculates Root-Mean-Square (RMS) amplitude locally in volatile memory. Strictly zero raw audio buffers are stored or uploaded to the server."),
        ("3. Custom 2D Spatial Quadtree", 
         "Indexes all campus study spots hierarchically, enabling sub-millisecond candidate pruning in O(log N + K) time instead of O(N) linear exhaustion."),
        ("4. Multi-Criteria Ranking via Min-Heap", 
         "Combines normalized noise penalty (wN=0.50), walking distance (wD=0.30), and reading age/freshness (wA=0.20) ranked via custom binary Min-Heap."),
        ("5. Transparent Data Provenance & Freshness", 
         "Distinguishes Fresh (<30 min), Aging (30-120 min), and Stale (>120 min). Unmeasured locations are penalized transparently rather than assumed quiet."),
        ("6. Integrated Google Maps Navigation", 
         "Generates 1-click turn-by-turn walking route directions from the student's current GPS position to the selected campus study spot.")
    ]

    for i, (head, desc) in enumerate(props):
        col = i % 3
        row = i // 3
        left = Inches(0.8 + col * 3.95)
        top = Inches(1.5 + row * 2.6)
        add_card(slide6, left, top, Inches(3.8), Inches(2.4), title=head)
        tb = slide6.shapes.add_textbox(left + Inches(0.2), top + Inches(0.65), Inches(3.4), Inches(1.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_DARK
        p.line_spacing = 1.2

    # =========================================================================
    # SLIDE 7: System Architecture / Workflow Diagram
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "7. System Architecture & Workflow", "ARCHITECTURAL BLUEPRINT")

    # Workflow diagram boxes
    tiers = [
        ("CLIENT TIER (Frontend)", 
         "React 19 + Vite 5 + Vanilla CSS\n• Web Audio API (Float32 RMS Engine)\n• Leaflet Interactive Campus Map\n• Geolocation API (Manual Fallback)\n• Algorithm Benchmark Visualizer\n• Live Decibel Gauge & Audio Spectrum"),
        
        ("REST API & SECURITY LAYER", 
         "Python Flask 3.1 + Flask-CORS\n• Route Handlers (/locations, /readings)\n• Raw-Audio Payload Rejector (HTTP 400)\n• Campus Bounding Box Validator\n• Auth & Session Verification\n• JSON Request/Response Serialization"),
        
        ("ALGORITHM & SERVICE TIER", 
         "Custom Algorithmic Core\n• Custom 2D Spatial Quadtree (quadtree.py)\n• Custom Hash Map (custom_hash_map.py)\n• Custom Binary Min-Heap (min_heap.py)\n• Recommendation Engine (recommendation.py)\n• Haversine Spherical Distance Math"),
        
        ("PERSISTENCE TIER (Database)", 
         "SQLite Database Engine\n• campus_locations (OSM Verified Coordinates)\n• noise_readings (Derived dB Telemetry)\n• user_feedback (Student Ground-Truth)\n• app_users (PBKDF2 Password Hashes)\n• Foreign Keys & Composite Indexes")
    ]

    for i, (title, content) in enumerate(tiers):
        top = Inches(1.5 + i * 1.35)
        card = add_card(slide7, Inches(0.8), top, Inches(11.733), Inches(1.2), bg_color=KEC_GREEN_LIGHT if i % 2 == 0 else BG_CARD)
        
        # Step label box
        step_box = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), top + Inches(0.25), Inches(2.8), Inches(0.7))
        step_box.fill.solid()
        step_box.fill.fore_color.rgb = KEC_GREEN_DARK
        step_box.line.fill.background()
        p_step = step_box.text_frame.paragraphs[0]
        p_step.text = title
        p_step.alignment = PP_ALIGN.CENTER
        p_step.font.name = "Arial"
        p_step.font.size = Pt(11)
        p_step.font.bold = True
        p_step.font.color.rgb = RGBColor(255, 255, 255)

        # Content text
        tb = slide7.shapes.add_textbox(Inches(4.0), top + Inches(0.1), Inches(8.3), Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        for line in content.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_DARK
            p.font.bold = True if line.startswith("•") == False else False

    # =========================================================================
    # SLIDE 8: Modules Description
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "8. Modules Description", "FUNCTIONAL MODULES")

    modules = [
        ("Module 1: In-Browser Web Audio Acoustic Engine", 
         "• Interfaces with navigator.mediaDevices.getUserMedia with explicit consent.\n• Creates AudioContext and AnalyserNode (FFT size: 1024).\n• Converts time-domain PCM samples to Root-Mean-Square (RMS) amplitude.\n• Maps dBFS to relative scale (20 to 100 rel. dB) and categorizes into Quiet (<45), Moderate (45-65), Noisy (>65)."),
        
        ("Module 2: Interactive Campus Geospatial Visualizer", 
         "• Implements Leaflet map centered on Kongu Engineering College (11.27218° N, 77.60400° E).\n• Renders custom color-coded SVG markers showing real-time noise status.\n• Features interactive popups, 'Locate Me', 'Campus Center', and category filter pills.\n• Offers 1-click turn-by-turn navigation via Google Maps walking directions."),
        
        ("Module 3: Custom Spatial Quadtree Engine", 
         "• Custom recursive 2D spatial tree partitioning lat/lon space into 4 quadrants.\n• Performs rectangular boundary queries and circular radius candidate pruning.\n• Reduces candidate evaluation from O(N) to O(log N + K) average complexity.\n• Backed by Custom Hash Map for O(1) instant location metadata retrieval."),
        
        ("Module 4: Recommendation & Multi-Criteria Ranking", 
         "• Formulates composite score combining noise penalty, distance, and reading freshness.\n• Leverages Custom Binary Min-Heap to extract top-K quiet study candidates.\n• Generates transparent explanations (e.g. 'Quiet environment (28 dB)', 'Near location (180m)').\n• Transparently penalizes unmeasured spots for data uncertainty."),
        
        ("Module 5: Student Ground-Truth Verification", 
         "• Empowers students to submit physical verifications ('Accurate', 'Moderately Noisy', 'Crowded').\n• Displays real-time 24-hour historical trend charts for each location.\n• Persists student feedback to validate live sensor readings against real experiences."),
        
        ("Module 6: Empirical Algorithm Performance Lab", 
         "• Built-in benchmarking suite running real side-by-side Quadtree vs Linear Scan tests.\n• Configurable dataset size (500 to 20,000 points) and search radius (0.1 to 3.0 km).\n• Employs high-resolution nanosecond timing and verifies 100% ID result equality.")
    ]

    for i, (title, content) in enumerate(modules):
        col = i % 2
        row = i // 2
        left = Inches(0.8) if col == 0 else Inches(6.8)
        top = Inches(1.5 + row * 1.8)
        add_card(slide8, left, top, Inches(5.7), Inches(1.68), title=title)
        tb = slide8.shapes.add_textbox(left + Inches(0.2), top + Inches(0.48), Inches(5.3), Inches(1.15))
        tf = tb.text_frame
        tf.word_wrap = True
        for line in content.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Arial"
            p.font.size = Pt(9.5)
            p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 9: Tools and Technologies Used
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "9. Tools and Technologies Used", "TECH STACK")

    tools = [
        ("Frontend Technologies", [
            ("React 19 & Vite 5", "Modern reactive component architecture with sub-second HMR"),
            ("React Router v6", "HashRouter single-page routing without 404 reload issues"),
            ("Leaflet & OpenStreetMap", "Geospatial vector mapping with authentic KEC campus survey tiles"),
            ("Lucide React Icons", "Clean SVG iconography matching Figma visual directions"),
            ("Vanilla CSS Design Tokens", "Figma-specified green (#16a34a), white, and slate dark palette")
        ]),
        ("Backend Technologies", [
            ("Python 3.13", "High-performance core backend runtime"),
            ("Flask 3.1 & Flask-CORS", "Lightweight, modular RESTful microframework"),
            ("SQLite 3 Persistence", "Embedded relational database with ACID compliance & indexes"),
            ("Werkzeug Security", "PBKDF2 SHA-256 cryptographic password hashing"),
            ("pytest 9.1", "Automated backend unit & integration test runner (21 tests)")
        ]),
        ("Hardware & Spatial APIs", [
            ("W3C Web Audio API", "In-browser AudioContext, AnalyserNode for local Float32 RMS estimation"),
            ("Browser Geolocation API", "Accurate GPS positioning with campus landmark fallback"),
            ("OpenStreetMap Overpass API", "Verified geospatial ground-truth coordinates for KEC buildings"),
            ("Google Maps Navigation API", "External URL routing scheme for turn-by-turn walking guidance"),
            ("Vitest Test Suite", "Frontend unit test runner (7 tests passing)")
        ])
    ]

    for col_idx, (cat_title, items) in enumerate(tools):
        left = Inches(0.8 + col_idx * 3.95)
        add_card(slide9, left, Inches(1.5), Inches(3.8), Inches(5.2), title=cat_title)
        tb = slide9.shapes.add_textbox(left + Inches(0.2), Inches(2.1), Inches(3.4), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True
        for name, desc in items:
            p = tf.add_paragraph()
            p.text = f"• {name}"
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.bold = True
            p.font.color.rgb = KEC_GREEN_DARK

            p2 = tf.add_paragraph()
            p2.text = f"  {desc}\n"
            p2.font.name = "Arial"
            p2.font.size = Pt(9.5)
            p2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 10: Database Design / Dataset Details
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "10. Database Design & Campus Dataset", "DATA PERSISTENCE & OSM DATA")

    add_card(slide10, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.2), title="SQLite Database Tables & Integrity Constraints")
    tb10_left = slide10.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.6), Inches(4.5))
    tf10_left = tb10_left.text_frame
    tf10_left.word_wrap = True

    db_details = [
        ("campus_locations (Primary Entity):", 
         "id (PK), name, latitude, longitude, location_type, description, image_url, is_active, data_source, created_at, updated_at.\n• Indexed on (latitude, longitude) & (is_active)."),
        ("noise_readings (Acoustic Telemetry):", 
         "id (PK), location_id (FK -> campus_locations), relative_intensity, noise_category, measured_at, measurement_method, data_source, device_session_id.\n• Indexed on (location_id, measured_at DESC)."),
        ("user_feedback (Ground-Truth Verification):", 
         "id (PK), location_id (FK), feedback_value, user_comment, created_at."),
        ("app_users (Student Authentication):", 
         "id (PK), username (UNIQUE), email (UNIQUE), password_hash (PBKDF2), created_at."),
        ("Privacy Enforcement in DB:", 
         "Strictly ZERO BLOB / audio fields exist in schema. Any raw audio insert attempt is rejected at API gateway.")
    ]
    for head, body in db_details:
        p = tf10_left.add_paragraph()
        p.text = head
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = KEC_GREEN_DARK
        p2 = tf10_left.add_paragraph()
        p2.text = body
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_DARK

    add_card(slide10, Inches(7.1), Inches(1.5), Inches(5.4), Inches(5.2), title="Verified KEC Campus Locations Dataset")
    tb10_right = slide10.shapes.add_textbox(Inches(7.3), Inches(2.0), Inches(5.0), Inches(4.5))
    tf10_right = tb10_right.text_frame
    tf10_right.word_wrap = True

    locs = [
        ("CD Memorial Central Library", "11.27096° N, 77.60528° E", "Library (Quiet Zone)"),
        ("IT Block Study Lounge", "11.27339° N, 77.60690° E", "Academic (Quiet)"),
        ("Admin Block Reading Hall", "11.27429° N, 77.60705° E", "Study Area (Quiet)"),
        ("Maharaja Auditorium Foyer", "11.27236° N, 77.60597° E", "Convention (Quiet)"),
        ("Science & Humanities Quad", "11.27487° N, 77.60778° E", "Green Lawn (Moderate)"),
        ("ECE Dept Seminar Alcove", "11.27220° N, 77.60542° E", "Academic (Quiet)"),
        ("Mechanical & Mechatronics", "11.27029° N, 77.60380° E", "Academic (Moderate)"),
        ("KEC Food Court", "11.27263° N, 77.60678° E", "Cafeteria (Noisy)"),
        ("Single's Canteen Courtyard", "11.27118° N, 77.60620° E", "Cafeteria (Moderate)"),
        ("Hostel Study Halls (Dheeran)", "11.27133° N, 77.60669° E", "Residential (Quiet)"),
        ("KEC Bus Stand & Gate 1", "11.27340° N, 77.60825° E", "Transit (Noisy)")
    ]

    for name, coords_str, typ in locs:
        p = tf10_right.add_paragraph()
        p.text = f"• {name}: {coords_str} [{typ}]"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 11: Algorithm / Methodology Used
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "11. Algorithm & Mathematical Methodology", "ALGORITHMIC FOUNDATIONS")

    algos = [
        ("1. Custom 2D Spatial Quadtree", 
         "• Principle: Hierarchically subdivides 2D space into 4 child quadrants (NW, NE, SW, SE) when bucket capacity K=4 is exceeded.\n• Range Query: Rectangular box intersection pruning eliminates entire irrelevant quadrants.\n• Radius Query: First checks bounding box enclosing the radius, followed by exact Haversine verification.\n• Complexity: O(log N + K) average query vs O(N) linear search."),
        
        ("2. Custom Separate Chaining Hash Map", 
         "• Polynomial Rolling Hash: h = (sum(c_i * 31^i)) mod capacity.\n• Separate Chaining: Linked list buckets resolve hash collisions cleanly.\n• Dynamic Resizing: Doubles capacity and rehashes when load factor exceeds 0.75.\n• Complexity: O(1) average insertion, lookup, and deletion for instant location caching."),
        
        ("3. Custom Binary Min-Heap Priority Queue", 
         "• Array-backed binary tree where parent node <= child nodes.\n• Operations: insert(priority, data) via sift_up; extract_min() via sift_down.\n• Top-K Retrieval: Efficiently extracts the most suitable quiet spots in O(K log N) time."),
        
        ("4. Recommendation & Freshness Scoring Formulation", 
         "• Composite Score = wN * NoisePenalty + wD * DistancePenalty + wA * AgePenalty\n• Weights: wN = 0.50 (Noise), wD = 0.30 (Distance), wA = 0.20 (Freshness).\n• Haversine Spherical Distance: d = 2R * atan2(sqrt(a), sqrt(1-a)), where R = 6371 km.\n• Transparent Missing Data: Unmeasured spots receive 0.65 uncertainty penalty (never assumed quiet).")
    ]

    for i, (title, content) in enumerate(algos):
        col = i % 2
        row = i // 2
        left = Inches(0.8) if col == 0 else Inches(6.8)
        top = Inches(1.5 + row * 2.6)
        add_card(slide11, left, top, Inches(5.7), Inches(2.4), title=title)
        tb = slide11.shapes.add_textbox(left + Inches(0.2), top + Inches(0.55), Inches(5.3), Inches(1.75))
        tf = tb.text_frame
        tf.word_wrap = True
        for line in content.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 12: Screenshots of Working Modules
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "12. Screenshots of Working Modules", "USER INTERFACE SHOWCASE")

    screens = [
        ("Screen 1: Landing Page & KEC Branding", 
         "• Features Kongu Engineering College campus badge.\n• Prominent 'Find Your Perfect Study Spot' headline.\n• Actionable CTAs directing users to Campus Map and Live Monitoring."),
        
        ("Screen 2: Automatic Live Monitor Modal", 
         "• Pops up upon entering the website with smooth backdrop blur.\n• Transparently explains local Web Audio RMS estimation.\n• 1-click 'Allow & Start Live Monitor' triggers native browser permission."),
        
        ("Screen 3: Interactive Leaflet Campus Map", 
         "• Centered precisely on KEC coordinates (11.27218, 77.6040).\n• Custom color-coded pins: Green (Quiet), Amber (Moderate), Red (Noisy), Gray (Stale).\n• Interactive popups with 'Navigate' link and 'Locate Me'."),
        
        ("Screen 4: Live Noise Monitoring Studio", 
         "• Animated decibel speedometer & frequency waveform spectrum.\n• Start, Pause, Stop controls with full media stream cleanup.\n• Consented telemetry contribution toggle sending derived dB every 8s."),
        
        ("Screen 5: Filterable Quiet Spots Directory", 
         "• Dynamic category filter pills (Quiet, Moderate, Noisy, Unknown/Stale).\n• Real-time distance calculation from user GPS position.\n• Direct 1-click Google Maps turn-by-turn walking route links."),
        
        ("Screen 6: Algorithm Performance Lab", 
         "• Interactive slider for dataset size (500 to 20,000 points).\n• High-resolution nanosecond execution timers.\n• Verified Equality Banner proving 100% result match between Quadtree & Linear scan.")
    ]

    for i, (title, content) in enumerate(screens):
        col = i % 3
        row = i // 3
        left = Inches(0.8 + col * 3.95)
        top = Inches(1.5 + row * 2.6)
        add_card(slide12, left, top, Inches(3.8), Inches(2.4), title=title)
        tb = slide12.shapes.add_textbox(left + Inches(0.2), top + Inches(0.6), Inches(3.4), Inches(1.65))
        tf = tb.text_frame
        tf.word_wrap = True
        for line in content.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 13: Project Demonstration & Review 2 Milestone Status
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "13. Project Demonstration & Review 2 Status", "85%+ COMPLETION VERIFIED")

    # Left: Progress breakdown table demonstrating > 70% completed
    add_card(slide13, Inches(0.8), Inches(1.5), Inches(6.5), Inches(5.2), title="Review 2 Milestone Status (>85% Completed)")
    
    table_shape13 = slide13.shapes.add_table(7, 3, Inches(1.0), Inches(2.1), Inches(6.1), Inches(4.3))
    t13 = table_shape13.table
    t13.columns[0].width = Inches(2.8)
    t13.columns[1].width = Inches(1.8)
    t13.columns[2].width = Inches(1.5)

    headers13 = ["Component / Module", "Implementation State", "Review Status"]
    for c_idx, txt in enumerate(headers13):
        cell = t13.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = KEC_GREEN_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = txt
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)

    status_data = [
        ("Backend RESTful API & Persistence", "Python 3.13 Flask + SQLite", "100% Completed"),
        ("Custom 2D Spatial Quadtree", "quadtree.py (from scratch)", "100% Completed"),
        ("Custom Hash Map & Min-Heap", "custom_hash_map.py & min_heap.py", "100% Completed"),
        ("Web Audio API Privacy Engine", "Pure Client-Side Float32 RMS", "100% Completed"),
        ("Interactive Leaflet Campus Map", "Verified KEC OSM Coordinates", "100% Completed"),
        ("Automated Test Verification", "28/28 Unit & Endpoint Tests Passed", "100% Completed")
    ]
    for r_idx, (m, st, pct) in enumerate(status_data, start=1):
        for c_idx, val in enumerate([m, st, pct]):
            cell = t13.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = KEC_GREEN_LIGHT if r_idx % 2 == 1 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(9.5)
            p.font.color.rgb = KEC_GREEN_DARK if c_idx == 2 else TEXT_DARK
            p.font.bold = True if c_idx == 2 else False

    # Right: Live Demonstration Steps
    add_card(slide13, Inches(7.5), Inches(1.5), Inches(5.0), Inches(5.2), title="Live Demonstration Plan for Reviewers")
    tb13_right = slide13.shapes.add_textbox(Inches(7.7), Inches(2.1), Inches(4.6), Inches(4.4))
    tf13_right = tb13_right.text_frame
    tf13_right.word_wrap = True

    demo_steps = [
        ("Step 1: Website Entry & Welcome Modal", "Show live popup at http://localhost:5173/ prompting permission test with privacy guarantee."),
        ("Step 2: Live Sound Meter Demonstration", "Demonstrate speaking or clapping near laptop mic; show real-time decibel needle & waveform reaction."),
        ("Step 3: Interactive KEC Map Navigation", "Click on CD Memorial Central Library; inspect live decibel score and click 'Navigate' to open Google Maps."),
        ("Step 4: Dynamic Category Filtering", "Filter spots by 'Quiet (<45 dB)' to isolate optimal study areas instantly."),
        ("Step 5: Algo Lab Runtime Benchmark", "Run Quadtree vs Linear search live on 1,000 points; showcase ~3x speedup and 100% Equality Match verification."),
        ("Step 6: Automated Test Suite Execution", "Execute 'pytest -v' and 'npm test' live to show 28 passed tests with zero failures.")
    ]
    for s_title, s_desc in demo_steps:
        p = tf13_right.add_paragraph()
        p.text = f"• {s_title}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = KEC_GREEN_DARK
        p2 = tf13_right.add_paragraph()
        p2.text = f"  {s_desc}"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 14: Conclusion & Future Enhancements
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_header(slide14, "14. Conclusion & Future Enhancements", "CONCLUSION & ACKNOWLEDGEMENTS")

    add_card(slide14, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.2), title="Review 2 Achievements")
    tb14_left = slide14.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.3), Inches(4.4))
    tf14_left = tb14_left.text_frame
    tf14_left.word_wrap = True

    achievements = [
        ("Exceeded 70% Milestone:", "QuietSpot has achieved over 85% full-stack completion with running frontend and backend servers."),
        ("Custom Academic Rigor:", "Successfully implemented custom 2D Spatial Quadtree, Custom Hash Map, and Min-Heap without external algorithmic libraries."),
        ("Authentic Campus Ground-Truth:", "Mapped real OpenStreetMap features for Kongu Engineering College with zero fabricated metrics or fake noise telemetry."),
        ("Privacy By Architecture:", "Proven client-side Web Audio RMS pipeline guaranteeing zero audio storage and zero eavesdropping."),
        ("Full Test Coverage:", "21 backend pytest cases and 7 frontend vitest cases passing with 100% success rate.")
    ]
    for head, body in achievements:
        p = tf14_left.add_paragraph()
        p.text = f"✔ {head} "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = KEC_GREEN_DARK
        p2 = tf14_left.add_paragraph()
        p2.text = f"  {body}"
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_DARK

    add_card(slide14, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), title="Future Work & Acknowledgements")
    tb14_right = slide14.shapes.add_textbox(Inches(7.0), Inches(2.1), Inches(5.3), Inches(4.4))
    tf14_right = tb14_right.text_frame
    tf14_right.word_wrap = True

    future_work = [
        ("Phase 3 Planned Enhancements:", 
         "• Integration of fixed solar-powered low-power ESP32 IoT acoustic beacons for 24/7 library lawn coverage.\n• Machine Learning LSTM predictive model to forecast quiet hours based on historical timetable schedules.\n• Multi-floor 3D indoor elevation support for the multi-storey CD Memorial Library."),
        ("Acknowledgements:", 
         "We express our sincere gratitude to our Project Guide, the Head of the Department, and the faculty members of the Department of Computer Science and Engineering, Kongu Engineering College, for their constant guidance and encouragement throughout this project."),
        ("Q & A Session:", 
         "Thank you! We are now open for evaluation questions and suggestions from the review committee.")
    ]
    for head, body in future_work:
        p = tf14_right.add_paragraph()
        p.text = head
        p.font.bold = True
        p.font.size = Pt(11.5)
        p.font.color.rgb = KEC_GOLD if "Q & A" in head else KEC_GREEN_DARK
        p2 = tf14_right.add_paragraph()
        p2.text = body
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_DARK

    # Save presentation
    output_path = os.path.abspath("QuietSpot_2.0_Review_2_Presentation.pptx")
    prs.save(output_path)
    print(f"Successfully generated PowerPoint presentation at: {output_path}")

if __name__ == "__main__":
    create_presentation()
