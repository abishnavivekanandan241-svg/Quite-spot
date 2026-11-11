import React from "react";
import { Link } from "react-router-dom";
import { Navigation, Clock, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { getCategoryMeta } from "../../utils/constants";
import { formatRelativeTime, formatIntensity, formatDistance, getGoogleMapsNavigationUrl } from "../../utils/formatters";

export function LocationCard({ location, distanceMeters }) {
  const currentCategory = location.current_noise_category || "Unknown";
  const catMeta = getCategoryMeta(currentCategory);
  const latestReading = location.latest_reading;
  const freshness = location.freshness;

  const navUrl = getGoogleMapsNavigationUrl(
    location.latitude,
    location.longitude,
    location.name
  );

  return (
    <div className="card card-interactive" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
      {/* Real KEC Building Photo Banner */}
      <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden", backgroundColor: "#e2e8f0" }}>
        <img
          src={location.image_url || "/images/locations/kec_admin_hall.webp"}
          alt={location.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s ease"
          }}
          className="card-building-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/locations/kec_admin_hall.webp";
          }}
        />

        {/* Ambient Top & Bottom Gradients for readable badges */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0) 45%, rgba(15, 23, 42, 0.45) 100%)",
          pointerEvents: "none"
        }} />

        {/* Floating Category Badge & Location Type */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          right: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2
        }}>
          <span className={`badge ${catMeta.badgeClass}`} style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
            <span className="badge-dot" />
            <span>{catMeta.label}</span>
          </span>
          <span style={{
            fontSize: "0.72rem",
            color: "#ffffff",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            padding: "3px 9px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            {location.location_type}
          </span>
        </div>

        {/* Real KEC Building Badge on Bottom Right */}
        <div style={{
          position: "absolute",
          bottom: "8px",
          right: "10px",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "rgba(255, 255, 255, 0.95)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "3px 7px",
          borderRadius: "4px",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          <MapPin size={11} color="var(--color-primary)" />
          <span>Real KEC Building</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
        {/* Title & Description */}
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
            <Link to={`/locations/${location.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              {location.name}
            </Link>
          </h3>
          <p style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            marginTop: "6px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {location.description || "Verified study location inside Kongu Engineering College."}
          </p>
        </div>

      {/* Metrics Row: Decibels + Freshness + Distance */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
        padding: "10px 12px",
        backgroundColor: "var(--bg-page)",
        borderRadius: "var(--radius-md)",
        fontSize: "0.82rem",
      }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Noise Level</div>
          <div style={{ fontWeight: 700, color: catMeta.textColor }}>
            {latestReading ? formatIntensity(latestReading.relative_intensity) : "No readings"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Freshness</div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {freshness?.status || "Stale"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Distance</div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {distanceMeters !== undefined ? formatDistance(distanceMeters) : "--"}
          </div>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        <Clock size={13} />
        <span>
          {latestReading?.measured_at ? `Observed ${formatRelativeTime(latestReading.measured_at)}` : "No observations yet"}
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--border-light)" }}>
        <Link
          to={`/locations/${location.id}`}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, textDecoration: "none" }}
        >
          <span>View Details</span>
          <ChevronRight size={14} />
        </Link>

        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
          title="Open Google Maps Walking Route"
        >
          <Navigation size={14} />
          <span>Navigate</span>
        </a>
      </div>
      </div>
    </div>
  );
}
