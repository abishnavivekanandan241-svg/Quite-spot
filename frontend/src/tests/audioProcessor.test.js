import { describe, it, expect } from "vitest";
import { AudioProcessor } from "../services/audioProcessor";

describe("AudioProcessor Web Audio Unit Tests", () => {
  it("initializes with default options without allocating audio stream", () => {
    const processor = new AudioProcessor({ fftSize: 1024 });
    expect(processor.isMonitoring).toBe(false);
    expect(processor.isPaused).toBe(false);
    expect(processor.fftSize).toBe(1024);
  });

  it("cleans up resources safely even when not started", () => {
    const processor = new AudioProcessor();
    expect(() => processor.cleanup()).not.toThrow();
    expect(processor.isMonitoring).toBe(false);
  });

  it("handles pause and stop state updates", () => {
    const processor = new AudioProcessor();
    processor.isMonitoring = true;
    processor.pause();
    expect(processor.isPaused).toBe(true);

    processor.stop();
    expect(processor.isMonitoring).toBe(false);
    expect(processor.isPaused).toBe(false);
  });
});
