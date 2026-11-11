import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { BottomNav } from "./components/common/BottomNav";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { QuietSpotsPage } from "./pages/QuietSpotsPage";
import { LocationDetailPage } from "./pages/LocationDetailPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { BenchmarkLabPage } from "./pages/BenchmarkLabPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { LiveMonitorPromptModal } from "./components/monitoring/LiveMonitorPromptModal";
import { useNoiseMonitoring } from "./hooks/useNoiseMonitoring";
import { useGeolocation } from "./hooks/useGeolocation";

export default function App() {
  const monitoring = useNoiseMonitoring();
  const geo = useGeolocation();

  return (
    <Router>
      <div className="app-layout">
        <div className="main-content">
          {/* Welcome / Initial Live Monitor Permission Modal */}
          <LiveMonitorPromptModal
            isMonitoring={monitoring.isMonitoring}
            permissionStatus={monitoring.permissionStatus}
            error={monitoring.error}
            startMonitoring={monitoring.startMonitoring}
            selectedLocationId={monitoring.selectedLocationId}
            setSelectedLocationId={monitoring.setSelectedLocationId}
          />

          <Navbar isMonitoring={monitoring.isMonitoring} />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  isMonitoring={monitoring.isMonitoring}
                  startMonitoring={monitoring.startMonitoring}
                  stopMonitoring={monitoring.stopMonitoring}
                  userCoordinates={geo.coordinates}
                />
              }
            />
            <Route
              path="/map"
              element={<MapPage userCoordinates={geo.coordinates} />}
            />
            <Route
              path="/quiet-spots"
              element={<QuietSpotsPage userCoordinates={geo.coordinates} />}
            />
            <Route path="/locations/:id" element={<LocationDetailPage />} />
            <Route
              path="/monitoring"
              element={
                <MonitoringPage
                  isMonitoring={monitoring.isMonitoring}
                  isPaused={monitoring.isPaused}
                  permissionStatus={monitoring.permissionStatus}
                  metrics={monitoring.metrics}
                  isContributing={monitoring.isContributing}
                  setIsContributing={monitoring.setIsContributing}
                  lastSubmissionStatus={monitoring.lastSubmissionStatus}
                  lastSubmittedTime={monitoring.lastSubmittedTime}
                  error={monitoring.error}
                  startMonitoring={monitoring.startMonitoring}
                  pauseMonitoring={monitoring.pauseMonitoring}
                  resumeMonitoring={monitoring.resumeMonitoring}
                  stopMonitoring={monitoring.stopMonitoring}
                  selectedLocationId={monitoring.selectedLocationId}
                  setSelectedLocationId={monitoring.setSelectedLocationId}
                />
              }
            />
            <Route path="/benchmark" element={<BenchmarkLabPage />} />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  isMonitoring={monitoring.isMonitoring}
                  isPaused={monitoring.isPaused}
                  permissionStatus={monitoring.permissionStatus}
                  isContributing={monitoring.isContributing}
                  setIsContributing={monitoring.setIsContributing}
                  stopMonitoring={monitoring.stopMonitoring}
                  userCoordinates={geo.coordinates}
                />
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Sticky Mobile Navigation Bar */}
          <BottomNav isMonitoring={monitoring.isMonitoring} />
        </div>
      </div>
    </Router>
  );
}
