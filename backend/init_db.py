import os
import sys
from datetime import datetime, timezone, timedelta
from app.config import Config
from app.models.schema import init_database, get_db_connection

VERIFIED_KEC_LOCATIONS = [
    {
        "id": "kec_cd_lib",
        "name": "CD Memorial Central Library",
        "latitude": 11.2709624,
        "longitude": 77.6052846,
        "location_type": "Library",
        "description": "Multi-storey central institutional library spanning 3,286 sqm with RFID automation, dedicated quiet study zones, and digital reference sections.",
        "image_url": "/images/locations/kec_cd_lib.jpg",
        "is_active": 1,
        "data_source": "verified_osm_node_10274963803"
    },
    {
        "id": "kec_it_block",
        "name": "IT Block Study Lounge",
        "latitude": 11.2733941,
        "longitude": 77.6069042,
        "location_type": "Academic",
        "description": "Department of Computer Science & Information Technology building with shaded second-floor open reading balcony.",
        "image_url": "/images/locations/kec_it_block.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123574694"
    },
    {
        "id": "kec_admin_hall",
        "name": "Admin Block Reading Hall",
        "latitude": 11.2742925,
        "longitude": 77.6070544,
        "location_type": "Study Area",
        "description": "Central administrative quadrant with silent reading lobby and conference archives.",
        "image_url": "/images/locations/kec_admin_hall.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123574703"
    },
    {
        "id": "kec_food_court",
        "name": "KEC Food Court",
        "latitude": 11.2726352,
        "longitude": 77.6067879,
        "location_type": "Cafeteria",
        "description": "Central campus student dining area and refreshment counters. Generally energetic with active ambient discussion.",
        "image_url": "/images/locations/kec_food_court.webp",
        "is_active": 1,
        "data_source": "verified_osm_node_10274963802"
    },
    {
        "id": "kec_auditorium",
        "name": "Maharaja Auditorium Foyer",
        "latitude": 11.2723664,
        "longitude": 77.6059717,
        "location_type": "Auditorium",
        "description": "Grand auditorium campus pavilion. Very quiet during morning study hours when no scheduled events occur.",
        "image_url": "/images/locations/kec_auditorium.jpg",
        "is_active": 1,
        "data_source": "verified_osm_way_1530886780"
    },
    {
        "id": "kec_convention_ctr",
        "name": "Kongu Convention Centre Quiet Room",
        "latitude": 11.2728869,
        "longitude": 77.6021706,
        "location_type": "Convention",
        "description": "West campus convention complex with dedicated academic seminar lounges.",
        "image_url": "/images/locations/kec_convention_ctr.webp",
        "is_active": 1,
        "data_source": "verified_osm_node_10274963804"
    },
    {
        "id": "kec_sh_block",
        "name": "Science & Humanities Courtyard",
        "latitude": 11.2748780,
        "longitude": 77.6077892,
        "location_type": "Academic",
        "description": "North green quadrangle with tree-lined benches, popular for early morning and evening revision.",
        "image_url": "/images/locations/kec_sh_block.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123574705"
    },
    {
        "id": "kec_ece_block",
        "name": "ECE Department Seminar Hall",
        "latitude": 11.2722079,
        "longitude": 77.6054201,
        "location_type": "Academic",
        "description": "Electronics and Communication Engineering wing study alcove.",
        "image_url": "/images/locations/kec_ece_block.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123574690"
    },
    {
        "id": "kec_mech_block",
        "name": "Mechanical & Mechatronics Quad",
        "latitude": 11.2702987,
        "longitude": 77.6038013,
        "location_type": "Academic",
        "description": "South-west engineering wing. Adjacent workshops can have moderate machinery hum during laboratory sessions.",
        "image_url": "/images/locations/kec_mech_block.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123578458"
    },
    {
        "id": "kec_singles_canteen",
        "name": "Single's Canteen Courtyard",
        "latitude": 11.2711840,
        "longitude": 77.6062068,
        "location_type": "Cafeteria",
        "description": "Outdoor snack hub with frequent student footfall.",
        "image_url": "/images/locations/kec_singles_canteen.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123671490"
    },
    {
        "id": "kec_hostel_dheeran",
        "name": "Dheeran Hostel Study Hall",
        "latitude": 11.2713300,
        "longitude": 77.6066915,
        "location_type": "Hostel",
        "description": "Residential campus study hall dedicated to quiet self-study for hostel residents.",
        "image_url": "/images/locations/kec_hostel_dheeran.webp",
        "is_active": 1,
        "data_source": "verified_osm_way_1123671489"
    },
    {
        "id": "kec_bus_stand",
        "name": "KEC Bus Stand & Main Gate",
        "latitude": 11.2734046,
        "longitude": 77.6082552,
        "location_type": "Transit",
        "description": "Transit terminal and campus entrance along Perundurai road. High traffic and vehicle noise during peak commute.",
        "image_url": "/images/locations/kec_bus_stand.webp",
        "is_active": 1,
        "data_source": "verified_osm_node_1395258627"
    }
]


def seed_database(db_path: str = Config.DATABASE_PATH):
    print(f"Initializing database at: {db_path}")
    init_database(db_path)
    conn = get_db_connection(db_path)
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    try:
        # Seed verified campus locations with authentic KEC coordinates and real images
        for loc in VERIFIED_KEC_LOCATIONS:
            conn.execute(
                """
                INSERT OR REPLACE INTO campus_locations 
                (id, name, latitude, longitude, location_type, description, image_url, is_active, data_source, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    loc["id"], loc["name"], loc["latitude"], loc["longitude"],
                    loc["location_type"], loc["description"], loc["image_url"],
                    loc["is_active"], loc["data_source"], now_iso, now_iso
                )
            )

        conn.commit()
        print(f"Successfully seeded {len(VERIFIED_KEC_LOCATIONS)} verified KEC locations with 0 mock readings.")
        print("Pure live-telemetry mode enabled: spots will only show noise readings when real users contribute.")
    finally:
        conn.close()


if __name__ == "__main__":
    seed_database()
