import React, { useState, useEffect } from "react";
import { ShieldCheck, MapPin, Volume2, Database, Info, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { KEC_CAMPUS } from "../utils/constants";

export function SettingsPage({
  isMonitoring,
  isPaused,
  permissionStatus,
  isContributing,
  setIsContributing,
  stopMonitoring,
  userCoordinates,
}) {
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then(setBackendHealth)
      .catch(() => setBackendHealth({ status: "disconnected" }));
  }, []);

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
      {/* Title */}
      <div>
        <h1 className="page-title">Privacy & System Settings</h1>
        <p className="page-subtitle">Inspect permission states, privacy disclosures, and KEC campus boundaries</p>
      </div>

      {/* Privacy Architecture Disclosure Card */}
      <div className="card" style={{ padding: "24px", borderLeft: "4px solid var(--color-primary)" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <ShieldCheck size={20} color="var(--color-primary)" />
          <span>Acoustic Privacy & Data Governance Model</span>
        </h2>
        <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "10px" }}>
          <p>
            QuietSpot 2.0 strictly honors student privacy. When live monitoring is granted:
          </p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><strong>Zero Audio Storage:</strong> No audio files, WAV, MP3, or voice recordings are ever created or saved.</li>
            <li><strong>Volatile In-Memory Processing:</strong> Sound pressure waveforms are converted to Root-Mean-Square (RMS) amplitude inside a browser-isolated <code>AudioContext</code> and immediately purged.</li>
            <li><strong>Consented Derived Telemetry:</strong> Only anonymous relative decibel values (e.g. 34.2 rel. dB) are transmitted to the backend when contribution is explicitly enabled.</li>
            <li><strong>Hardened Backend Rejection:</strong> The Python Flask API rejects any payload containing raw audio fields (e.g., <code>pcm_data</code>, <code>audio_bytes</code>) with HTTP 400.</li>
          </ul>
        </div>
      </div>

      {/* Permissions & Hardware State */}
      <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Device Permissions Status</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {/* Mic */}
          <div style={{ padding: "14px", backgroundColor: "var(--bg-page)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "0.9rem" }}>
              <Volume2 size={16} color="var(--color-primary)" />
              <span>Microphone Access</span>
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Permission: <strong>{permissionStatus}</strong> &bull; Monitoring: <strong>{isMonitoring ? "Active" : "Off"}</strong>
            </div>
            {isMonitoring && (
              <button onClick={stopMonitoring} className="btn btn-danger btn-sm" style={{ marginTop: "10px" }}>
                Stop & Revoke Stream
              </button>
            )}
          </div>

          {/* Geo */}
          <div style={{ padding: "14px", backgroundColor: "var(--bg-page)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "0.9rem" }}>
              <MapPin size={16} color="var(--color-primary)" />
              <span>Geolocation Access</span>
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {userCoordinates ? `Active (${userCoordinates.latitude.toFixed(4)}, ${userCoordinates.longitude.toFixed(4)})` : "Defaulting to KEC Campus Center"}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Geospatial Boundary Specifications */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={18} color="var(--color-primary)" />
          <span>Kongu Engineering College Geographic Scope</span>
        </h3>
        <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div><strong>Institution:</strong> {KEC_CAMPUS.name}</div>
          <div><strong>Campus Center:</strong> Latitude {KEC_CAMPUS.center.lat}° N, Longitude {KEC_CAMPUS.center.lon}° E</div>
          <div><strong>Geospatial Bounds:</strong> Lat [{KEC_CAMPUS.bounds.minLat}, {KEC_CAMPUS.bounds.maxLat}], Lon [{KEC_CAMPUS.bounds.minLon}, {KEC_CAMPUS.bounds.maxLon}]</div>
          <div><strong>Backend API Status:</strong> {backendHealth?.status === "healthy" ? <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>Connected (v{backendHealth.version})</span> : <span style={{ color: "#dc2626" }}>Offline / Degraded</span>}</div>
        </div>
      </div>
    </div>
  );
}
