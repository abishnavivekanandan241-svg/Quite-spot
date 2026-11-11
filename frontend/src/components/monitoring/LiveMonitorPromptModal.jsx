import React, { useState, useEffect } from "react";
import { Volume2, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles, MapPin } from "lucide-react";
import { api } from "../../services/api";

export function LiveMonitorPromptModal({
  isMonitoring,
  permissionStatus,
  error,
  startMonitoring,
  selectedLocationId,
  setSelectedLocationId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Check if user has already made a choice this session
    const alreadyAnswered = sessionStorage.getItem("qs_monitor_prompt_answered");
    if (!alreadyAnswered && !isMonitoring) {
      // Gentle 700ms delay so the initial page renders cleanly before showing the prompt
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isMonitoring]);

  useEffect(() => {
    // Load campus locations for spot assignment
    api.getLocations().then((res) => {
      setLocations(res.locations || []);
      if (res.locations && res.locations.length > 0 && !selectedLocationId && setSelectedLocationId) {
        setSelectedLocationId(res.locations[0].id);
      }
    }).catch(() => {});
  }, [selectedLocationId, setSelectedLocationId]);

  // When monitoring becomes active while modal is open, show success and auto-close
  useEffect(() => {
    if (isMonitoring && isOpen) {
      setSuccess(true);
      sessionStorage.setItem("qs_monitor_prompt_answered", "granted");
      const closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, 1600);
      return () => clearTimeout(closeTimer);
    }
  }, [isMonitoring, isOpen]);

  const handleAllowClick = async () => {
    setIsSubmitting(true);
    try {
      await startMonitoring();
    } catch (err) {
      console.warn("Permission denied or cancelled:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("qs_monitor_prompt_answered", "dismissed");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(4px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      animation: "fadeIn 0.2s ease-out",
    }}>
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "28px",
          position: "relative",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
          borderRadius: "var(--radius-xl)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          title="Dismiss"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
            transition: "background 0.15s ease",
          }}
        >
          <X size={18} />
        </button>

        {success ? (
          /* Success State */
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Live Monitoring Activated!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "8px", lineHeight: 1.5 }}>
              Your device is now locally estimating ambient sound intensity for Kongu Engineering College. 
              Thank you for contributing to campus quiet intelligence!
            </p>
          </div>
        ) : (
          /* Prompt State */
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Header Icon + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                backgroundColor: "var(--color-primary-light)",
                border: "1px solid var(--color-primary-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
                flexShrink: 0
              }}>
                <Volume2 size={28} />
              </div>

              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}>
                  <Sparkles size={12} />
                  <span>Interactive Campus Test</span>
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  Enable Live Noise Monitor?
                </h2>
              </div>
            </div>

            {/* Explanation */}
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              QuietSpot uses your device's microphone to locally measure environmental sound intensity, 
              helping students identify quiet study spots across <strong>Kongu Engineering College</strong> in real time.
            </p>

            {/* Privacy Guarantee Box */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px 14px",
              backgroundColor: "var(--color-primary-light)",
              border: "1px solid var(--color-primary-border)",
              borderRadius: "var(--radius-md)",
            }}>
              <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.82rem", color: "var(--color-primary-dark)", lineHeight: 1.45 }}>
                <strong>Strict Privacy Guarantee:</strong> Audio samples are processed strictly in volatile device memory 
                via the Web Audio API. <strong>Zero voice or audio is ever recorded, saved, or uploaded.</strong>
              </div>
            </div>

            {/* Optional Campus Spot Selector */}
            {locations.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} color="var(--color-primary)" />
                  <span>Where are you studying right now?</span>
                </label>
                <select
                  className="form-input"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  style={{ fontSize: "0.88rem" }}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.location_type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Permission Denied / Error alert if user previously blocked */}
            {error && (
              <div style={{
                padding: "10px 12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-md)",
                color: "#b91c1c",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AlertCircle size={16} />
                <span>Microphone access was blocked. You can still browse the map and quiet spots freely!</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={handleAllowClick}
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", fontSize: "0.98rem", padding: "12px 20px" }}
              >
                <Volume2 size={18} />
                <span>{isSubmitting ? "Requesting Browser Permission..." : "Allow & Start Live Monitor"}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", color: "var(--text-secondary)", border: "none" }}
              >
                Explore Without Monitoring
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
