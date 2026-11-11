export const KEC_CAMPUS = {
  name: "Kongu Engineering College",
  shortName: "KEC",
  location: "Thoppupalayam, Perundurai, Erode, Tamil Nadu 638060",
  center: {
    lat: 11.27218,
    lon: 77.60400,
  },
  defaultZoom: 16,
  bounds: {
    minLat: 11.2650,
    maxLat: 11.2800,
    minLon: 77.5950,
    maxLon: 77.6150,
  },
  website: "https://kongu.ac.in/"
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const NOISE_CATEGORIES = {
  QUIET: {
    label: "Quiet",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    textColor: "#15803d",
    badgeClass: "badge-quiet",
    description: "Ideal for deep focus, reading, and exam preparation (< 45 rel. dB)"
  },
  MODERATE: {
    label: "Moderate",
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    textColor: "#b45309",
    badgeClass: "badge-moderate",
    description: "Noticeable background hum, suitable for casual study or team discussion (45 - 65 rel. dB)"
  },
  NOISY: {
    label: "Noisy",
    color: "#e11d48",
    bgColor: "#fff1f2",
    borderColor: "#fecdd3",
    textColor: "#be123c",
    badgeClass: "badge-noisy",
    description: "Loud ambient noise, transit, or cafeteria activity (> 65 rel. dB)"
  },
  UNKNOWN: {
    label: "Unknown / Stale",
    color: "#64748b",
    bgColor: "#f8fafc",
    borderColor: "#e2e8f0",
    textColor: "#475569",
    badgeClass: "badge-unknown",
    description: "No recent client observation within 120 minutes. Requires fresh measurement."
  }
};

export const getCategoryMeta = (category) => {
  if (!category) return NOISE_CATEGORIES.UNKNOWN;
  const cat = String(category).toLowerCase();
  if (cat.includes("quiet")) return NOISE_CATEGORIES.QUIET;
  if (cat.includes("moderate")) return NOISE_CATEGORIES.MODERATE;
  if (cat.includes("noisy")) return NOISE_CATEGORIES.NOISY;
  return NOISE_CATEGORIES.UNKNOWN;
};
