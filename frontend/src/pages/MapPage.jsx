import React, { useState, useEffect } from "react";
import { Search, Filter, Navigation, Info, ExternalLink, X } from "lucide-react";
import { api } from "../services/api";
import { CampusMap } from "../components/map/CampusMap";
import { LocationCard } from "../components/cards/LocationCard";
import { NOISE_CATEGORIES, getCategoryMeta } from "../utils/constants";
import { getGoogleMapsNavigationUrl } from "../utils/formatters";

export function MapPage({ userCoordinates }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLocations({
        category: activeCategory,
        search: searchQuery,
      });
      setLocations(res.locations || []);
    } catch (err) {
      console.error("Error loading map spots:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Title & Search Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Interactive Campus Map</h1>
          <p className="page-subtitle">Real-time acoustic mapping across Kongu Engineering College</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "340px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search library, block, hall..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {["all", "Quiet", "Moderate", "Noisy", "Unknown"].map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${activeCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.toLowerCase())}
          >
            {cat === "all" ? "All Campus Spots" : cat}
          </button>
        ))}
      </div>

      {/* Main Map Viewport */}
      <div style={{ position: "relative" }}>
        <CampusMap
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          userCoordinates={userCoordinates}
          height="580px"
        />

        {/* Selected Location Bottom Overlay Card (if clicked on marker) */}
        {selectedLocation && (
          <div style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            maxWidth: "360px",
            width: "calc(100% - 48px)",
            zIndex: 600,
            animation: "slideUp 0.2s ease"
          }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setSelectedLocation(null)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                <X size={16} />
              </button>
              <LocationCard location={selectedLocation} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
