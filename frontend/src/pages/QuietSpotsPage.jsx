import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { LocationCard } from "../components/cards/LocationCard";
import { Search, RefreshCw, Compass } from "lucide-react";
import { KEC_CAMPUS } from "../utils/constants";

export function QuietSpotsPage({ userCoordinates }) {
  const [locations, setLocations] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadSpots = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLocations({
        category: activeFilter,
        search: searchQuery,
      });
      setLocations(res.locations || []);
    } catch (err) {
      console.error("Failed to load quiet spots:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSpots();
  }, [activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadSpots();
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.74rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              backgroundColor: "var(--color-primary-light)",
              padding: "3px 9px",
              borderRadius: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}>
              Kongu Engineering College &bull; Real Campus Architecture
            </span>
          </div>
          <h1 className="page-title">Verified Quiet Spots</h1>
          <p className="page-subtitle">Acoustically surveyed study areas, reading lounges, and academic departments across KEC campus</p>
        </div>

        <button onClick={loadSpots} className="btn btn-secondary btn-sm" disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? "spinner" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "420px", display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by building or room name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div className="filter-bar">
          {[
            { id: "all", label: "All Spots" },
            { id: "Quiet", label: "Quiet (< 45 dB)" },
            { id: "Moderate", label: "Moderate (45-65 dB)" },
            { id: "Noisy", label: "Noisy (> 65 dB)" },
            { id: "Unknown", label: "Unknown / Stale" },
          ].map((item) => (
            <button
              key={item.id}
              className={`filter-pill ${activeFilter.toLowerCase() === item.id.toLowerCase() ? "active" : ""}`}
              onClick={() => setActiveFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      {isLoading ? (
        <div className="state-container">
          <div className="spinner" style={{ marginBottom: "16px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Querying campus database...</p>
        </div>
      ) : locations.length > 0 ? (
        <div className="grid-cards">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <div className="state-container">
          <Compass size={36} color="var(--text-muted)" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>No campus locations match your filter</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px" }}>
            Try selecting "All Spots" or searching for a different keyword.
          </p>
          <button
            onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: "16px" }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
