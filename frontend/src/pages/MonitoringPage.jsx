import React, { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2, ShieldCheck, CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react";
import { LiveAudioVisualizer } from "../components/monitoring/LiveAudioVisualizer";
import { api } from "../services/api";
import { formatRelativeTime } from "../utils/formatters";

export function MonitoringPage({
  isMonitoring,
  isPaused,
  permissionStatus,
  metrics,
  isContributing,
  setIsContributing,
  lastSubmissionStatus,
  lastSubmittedTime,
  error,
  startMonitoring,
  pauseMonitoring,
  resumeMonitoring,
  stopMonitoring,
  selectedLocationId,
  setSelectedLocationId,
}) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.getLocations().then((res) => {
      setLocations(res.locations || []);
      if (res.locations && res.locations.length > 0 && !selectedLocationId && setSelectedLocationId) {
        setSelectedLocationId(res.locations[0].id);
      }
    }).catch(console.error);
  }, [selectedLocationId, setSelectedLocationId]);

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
      {/* Title */}
      <div>
        <h1 className="page-title">Live Noise Monitoring Studio</h1>
        <p className="page-subtitle">Analyze ambient study noise in real time using local, in-browser Web Audio processing</p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px",
        backgroundColor: "var(--color-primary-light)",
        border: "1px solid var(--color-primary-border)",
        borderRadius: "var(--radius-lg)",
      }}>
        <ShieldCheck size={22} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "0.85rem", color: "var(--color-primary-dark)", lineHeight: 1.5 }}>
          <strong>Zero Audio Recording Guarantee:</strong> Sound intensity is computed locally on your device via 
          the W3C Web Audio API. Audio buffers are discarded from memory immediately after computing RMS amplitude. 
          No raw voice, audio file, or audio bytes ever leave your browser.
        </div>
      </div>

      {/* Error alert if mic was denied */}
      {error && (
        <div style={{
          padding: "16px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "var(--radius-md)",
          color: "#b91c1c",
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Central Studio Card */}
      <div className="card" style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        {/* Status Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isMonitoring && !isPaused ? (
            <span className="live-pulse" />
          ) : (
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--text-muted)" }} />
          )}
          <span style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: isMonitoring && !isPaused ? "var(--color-primary)" : "var(--text-secondary)",
            textTransform: "uppercase"
          }}>
            Status: {isMonitoring ? (isPaused ? "Paused" : "Live Monitoring Active") : "Sensor Inactive (Off)"}
          </span>
        </div>

        {/* Live Audio Visualizer Gauge & Bars */}
        <LiveAudioVisualizer
          metrics={metrics}
          isMonitoring={isMonitoring}
          isPaused={isPaused}
        />

        {/* Location Association Selector */}
        <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            Current Campus Spot (for Telemetry Association):
          </label>
          <select
            className="form-input"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.location_type})
              </option>
            ))}
          </select>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Readings you contribute will be mapped to this campus location.
          </span>
        </div>

        {/* Controls: Start, Pause, Stop */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {!isMonitoring ? (
            <button onClick={startMonitoring} className="btn btn-primary btn-lg" style={{ minWidth: "180px" }}>
              <Play size={18} fill="currentColor" />
              <span>Start Monitoring</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button onClick={resumeMonitoring} className="btn btn-primary">
                  <Play size={16} fill="currentColor" />
                  <span>Resume</span>
                </button>
              ) : (
                <button onClick={pauseMonitoring} className="btn btn-secondary">
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              )}
              <button onClick={stopMonitoring} className="btn btn-danger">
                <Square size={16} fill="currentColor" />
                <span>Stop Monitoring</span>
              </button>
            </>
          )}
        </div>

        {/* Contribution Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "420px",
          padding: "14px",
          backgroundColor: "var(--bg-page)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)"
        }}>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Contribute Derived Readings
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
              Sends anonymous relative dB metrics every 8 seconds
            </div>
          </div>
          <input
            type="checkbox"
            checked={isContributing}
            onChange={(e) => setIsContributing(e.target.checked)}
            style={{ width: "20px", height: "20px", accentColor: "var(--color-primary)", cursor: "pointer" }}
          />
        </div>

        {/* Transmission Status Feedback */}
        {isContributing && isMonitoring && (
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
            {lastSubmissionStatus === "submitting" && (
              <>
                <RefreshCw size={14} className="spinner" />
                <span>Transmitting derived decibel reading to campus server...</span>
              </>
            )}
            {lastSubmissionStatus === "success" && (
              <>
                <CheckCircle2 size={15} color="var(--color-primary)" />
                <span>Observation recorded {lastSubmittedTime ? `(${formatRelativeTime(lastSubmittedTime.toISOString())})` : ""}</span>
              </>
            )}
            {lastSubmissionStatus === "error" && (
              <>
                <AlertCircle size={15} color="#dc2626" />
                <span>Submission paused (server offline or out of bounds)</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
