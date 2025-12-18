/**
 * Audio Capture Service
 * Handles microphone access and audio stream capture
 */

export class AudioCaptureService {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;

  /**
   * Request microphone access and initialize audio capture
   */
  async initialize(): Promise<MediaStream> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create audio context for processing
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      return this.mediaStream;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          throw new Error("Microphone permission denied. Please allow microphone access.");
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          throw new Error("No microphone found. Please connect a microphone.");
        } else {
          throw new Error(`Failed to access microphone: ${error.message}`);
        }
      }
      throw new Error("Failed to access microphone: Unknown error");
    }
  }

  /**
   * Start capturing audio and provide callback for audio data
   * Note: ScriptProcessorNode is deprecated but still widely supported.
   * For production, consider migrating to AudioWorkletNode.
   */
  startCapture(onAudioData: (audioData: Float32Array) => void): void {
    if (!this.audioContext || !this.sourceNode) {
      throw new Error("Audio capture not initialized. Call initialize() first.");
    }

    // Create script processor for audio data
    // Using deprecated API for simplicity and compatibility
    const bufferSize = 4096;
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.processorNode.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const inputData = inputBuffer.getChannelData(0);
      onAudioData(new Float32Array(inputData));
    };

    this.sourceNode.connect(this.processorNode);
    // Connect to destination to keep the audio context active
    this.processorNode.connect(this.audioContext.destination);
  }

  /**
   * Stop audio capture and cleanup resources
   */
  stopCapture(): void {
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  /**
   * Check if microphone is currently active
   */
  isActive(): boolean {
    return this.mediaStream !== null && this.mediaStream.active;
  }
}

