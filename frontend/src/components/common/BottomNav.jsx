import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, MapPin, Compass, Volume2, Cpu } from "lucide-react";

export function BottomNav({ isMonitoring }) {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: Activity },
    { to: "/map", label: "Map", icon: MapPin },
    { to: "/quiet-spots", label: "Spots", icon: Compass },
    { to: "/monitoring", label: "Monitor", icon: Volume2, hasBadge: isMonitoring },
    { to: "/benchmark", label: "Algo Lab", icon: Cpu },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.hasBadge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary)",
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottom-nav-height);
          background-color: #ffffff;
          border-top: 1px solid var(--border-light);
          z-index: 1000;
          justify-content: space-around;
          align-items: center;
          padding: 0 4px;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex: 1;
          height: 100%;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .bottom-nav-item.active {
          color: var(--color-primary);
        }

        @media (max-width: 840px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
