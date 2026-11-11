import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Volume2, MapPin, Compass, ArrowUpRight, Activity, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import { CampusMap } from "../components/map/CampusMap";
import { LocationCard } from "../components/cards/LocationCard";
import { KEC_CAMPUS, getCategoryMeta } from "../utils/constants";
import { formatIntensity, formatRelativeTime } from "../utils/formatters";

export function DashboardPage({ isMonitoring, startMonitoring, stopMonitoring, userCoordinates }) {
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [locRes, statsRes, recRes] = await Promise.all([
        api.getLocations(),
        api.getDashboardStats().catch(() => ({ stats: null })),
        api.getRecommendations({
          lat: userCoordinates?.latitude || KEC_CAMPUS.center.lat,
          lon: userCoordinates?.longitude || KEC_CAMPUS.center.lon,
          limit: 3,
        }).catch(() => ({ recommendations: [] })),
      ]);

      setLocations(locRes.locations || []);
      setStats(statsRes.stats);
      setRecommendations(recRes.recommendations || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("Unable to connect to QuietSpot API. Ensure Flask backend is running on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userCoordinates]);

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Campus Dashboard</h1>
          <p className="page-subtitle">Real-time noise mapping and study spot intelligence for Kongu Engineering College</p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="btn btn-secondary btn-sm"
          title="Refresh campus telemetry"
        >
          <RefreshCw size={14} className={isLoading ? "spinner" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error state if backend offline */}
      {error && (
        <div style={{
          padding: "16px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "var(--radius-md)",
          color: "#b91c1c",
          fontSize: "0.9rem"
        }}>
          <strong>Connection Alert:</strong> {error}
        </div>
      )}

      {/* Authentic Calculated Metric Cards (Zero Fabricated Metrics) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px"
      }}>
        {/* Metric 1 */}
        <div className="card">
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            VERIFIED CAMPUS SPOTS
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
            {stats ? stats.total_verified_locations : locations.length || "--"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Mapped via OpenStreetMap surveys
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card">
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            SPOTS WITH FRESH READINGS
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)", marginTop: "4px" }}>
            {stats ? stats.locations_with_fresh_readings : "--"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Observed within the last 120 minutes
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card">
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            CURRENT QUIET ZONES
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-quiet)", marginTop: "4px" }}>
            {stats ? stats.category_distribution?.quiet : "--"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Confirmed &lt; 45 dB relative intensity
          </div>
        </div>

        {/* Metric 4: Monitoring State Card */}
        <div className="card" style={{
          backgroundColor: isMonitoring ? "var(--color-primary-light)" : "var(--bg-card)",
          borderColor: isMonitoring ? "var(--color-primary-border)" : "var(--border-light)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              DEVICE MONITORING
            </span>
            {isMonitoring && <span className="live-pulse" />}
          </div>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: isMonitoring ? "var(--color-primary)" : "var(--text-secondary)",
            marginTop: "6px"
          }}>
            {isMonitoring ? "Active (Observing)" : "Disabled (Off)"}
          </div>
          <div style={{ marginTop: "8px" }}>
            <Link to="/monitoring" className="btn btn-outline btn-sm">
              <Volume2 size={14} />
              <span>{isMonitoring ? "Manage Sensor" : "Start Monitoring"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Quick Quiet Recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }} className="dashboard-grid">
        {/* Left Column: Campus Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Live Campus Sound Map
            </h2>
            <Link to="/map" style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Expand Map</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <CampusMap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            userCoordinates={userCoordinates}
            height="460px"
          />
        </div>

        {/* Right Column: Top Recommended Quiet Spots */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Top Quiet Recommendations
            </h2>
            <Link to="/quiet-spots" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div key={rec.location.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <LocationCard
                  location={rec.location}
                  distanceMeters={rec.score_details?.distance_meters}
                />
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--color-primary)",
                  backgroundColor: "var(--color-primary-light)",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  marginTop: "-4px"
                }}>
                  Rank #{index + 1} &bull; {rec.score_details?.reasons?.[0] || "High suitability score"}
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)" }}>
              {isLoading ? "Analyzing campus Quadtree..." : "No recommendations returned yet."}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
