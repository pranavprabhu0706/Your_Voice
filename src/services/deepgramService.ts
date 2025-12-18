/**
 * Deepgram Service
 * Handles real-time transcription using Deepgram API
 */

export interface DeepgramConfig {
  apiKey: string;
  model?: string;
  language?: string;
  punctuate?: boolean;
  interim_results?: boolean;
}

export class DeepgramService {
  private socket: WebSocket | null = null;
  private config: DeepgramConfig;
  private isConnected: boolean = false;

  constructor(config: DeepgramConfig) {
    this.config = {
      model: "nova-2",
      language: "en-US",
      punctuate: true,
      // Use only final results for better perceived accuracy
      interim_results: false,
      ...config,
    };
  }

  /**
   * Connect to Deepgram WebSocket API
   */
  async connect(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `wss://api.deepgram.com/v1/listen?model=${this.config.model}&language=${this.config.language}&punctuate=${this.config.punctuate}&interim_results=${this.config.interim_results}&encoding=linear16&sample_rate=16000&channels=1`;

        this.socket = new WebSocket(url, ["token", this.config.apiKey]);

        this.socket.onopen = () => {
          this.isConnected = true;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Deepgram streaming responses typically have:
            // { type: "Results", channel: { alternatives: [{ transcript }] }, is_final: boolean }
            if (data.channel?.alternatives?.[0]?.transcript) {
              const transcript = data.channel.alternatives[0].transcript as string;
              const isFinal =
                (typeof data.is_final === "boolean" && data.is_final) ||
                (typeof data.speech_final === "boolean" && data.speech_final) ||
                false;

              onTranscript(transcript, isFinal);
            }
          } catch (error) {
            console.error("Error parsing Deepgram response:", error);
          }
        };

        this.socket.onerror = (error) => {
          this.isConnected = false;
          onError("WebSocket connection error. Please check your API key and internet connection.");
          reject(error);
        };

        this.socket.onclose = (event) => {
          this.isConnected = false;
          if (event.code !== 1000) {
            onError("Connection closed unexpectedly. Please try again.");
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send audio data to Deepgram
   */
  sendAudio(audioData: Float32Array): void {
    if (!this.socket || !this.isConnected) {
      throw new Error("Not connected to Deepgram. Call connect() first.");
    }

    // Convert Float32Array to Int16Array for Deepgram
    const int16Data = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      const s = Math.max(-1, Math.min(1, audioData[i]));
      int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // Send as binary data
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(int16Data.buffer);
    }
  }

  /**
   * Close the connection
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Client disconnect");
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  getConnected(): boolean {
    return this.isConnected;
  }
}

