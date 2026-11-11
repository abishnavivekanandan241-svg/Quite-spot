import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Volume2, MapPin, Compass, Activity, Cpu, Settings, LogIn } from "lucide-react";
import { KEC_CAMPUS } from "../../utils/constants";

export function Navbar({ isMonitoring }) {
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Activity },
    { to: "/map", label: "Campus Map", icon: MapPin },
    { to: "/quiet-spots", label: "Quiet Spots", icon: Compass },
    { to: "/monitoring", label: "Live Monitor", icon: Volume2 },
    { to: "/benchmark", label: "Algo Lab", icon: Cpu },
  ];

  return (
    <header style={{
      height: "var(--header-height)",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid var(--border-light)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
    }}>
      {/* Brand & Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          backgroundColor: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)"
        }}>
          <Volume2 size={22} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Quiet<span style={{ color: "var(--color-primary)" }}>Spot</span>
            </span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, lineHeight: 1 }}>
            Kongu Engineering College
          </div>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }} className="desktop-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
                backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                transition: "all 0.15s ease",
                textDecoration: "none"
              }}
            >
              <Icon size={16} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Header Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMonitoring && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            backgroundColor: "var(--color-primary-light)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-primary-border)",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "var(--color-primary)",
          }}>
            <span className="live-pulse" />
            <span>MIC ACTIVE</span>
          </div>
        )}

        <Link
          to="/settings"
          title="Settings & Privacy"
          style={{
            padding: "8px",
            borderRadius: "50%",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={20} />
        </Link>

        <Link
          to="/auth"
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex" }}
        >
          <LogIn size={15} />
          <span>Account</span>
        </Link>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
