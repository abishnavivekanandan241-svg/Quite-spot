import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, RotateCcw, Navigation, ExternalLink } from "lucide-react";
import { KEC_CAMPUS, getCategoryMeta } from "../../utils/constants";
import { formatIntensity, formatRelativeTime, getGoogleMapsNavigationUrl } from "../../utils/formatters";

// Helper to create colored custom SVG pin icons
function createPinIcon(category) {
  const meta = getCategoryMeta(category);
  const color = meta.color;

  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.28);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-pin",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function createUserLocationIcon() {
  const svgHtml = `
    <div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #2563eb;
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25), 0 2px 6px rgba(0, 0, 0, 0.3);
    "></div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "user-location-pin",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export function CampusMap({
  locations = [],
  selectedLocation = null,
  onSelectLocation = () => {},
  userCoordinates = null,
  height = "540px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [KEC_CAMPUS.center.lat, KEC_CAMPUS.center.lon],
        zoom: KEC_CAMPUS.defaultZoom,
        zoomControl: true,
      });

      // Authentic OpenStreetMap tiles centered on Kongu Engineering College
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | KEC Campus',
        maxZoom: 19,
        minZoom: 14,
      }).addTo(map);

      // Campus Bounds Outline (Soft dashed green polygon)
      const campusBoundsRectangle = [
        [KEC_CAMPUS.bounds.minLat, KEC_CAMPUS.bounds.minLon],
        [KEC_CAMPUS.bounds.maxLat, KEC_CAMPUS.bounds.maxLon],
      ];
      L.rectangle(campusBoundsRectangle, {
        color: "var(--color-primary)",
        weight: 1.5,
        dashArray: "4, 6",
        fillColor: "var(--color-primary)",
        fillOpacity: 0.04,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Location Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const icon = createPinIcon(loc.current_noise_category);
      const marker = L.marker([loc.latitude, loc.longitude], { icon });

      const meta = getCategoryMeta(loc.current_noise_category);
      const intensityText = loc.latest_reading
        ? formatIntensity(loc.latest_reading.relative_intensity)
        : "No active readings";
      const measuredTime = loc.latest_reading?.measured_at
        ? formatRelativeTime(loc.latest_reading.measured_at)
        : "Not observed";
      const navUrl = getGoogleMapsNavigationUrl(loc.latitude, loc.longitude, loc.name);

      const popupContent = `
        <div style="font-family: var(--font-family); min-width: 220px; padding: 2px;">
          ${loc.image_url ? `
            <div style="width: 100%; height: 110px; overflow: hidden; border-radius: 6px; margin-bottom: 8px; position: relative;">
              <img src="${loc.image_url}" alt="${loc.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
              <div style="position: absolute; bottom: 4px; right: 6px; background: rgba(0,0,0,0.6); color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 600;">KEC Campus</div>
            </div>
          ` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background-color: ${meta.bgColor};
              color: ${meta.textColor};
              border: 1px solid ${meta.borderColor};
              font-size: 0.72rem;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 9999px;
            ">${meta.label}</span>
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${loc.location_type || "Spot"}</span>
          </div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${loc.name}</h4>
          <div style="font-size: 0.8rem; color: #475569; margin-bottom: 4px;">
            Estimated Noise: <strong>${intensityText}</strong>
          </div>
          <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 10px;">
            Freshness: ${loc.freshness?.status || "Stale"} (${measuredTime})
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="#/locations/${loc.id}" style="
              flex: 1;
              text-align: center;
              padding: 6px 10px;
              background-color: #f1f5f9;
              color: #0f172a;
              border-radius: 6px;
              font-size: 0.75rem;
              font-weight: 600;
              text-decoration: none;
            ">View Details</a>
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="
              flex: 1;
              text-align: center;
              padding: 6px 10px;
              background-color: #16a34a;
              color: #ffffff;
              border-radius: 6px;
              font-size: 0.75rem;
              font-weight: 600;
              text-decoration: none;
            ">Navigate</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        onSelectLocation(loc);
      });

      marker.addTo(markersLayerRef.current);
    });
  }, [locations, onSelectLocation]);

  // Update User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userCoordinates && userCoordinates.latitude && userCoordinates.longitude) {
      const latLng = [userCoordinates.latitude, userCoordinates.longitude];
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(latLng);
      } else {
        userMarkerRef.current = L.marker(latLng, {
          icon: createUserLocationIcon(),
          zIndexOffset: 1000,
        }).addTo(mapInstanceRef.current);
        userMarkerRef.current.bindPopup("<b>You are here</b><br>Reference location for study recommendations.");
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoordinates]);

  // Pan to selected location
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    mapInstanceRef.current.setView([selectedLocation.latitude, selectedLocation.longitude], 17, {
      animate: true,
    });
  }, [selectedLocation]);

  // Controls Handlers
  const handleRecenterCampus = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([KEC_CAMPUS.center.lat, KEC_CAMPUS.center.lon], KEC_CAMPUS.defaultZoom, {
        animate: true,
      });
    }
  };

  const handleLocateMe = () => {
    if (userCoordinates && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userCoordinates.latitude, userCoordinates.longitude], 17, {
        animate: true,
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    } else {
      handleRecenterCampus();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)" }}>
      {/* Map Target Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {/* Floating Map Controls */}
      <div style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <button
          onClick={handleRecenterCampus}
          title="Recenter on KEC Campus"
          className="btn btn-secondary btn-sm"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "8px 12px",
            fontSize: "0.82rem",
          }}
        >
          <RotateCcw size={14} />
          <span>Campus Center</span>
        </button>

        <button
          onClick={handleLocateMe}
          title="Pan to My Current Location"
          className="btn btn-secondary btn-sm"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "8px 12px",
            fontSize: "0.82rem",
          }}
        >
          <Locate size={14} />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Map Legend */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 500,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(4px)",
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-light)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontSize: "0.78rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Legend:</div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-quiet)" }}></span>
          <span>Quiet (&lt; 45 dB)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-moderate)" }}></span>
          <span>Moderate (45-65 dB)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-noisy)" }}></span>
          <span>Noisy (&gt; 65 dB)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-unknown)" }}></span>
          <span>Unknown / Stale</span>
        </div>
      </div>
    </div>
  );
}
