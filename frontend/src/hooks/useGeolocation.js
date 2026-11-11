import { useState, useEffect, useCallback } from "react";
import { KEC_CAMPUS } from "../utils/constants";

export const CAMPUS_MANUAL_ANCHORS = [
  { id: "kec_center", name: "Campus Center", lat: 11.27218, lon: 77.60400 },
  { id: "kec_main_gate", name: "KEC Main Gate / Entrance", lat: 11.27340, lon: 77.60825 },
  { id: "kec_lib", name: "CD Memorial Library", lat: 11.27096, lon: 77.60528 },
  { id: "kec_food_court", name: "Food Court", lat: 11.27263, lon: 77.60678 },
  { id: "kec_hostels", name: "Hostel Zone", lat: 11.27133, lon: 77.60669 },
];

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState({
    latitude: KEC_CAMPUS.center.lat,
    longitude: KEC_CAMPUS.center.lon,
  });
  const [permissionStatus, setPermissionStatus] = useState("prompt"); // 'prompt' | 'granted' | 'denied'
  const [isUsingManual, setIsUsingManual] = useState(false);
  const [manualAnchorId, setManualAnchorId] = useState("kec_center");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setPermissionStatus("denied");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setPermissionStatus("granted");
        setIsUsingManual(false);
        setIsLoading(false);
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
        setError("Location permission denied or unavailable. Campus center is active as reference.");
        setPermissionStatus("denied");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const selectManualLocation = useCallback((anchorId) => {
    const anchor = CAMPUS_MANUAL_ANCHORS.find((a) => a.id === anchorId);
    if (anchor) {
      setCoordinates({
        latitude: anchor.lat,
        longitude: anchor.lon,
      });
      setManualAnchorId(anchor.id);
      setIsUsingManual(true);
      setError(null);
    }
  }, []);

  return {
    coordinates,
    permissionStatus,
    isUsingManual,
    manualAnchorId,
    isLoading,
    error,
    requestLocation,
    selectManualLocation,
    anchors: CAMPUS_MANUAL_ANCHORS,
  };
}
