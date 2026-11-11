/**
 * Format distance in meters or kilometers
 */
export function formatDistance(distanceMeters) {
  if (distanceMeters === null || distanceMeters === undefined) return "--";
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

/**
 * Format distance from km
 */
export function formatDistanceKm(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) return "--";
  if (distanceKm < 1.0) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(2)} km`;
}

/**
 * Format ISO timestamp into human-readable relative time
 */
export function formatRelativeTime(isoDateStr) {
  if (!isoDateStr) return "No readings";
  try {
    const date = new Date(isoDateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "Unknown time";
  }
}

/**
 * Generate real navigation URL for Google Maps
 */
export function getGoogleMapsNavigationUrl(lat, lon, destinationName = "Campus Spot") {
  const query = encodeURIComponent(`${destinationName}, Kongu Engineering College`);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${query}`;
}

/**
 * Format decibel intensity
 */
export function formatIntensity(intensity) {
  if (intensity === null || intensity === undefined) return "--";
  return `${Number(intensity).toFixed(1)} dB (rel)`;
}
