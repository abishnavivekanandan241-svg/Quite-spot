import React from "react";
import { getCategoryMeta } from "../../utils/constants";

export function LiveAudioVisualizer({ metrics, isMonitoring, isPaused }) {
  const intensity = metrics?.relativeIntensity || 0;
  const category = metrics?.category || "Quiet";
  const catMeta = getCategoryMeta(category);
  const freqData = metrics?.frequencyData || new Array(24).fill(0);

  // Gauge percentage (20 dB -> 0%, 100 dB -> 100%)
  const percentage = Math.min(100, Math.max(0, ((intensity - 20) / 80) * 100));

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      width: "100%",
    }}>
      {/* Central Circular Gauge / Decibel Readout */}
      <div style={{
        position: "relative",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle, #ffffff 60%, ${catMeta.bgColor} 100%)`,
        border: `4px solid ${isMonitoring && !isPaused ? catMeta.color : "var(--border-light)"}`,
        boxShadow: isMonitoring && !isPaused ? `0 0 24px ${catMeta.color}33` : "none",
        transition: "all 0.25s ease",
      }}>
        <div style={{
          fontSize: "3.2rem",
          fontWeight: 800,
          color: isMonitoring && !isPaused ? catMeta.textColor : "var(--text-muted)",
          lineHeight: 1,
          letterSpacing: "-0.03em"
        }}>
          {isMonitoring && !isPaused ? intensity.toFixed(1) : "--"}
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginTop: "4px" }}>
          rel. dB
        </div>
        <div style={{ marginTop: "8px" }}>
          <span className={`badge ${catMeta.badgeClass}`} style={{ fontSize: "0.78rem" }}>
            <span className="badge-dot" />
            <span>{isMonitoring && !isPaused ? category : "Offline"}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
          <span>Quiet (&lt; 45)</span>
          <span>Moderate (45-65)</span>
          <span>Noisy (&gt; 65)</span>
        </div>
        <div style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#e2e8f0",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: catMeta.color,
            transition: "width 0.1s linear, background-color 0.2s ease",
            borderRadius: "9999px"
          }} />
        </div>
      </div>

      {/* Frequency Spectrum Waveform Bars */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "4px",
        height: "64px",
        width: "100%",
        maxWidth: "380px",
        padding: "10px 14px",
        backgroundColor: "var(--bg-page)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-light)"
      }}>
        {freqData.slice(0, 24).map((val, idx) => {
          const heightPercent = isMonitoring && !isPaused ? Math.max(8, (val / 255) * 100) : 8;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${heightPercent}%`,
                backgroundColor: isMonitoring && !isPaused ? catMeta.color : "var(--border-medium)",
                borderRadius: "3px",
                transition: "height 0.08s ease",
                opacity: 0.85
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
