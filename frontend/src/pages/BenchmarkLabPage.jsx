import React, { useState } from "react";
import { Play, CheckCircle2, AlertTriangle, Cpu, Clock, Layers, HelpCircle, BarChart3 } from "lucide-react";
import { api } from "../services/api";

export function BenchmarkLabPage() {
  const [datasetSize, setDatasetSize] = useState(2500);
  const [searchRadiusKm, setSearchRadiusKm] = useState(0.5);
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await api.runBenchmark({
        dataset_size: Number(datasetSize),
        search_radius_km: Number(searchRadiusKm),
      });
      setBenchmarkResult(res.benchmark);
    } catch (err) {
      console.error("Benchmark error:", err);
      setError(err.message || "Benchmark failed to run");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "900px" }}>
      {/* Title */}
      <div>
        <h1 className="page-title">Algorithm Performance Lab</h1>
        <p className="page-subtitle">
          Side-by-side empirical performance evaluation: Custom 2D Spatial Quadtree vs Linear Scan
        </p>
      </div>

      {/* Control Card */}
      <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
          <Cpu size={20} color="var(--color-primary)" />
          <span>Benchmark Configuration</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Dataset Size Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Synthetic Dataset Points (N):</label>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary)" }}>
                {datasetSize.toLocaleString()} points
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={datasetSize}
              onChange={(e) => setDatasetSize(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>500 (Small)</span>
              <span>10,000 (Medium)</span>
              <span>20,000 (Heavy)</span>
            </div>
          </div>

          {/* Search Radius Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Spatial Search Radius (R):</label>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary)" }}>
                {searchRadiusKm} km ({Math.round(searchRadiusKm * 1000)}m)
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>100m (Local)</span>
              <span>1.5km (Campus)</span>
              <span>3.0km (Perundurai)</span>
            </div>
          </div>
        </div>

        {/* Run Action */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="btn btn-primary btn-lg"
            style={{ minWidth: "220px" }}
          >
            <Play size={18} fill="currentColor" />
            <span>{isRunning ? "Executing Algorithms..." : "Run Performance Benchmark"}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "var(--radius-md)" }}>
          {error}
        </div>
      )}

      {/* Results Section */}
      {benchmarkResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Equality Verification Banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            backgroundColor: benchmarkResult.verification.results_match ? "var(--color-primary-light)" : "#fee2e2",
            border: `1px solid ${benchmarkResult.verification.results_match ? "var(--color-primary-border)" : "#fca5a5"}`,
            borderRadius: "var(--radius-lg)"
          }}>
            {benchmarkResult.verification.results_match ? (
              <CheckCircle2 size={24} color="var(--color-primary)" />
            ) : (
              <AlertTriangle size={24} color="#dc2626" />
            )}
            <div>
              <div style={{ fontWeight: 800, color: benchmarkResult.verification.results_match ? "var(--color-primary)" : "#dc2626", fontSize: "1rem" }}>
                {benchmarkResult.verification.status}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Identical points found: <strong>{benchmarkResult.verification.matched_count} candidates</strong> across both algorithms on N={benchmarkResult.parameters.dataset_size}.
              </div>
            </div>
          </div>

          {/* Comparison Cards: Quadtree vs Linear Scan */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Quadtree Card */}
            <div className="card" style={{ borderTop: "4px solid var(--color-primary)" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                Custom 2D Spatial Quadtree
              </div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px", lineHeight: 1 }}>
                {benchmarkResult.quadtree_metrics.query_time_ms.toFixed(4)} <span style={{ fontSize: "1rem", fontWeight: 600 }}>ms</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px" }}>
                ({benchmarkResult.quadtree_metrics.query_time_ns.toLocaleString()} nanoseconds)
              </div>

              <div style={{
                marginTop: "16px",
                paddingTop: "14px",
                borderTop: "1px solid var(--border-light)",
                fontSize: "0.82rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div><strong>Points Matched:</strong> {benchmarkResult.quadtree_metrics.points_found}</div>
                <div><strong>Tree Build Time:</strong> {benchmarkResult.quadtree_metrics.build_time_ms.toFixed(3)} ms</div>
                <div><strong>Pruning:</strong> Quadrant boundary pruning</div>
              </div>
            </div>

            {/* Linear Search Card */}
            <div className="card" style={{ borderTop: "4px solid #64748b" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Linear Scan Baseline
              </div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px", lineHeight: 1 }}>
                {benchmarkResult.linear_metrics.query_time_ms.toFixed(4)} <span style={{ fontSize: "1rem", fontWeight: 600 }}>ms</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px" }}>
                ({benchmarkResult.linear_metrics.query_time_ns.toLocaleString()} nanoseconds)
              </div>

              <div style={{
                marginTop: "16px",
                paddingTop: "14px",
                borderTop: "1px solid var(--border-light)",
                fontSize: "0.82rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div><strong>Points Matched:</strong> {benchmarkResult.linear_metrics.points_found}</div>
                <div><strong>Speedup Factor:</strong> {benchmarkResult.verification.speedup_factor}x</div>
                <div><strong>Evaluation:</strong> Exhaustive O(N) Haversine loop</div>
              </div>
            </div>
          </div>

          {/* Complexity Explanation */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <HelpCircle size={16} color="var(--color-primary)" />
              <span>Theoretical & Practical Complexity Analysis</span>
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              The Quadtree achieves candidate spatial filtering in average <code>O(log N + K)</code> time by hierarchically 
              decomposing the 2D bounding space and eliminating whole quadrants outside the circular query bounding box. 
              The linear search baseline scans all <code>N</code> records computing expensive trigonometric Haversine equations 
              in <code>O(N)</code> time. Actual execution times depend on points distribution and memory layout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
