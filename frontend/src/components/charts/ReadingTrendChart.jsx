import React from "react";
import { formatIntensity, formatRelativeTime } from "../../utils/formatters";

export function ReadingTrendChart({ readings = [], height = 180 }) {
  if (!readings || readings.length === 0) {
    return (
      <div style={{
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
        backgroundColor: "var(--bg-page)",
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--border-light)"
      }}>
        No historical readings available for this spot yet.
      </div>
    );
  }

  // Chronological order (oldest to newest)
  const sorted = [...readings].reverse();
  const values = sorted.map((r) => r.relative_intensity);
  const minVal = Math.min(...values, 20);
  const maxVal = Math.max(...values, 85);
  const range = maxVal - minVal || 1;

  const width = 500;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Build SVG path points
  const points = sorted.map((r, i) => {
    const x = padding + (i / Math.max(1, sorted.length - 1)) * chartWidth;
    const y = height - padding - ((r.relative_intensity - minVal) / range) * chartHeight;
    return { x, y, ...r };
  });

  const pathData = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  // Area under path
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: `${height}px`, overflow: "visible" }}
      >
        {/* Horizontal Threshold Guideline: Quiet threshold (45 dB) */}
        {minVal <= 45 && maxVal >= 45 && (
          <g>
            <line
              x1={padding}
              y1={height - padding - ((45 - minVal) / range) * chartHeight}
              x2={width - padding}
              y2={height - padding - ((45 - minVal) / range) * chartHeight}
              stroke="#16a34a"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.4"
            />
            <text
              x={width - padding + 4}
              y={height - padding - ((45 - minVal) / range) * chartHeight + 4}
              fontSize="9"
              fill="#16a34a"
            >
              Quiet 45
            </text>
          </g>
        )}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#trendGradient)" />
        <path d={pathData} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill="#ffffff"
            stroke="#16a34a"
            strokeWidth="2"
          >
            <title>{`${formatIntensity(pt.relative_intensity)} (${formatRelativeTime(pt.measured_at)})`}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
        <span>Earlier</span>
        <span>Latest Observation</span>
      </div>
    </div>
  );
}
