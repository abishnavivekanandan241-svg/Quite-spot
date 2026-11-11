import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { getCategoryMeta } from "../utils/constants";
import { formatIntensity, formatRelativeTime, getGoogleMapsNavigationUrl } from "../utils/formatters";
import { ReadingTrendChart } from "../components/charts/ReadingTrendChart";
import { Navigation, Clock, Shield, MapPin, MessageSquare, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [readings, setReadings] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("Accurate");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [locRes, readRes, fbRes] = await Promise.all([
        api.getLocationById(id),
        api.getLocationReadings(id, 30).catch(() => ({ readings: [] })),
        api.getLocationFeedback(id).catch(() => ({ feedback: [] })),
      ]);

      setLocation(locRes.location);
      setReadings(readRes.readings || []);
      setFeedbackList(fbRes.feedback || []);
    } catch (err) {
      setError(err.message || "Failed to load location details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackValue) return;

    try {
      await api.submitFeedback({
        location_id: id,
        feedback_value: feedbackValue,
        user_comment: userComment,
      });
      setFeedbackSuccess(true);
      setUserComment("");
      // Reload feedback
      const fbRes = await api.getLocationFeedback(id);
      setFeedbackList(fbRes.feedback || []);
      setTimeout(() => setFeedbackSuccess(false), 4000);
    } catch (err) {
      alert("Error saving feedback: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container state-container" style={{ minHeight: "400px" }}>
        <div className="spinner" style={{ marginBottom: "16px" }} />
        <p>Loading verified campus location details...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="page-container state-container" style={{ minHeight: "400px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#dc2626" }}>Location Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>{error || "The requested campus spot could not be located."}</p>
        <Link to="/quiet-spots" className="btn btn-primary" style={{ marginTop: "16px" }}>
          Back to Spots Directory
        </Link>
      </div>
    );
  }

  const catMeta = getCategoryMeta(location.current_noise_category);
  const latestReading = location.latest_reading;
  const navUrl = getGoogleMapsNavigationUrl(location.latitude, location.longitude, location.name);

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Back Link */}
      <div>
        <Link to="/quiet-spots" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Quiet Spots</span>
        </Link>
      </div>

      {/* Main Header Card with Real KEC Building Hero Image */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Real KEC Building Hero Banner */}
        <div style={{ position: "relative", width: "100%", height: "280px", overflow: "hidden", backgroundColor: "#0f172a" }}>
          <img
            src={location.image_url || "/images/locations/kec_admin_hall.webp"}
            alt={location.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/locations/kec_admin_hall.webp";
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.25) 50%, rgba(15, 23, 42, 0.55) 100%)",
            pointerEvents: "none"
          }} />

          {/* Floating Pill on Top Left */}
          <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "8px", alignItems: "center", zIndex: 2 }}>
            <span className={`badge ${catMeta.badgeClass}`} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              <span className="badge-dot" />
              <span>{catMeta.label}</span>
            </span>
            <span style={{
              fontSize: "0.75rem",
              color: "#ffffff",
              fontWeight: 700,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              padding: "4px 10px",
              borderRadius: "6px",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
              {location.location_type}
            </span>
          </div>

          {/* Floating Badge on Bottom Right */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            padding: "5px 12px",
            borderRadius: "6px",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            zIndex: 2
          }}>
            <MapPin size={14} color="var(--color-primary)" />
            <span>Kongu Engineering College Building</span>
          </div>
        </div>

        {/* Content Details */}
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {location.name}
              </h1>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", marginTop: "10px", maxWidth: "720px", lineHeight: 1.6 }}>
                {location.description || "Verified study facility located at Kongu Engineering College."}
              </p>
            </div>

            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Navigation size={18} />
              <span>Navigate in Google Maps</span>
            </a>
          </div>

        {/* Provenance and Coordinates Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-light)",
          fontSize: "0.82rem",
          color: "var(--text-secondary)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={15} color="var(--color-primary)" />
            <span>Coordinates: {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Shield size={15} color="var(--color-primary)" />
            <span>Data Provenance: {location.data_source}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={15} color="var(--color-primary)" />
            <span>Freshness Status: {location.freshness?.status || "Unknown"}</span>
          </div>
        </div>
        </div>
      </div>

      {/* Acoustic Insights & Historical Readings Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="detail-grid">
        {/* Left: Latest Reading Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px" }}>
            Latest Acoustic Observation
          </h2>

          {latestReading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                backgroundColor: catMeta.bgColor,
                border: `1px solid ${catMeta.borderColor}`,
                borderRadius: "var(--radius-md)"
              }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Estimated Sound Intensity</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: catMeta.textColor }}>
                    {formatIntensity(latestReading.relative_intensity)}
                  </div>
                </div>
                <span className={`badge ${catMeta.badgeClass}`} style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
                  {catMeta.label}
                </span>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div><strong>Measurement Timestamp:</strong> {new Date(latestReading.measured_at).toLocaleString()} ({formatRelativeTime(latestReading.measured_at)})</div>
                <div><strong>Measurement Method:</strong> {latestReading.measurement_method}</div>
                <div><strong>Data Source:</strong> {latestReading.data_source}</div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No client readings have been submitted for this location yet. Start monitoring nearby to contribute the first observation!
            </div>
          )}
        </div>

        {/* Right: Trend Chart */}
        <div className="card">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px" }}>
            Recent Noise Intensity Trend
          </h2>
          <ReadingTrendChart readings={readings} height={190} />
        </div>
      </div>

      {/* User Community Feedback */}
      <div className="card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <MessageSquare size={18} />
          <span>Student Feedback & Ground Truth Verification</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Quiet & Accurate", "Moderately Noisy", "Loud / Crowded", "Different from App"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="feedback"
                  value={opt}
                  checked={feedbackValue === opt}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <textarea
            className="form-input"
            rows="2"
            placeholder="Optional comment: e.g. Fans running, exam revision going on, AC quiet..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />

          <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
            <Send size={14} />
            <span>Submit Verification Feedback</span>
          </button>

          {feedbackSuccess && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Feedback persisted to database successfully. Thank you!</span>
            </div>
          )}
        </form>

        {/* Recent Feedback List */}
        <div>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            Recent Observations from Students:
          </h4>
          {feedbackList.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {feedbackList.slice(0, 5).map((fb) => (
                <div key={fb.id} style={{
                  padding: "10px 12px",
                  backgroundColor: "var(--bg-page)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  fontSize: "0.82rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                    <span>{fb.feedback_value}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{formatRelativeTime(fb.created_at)}</span>
                  </div>
                  {fb.user_comment && (
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                      "{fb.user_comment}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No feedback submitted yet for this study area.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
