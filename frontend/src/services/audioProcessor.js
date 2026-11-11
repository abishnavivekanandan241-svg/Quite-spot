/**
 * Pure client-side Web Audio processor.
 * Computes Root-Mean-Square (RMS) amplitude and scaled relative decibels.
 * Strict privacy guarantee: Audio frames are analyzed in-memory and immediately discarded.
 */

export class AudioProcessor {
  constructor(options = {}) {
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.sourceNode = null;
    this.animationFrameId = null;
    this.isMonitoring = false;
    this.isPaused = false;

    this.fftSize = options.fftSize || 1024;
    this.smoothingTimeConstant = options.smoothingTimeConstant || 0.8;
    this.onMetricsUpdate = options.onMetricsUpdate || (() => {});
    this.onError = options.onError || (() => {});

    // Calibration offsets for realistic relative sound pressure estimation
    this.decibelOffset = 20.0;
  }

  async requestPermissionAndStart() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone API (getUserMedia) is not supported by your browser or context.");
      }

      // Request media stream from user
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("Web Audio API is not supported in this browser.");
      }

      this.audioContext = new AudioContextClass();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);
      // Analyser is intentionally NOT connected to destination, so audio is NEVER played through speakers!

      this.isMonitoring = true;
      this.isPaused = false;
      this._startAnalysisLoop();

      return true;
    } catch (err) {
      this.cleanup();
      this.onError(err);
      throw err;
    }
  }

  pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (this.isMonitoring && this.isPaused) {
      this.isPaused = false;
      this._startAnalysisLoop();
    }
  }

  stop() {
    this.cleanup();
  }

  cleanup() {
    this.isMonitoring = false;
    this.isPaused = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch (e) {}
      this.analyser = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  _startAnalysisLoop() {
    const bufferLength = this.analyser.fftSize;
    const timeData = new Float32Array(bufferLength);
    const freqData = new Uint8Array(this.analyser.frequencyBinCount);

    const loop = () => {
      if (!this.isMonitoring || this.isPaused) return;

      this.analyser.getFloatTimeDomainData(timeData);
      this.analyser.getByteFrequencyData(freqData);

      // Compute Root Mean Square (RMS)
      let sumOfSquares = 0.0;
      for (let i = 0; i < bufferLength; i++) {
        const val = timeData[i];
        sumOfSquares += val * val;
      }
      const rms = Math.sqrt(sumOfSquares / bufferLength);

      // Scaled Relative Intensity (approximate dB scale: 20 to 100)
      // Clamped epsilon to avoid log(0)
      const eps = 0.00001;
      const dbfs = 20 * Math.log10(Math.max(rms, eps));
      // Map dBFS (-60 dBFS .. 0 dBFS) to relative scale (25 .. 95)
      const relativeIntensity = Math.max(20.0, Math.min(100.0, ((dbfs + 60.0) / 60.0) * 75.0 + 20.0));

      // Categorize
      let category = "Quiet";
      if (relativeIntensity >= 65.0) {
        category = "Noisy";
      } else if (relativeIntensity >= 45.0) {
        category = "Moderate";
      }

      this.onMetricsUpdate({
        rms: Number(rms.toFixed(5)),
        relativeIntensity: Number(relativeIntensity.toFixed(1)),
        category,
        frequencyData: Array.from(freqData.slice(0, 32)), // lightweight 32 frequency bins for visualizer
        timestamp: new Date().toISOString(),
      });

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }
}
