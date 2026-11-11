import React from "react";
import { Link } from "react-router-dom";
import { Volume2, MapPin, Compass, ShieldCheck, ArrowRight, Activity, Cpu } from "lucide-react";
import { KEC_CAMPUS } from "../utils/constants";

export function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px", paddingBottom: "60px" }}>
      {/* Hero Section */}
      <section style={{
        padding: "60px 20px 40px",
        textAlign: "center",
        maxWidth: "880px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          backgroundColor: "var(--color-primary-light)",
          border: "1px solid var(--color-primary-border)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          marginBottom: "20px"
        }}>
          <span>Kongu Engineering College Official Campus Edition</span>
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: "18px"
        }}>
          Find Your Perfect <span style={{ color: "var(--color-primary)" }}>Study Spot</span>
        </h1>

        <p style={{
          fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          maxWidth: "680px",
          margin: "0 auto 32px"
        }}>
          Real-time, student-powered noise intelligence across Kongu Engineering College. 
          Discover quiet reading zones, monitor your local study environment, and navigate campus with custom spatial algorithms.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          flexWrap: "wrap"
        }}>
          <Link to="/map" className="btn btn-primary btn-lg">
            <span>Explore Campus Map</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/monitoring" className="btn btn-secondary btn-lg">
            <Volume2 size={18} />
            <span>Start Live Monitoring</span>
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="page-container">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Engineered for Campus Focus
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "6px" }}>
            Combining Web Audio API privacy standards with 2D Spatial Quadtree indexing.
          </p>
        </div>

        <div className="grid-cards">
          {/* Card 1 */}
          <div className="card" style={{ padding: "26px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px" }}>
              Verified KEC Locations
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              From the CD Memorial Central Library to academic reading halls, every spot is mapped with authentic geographic coordinates and OpenStreetMap survey data.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding: "26px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px" }}>
              100% Privacy Guarantee
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Microphone data is processed locally in memory using the Web Audio API. Raw audio is never recorded, persisted, or uploaded to any server.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding: "26px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px" }}>
              Custom Spatial Quadtree
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Built from scratch in Python to deliver O(log N) radius candidate filtering, ranked with a custom binary Min-Heap priority queue.
            </p>
          </div>
        </div>
      </section>

      {/* College Info Banner */}
      <section className="page-container">
        <div className="card" style={{
          backgroundColor: "#14532d",
          color: "#ffffff",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#86efac", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Campus Focus
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            {KEC_CAMPUS.name}
          </h2>
          <p style={{ maxWidth: "600px", color: "#dcfce7", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {KEC_CAMPUS.location}. Supporting over 8,000 students across 14 departments in finding conducive quiet study environments.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
            <Link to="/quiet-spots" className="btn btn-primary" style={{ backgroundColor: "#22c55e", color: "#052e16" }}>
              <span>View All Quiet Spots</span>
              <Compass size={16} />
            </Link>
            <a
              href={KEC_CAMPUS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              <span>Visit Official College Website</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
