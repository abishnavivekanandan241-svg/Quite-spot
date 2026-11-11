import { API_BASE_URL } from "../utils/constants";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Request failed`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // Health
  getHealth() {
    return this.request("/health");
  }

  // Locations
  getLocations(params = {}) {
    const query = new URLSearchParams();
    if (params.type && params.type !== "all") query.append("type", params.type);
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request(`/locations${qs}`);
  }

  getLocationById(id) {
    return this.request(`/locations/${encodeURIComponent(id)}`);
  }

  getLocationSummary(id) {
    return this.request(`/locations/${encodeURIComponent(id)}/summary`);
  }

  getLocationReadings(id, limit = 50) {
    return this.request(`/locations/${encodeURIComponent(id)}/readings?limit=${limit}`);
  }

  // Readings (Microphone telemetry submission)
  submitReading(payload) {
    return this.request("/readings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Recommendations
  getRecommendations(params = {}) {
    const query = new URLSearchParams();
    if (params.lat !== undefined) query.append("lat", params.lat);
    if (params.lon !== undefined) query.append("lon", params.lon);
    if (params.radius) query.append("radius", params.radius);
    if (params.limit) query.append("limit", params.limit);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request(`/recommendations${qs}`);
  }

  // Feedback
  submitFeedback(payload) {
    return this.request("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getLocationFeedback(id) {
    return this.request(`/locations/${encodeURIComponent(id)}/feedback`);
  }

  // Benchmark
  runBenchmark(payload = {}) {
    return this.request("/benchmark", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getBenchmarkInfo() {
    return this.request("/benchmark/info");
  }

  // Dashboard Statistics
  getDashboardStats() {
    return this.request("/dashboard/stats");
  }

  // Auth
  register(payload) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  login(payload) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
