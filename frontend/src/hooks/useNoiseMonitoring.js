import { useState, useEffect, useRef, useCallback } from "react";
import { AudioProcessor } from "../services/audioProcessor";
import { api } from "../services/api";

export function useNoiseMonitoring(initialLocationId = null) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("prompt"); // 'prompt' | 'granted' | 'denied' | 'unsupported'
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    return initialLocationId || localStorage.getItem("qs_selected_location_id") || "";
  });

  const updateSelectedLocation = useCallback((id) => {
    setSelectedLocationId(id);
    if (id) {
      localStorage.setItem("qs_selected_location_id", id);
    }
  }, []);

  const [metrics, setMetrics] = useState({
    rms: 0,
    relativeIntensity: 0,
    category: "Quiet",
    frequencyData: new Array(32).fill(0),
    timestamp: null,
  });
  const [isContributing, setIsContributing] = useState(true);
  const [lastSubmissionStatus, setLastSubmissionStatus] = useState(null); // 'submitting' | 'success' | 'error' | null
  const [lastSubmittedTime, setLastSubmittedTime] = useState(null);
  const [error, setError] = useState(null);

  const processorRef = useRef(null);
  const lastSubmissionTimeRef = useRef(0);
  const submissionIntervalMs = 8000; // Throttle to one contribution every 8 seconds

  // Initialize AudioProcessor instance
  useEffect(() => {
    processorRef.current = new AudioProcessor({
      onMetricsUpdate: (newMetrics) => {
        setMetrics(newMetrics);
      },
      onError: (err) => {
        console.error("Audio Processor Error:", err);
        setError(err.message || "Failed to process audio");
        setIsMonitoring(false);
        setPermissionStatus("denied");
      },
    });

    return () => {
      if (processorRef.current) {
        processorRef.current.cleanup();
      }
    };
  }, []);

  // Throttled submission to backend when monitoring & contributing
  useEffect(() => {
    if (!isMonitoring || isPaused || !isContributing || !selectedLocationId) {
      return;
    }

    const now = Date.now();
    if (now - lastSubmissionTimeRef.current >= submissionIntervalMs && metrics.relativeIntensity > 0) {
      lastSubmissionTimeRef.current = now;

      // Safe derived submission: NO raw audio
      const payload = {
        location_id: selectedLocationId,
        relative_intensity: metrics.relativeIntensity,
        noise_category: metrics.category,
        measurement_method: "web_audio_rms_client",
        data_source: "consented_client_monitoring",
        device_session_id: "session_" + (window.sessionStorage.getItem("qs_session_id") || "anonymous"),
      };

      setLastSubmissionStatus("submitting");
      api.submitReading(payload)
        .then(() => {
          setLastSubmissionStatus("success");
          setLastSubmittedTime(new Date());
        })
        .catch((err) => {
          console.warn("Contribution submission failed:", err);
          setLastSubmissionStatus("error");
        });
    }
  }, [isMonitoring, isPaused, isContributing, selectedLocationId, metrics.relativeIntensity, metrics.category]);

  const startMonitoring = useCallback(async () => {
    setError(null);
    if (!processorRef.current) return;

    try {
      await processorRef.current.requestPermissionAndStart();
      setIsMonitoring(true);
      setIsPaused(false);
      setPermissionStatus("granted");
    } catch (err) {
      setError(err.message || "Microphone permission denied or device unavailable");
      setPermissionStatus("denied");
      setIsMonitoring(false);
    }
  }, []);

  const pauseMonitoring = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeMonitoring = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.stop();
      setIsMonitoring(false);
      setIsPaused(false);
      setMetrics({
        rms: 0,
        relativeIntensity: 0,
        category: "Quiet",
        frequencyData: new Array(32).fill(0),
        timestamp: null,
      });
    }
  }, []);

  return {
    isMonitoring,
    isPaused,
    permissionStatus,
    metrics,
    isContributing,
    setIsContributing,
    lastSubmissionStatus,
    lastSubmittedTime,
    error,
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoring,
    selectedLocationId,
    setSelectedLocationId: updateSelectedLocation,
  };
}
