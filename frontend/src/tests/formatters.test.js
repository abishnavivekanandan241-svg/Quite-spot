import { describe, it, expect } from "vitest";
import {
  formatDistance,
  formatDistanceKm,
  formatRelativeTime,
  formatIntensity,
  getGoogleMapsNavigationUrl,
} from "../utils/formatters";

describe("Frontend Formatters", () => {
  it("formats distance accurately in meters and km", () => {
    expect(formatDistance(150)).toBe("150 m");
    expect(formatDistance(1500)).toBe("1.50 km");
    expect(formatDistance(null)).toBe("--");

    expect(formatDistanceKm(0.25)).toBe("250 m");
    expect(formatDistanceKm(1.85)).toBe("1.85 km");
  });

  it("formats relative decibels", () => {
    expect(formatIntensity(34.2)).toBe("34.2 dB (rel)");
    expect(formatIntensity(null)).toBe("--");
  });

  it("builds valid Google Maps navigation URL", () => {
    const url = getGoogleMapsNavigationUrl(11.27218, 77.60400, "CD Memorial Library");
    expect(url).toContain("https://www.google.com/maps/dir/");
    expect(url).toContain("destination=11.27218,77.604");
    expect(url).toContain("CD%20Memorial%20Library");
  });

  it("formats relative timestamps", () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe("Just now");

    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinAgo.toISOString())).toBe("10m ago");
  });
});
