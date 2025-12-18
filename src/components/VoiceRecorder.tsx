import { useState, useRef, useEffect } from "react";
import { AudioCaptureService } from "../services/audioCapture";
import { DeepgramService } from "../services/deepgramService";
import "./VoiceRecorder.css";

interface VoiceRecorderProps {
  onTranscriptionUpdate: (text: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
  onError: (error: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionUpdate,
  onRecordingStateChange,
  onError,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioCaptureRef = useRef<AudioCaptureService | null>(null);
  const deepgramRef = useRef<DeepgramService | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const isConnectingRef = useRef(false);

  // Initialize services on mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!apiKey) {
      onError(
        "Deepgram API key not found. Please set VITE_DEEPGRAM_API_KEY in your .env file."
      );
      return;
    }

    audioCaptureRef.current = new AudioCaptureService();
    deepgramRef.current = new DeepgramService({ apiKey });

    return () => {
      // Cleanup on unmount
      if (audioCaptureRef.current) {
        audioCaptureRef.current.stopCapture();
      }
      if (deepgramRef.current) {
        deepgramRef.current.disconnect();
      }
    };
  }, [onError]);

  const startRecording = async () => {
    try {
      // Prevent double-start from both click + spacebar, or rapid presses
      if (isRecording || isConnectingRef.current) {
        return;
      }
      isConnectingRef.current = true;

      if (!audioCaptureRef.current || !deepgramRef.current) {
        onError("Services not initialized. Please refresh the page.");
        isConnectingRef.current = false;
        return;
      }

      // Initialize audio capture
      if (!isInitialized) {
        await audioCaptureRef.current.initialize();
        setIsInitialized(true);
      }

      // Connect to Deepgram (final results only for better accuracy)
      await deepgramRef.current.connect(
        (transcript, isFinal) => {
          if (!isFinal) return;

          const newText = transcript.trim();
          if (!newText) return;

          // Avoid appending exact duplicate finals
          if (newText === lastTranscriptRef.current) return;

          onTranscriptionUpdate(newText + " ");
          lastTranscriptRef.current = newText;
        },
        (error) => {
          onError(error);
          stopRecording();
        }
      );

      // Start audio capture
      audioCaptureRef.current.startCapture((audioData) => {
        if (deepgramRef.current?.getConnected()) {
          try {
            deepgramRef.current.sendAudio(audioData);
          } catch (error) {
            console.error("Error sending audio:", error);
          }
        }
      });

      setIsRecording(true);
      onRecordingStateChange(true);
      lastTranscriptRef.current = "";
      isConnectingRef.current = false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start recording";
      onError(errorMessage);
      setIsRecording(false);
      onRecordingStateChange(false);
      isConnectingRef.current = false;
    }
  };

  const stopRecording = () => {
    try {
      if (audioCaptureRef.current) {
        audioCaptureRef.current.stopCapture();
      }
      if (deepgramRef.current) {
        deepgramRef.current.disconnect();
      }
      setIsRecording(false);
      onRecordingStateChange(false);
      lastTranscriptRef.current = "";
      setIsInitialized(false);
      isConnectingRef.current = false;
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.code === "Space") && !isRecording && !isConnectingRef.current) {
      e.preventDefault();
      startRecording();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.code === "Space") && isRecording) {
      e.preventDefault();
      stopRecording();
    }
  };

  // Global spacebar push-to-talk (works even when the button is not focused)
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.code === "Space") && !isRecording && !isConnectingRef.current) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => {
      if ((e.key === " " || e.code === "Space") && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    window.addEventListener("keyup", handleWindowKeyUp);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
      window.removeEventListener("keyup", handleWindowKeyUp);
    };
  }, [isRecording]);

  return (
    <div className="voice-recorder">
      <button
        className={`record-button ${isRecording ? "recording" : ""}`}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        <span className="button-icon">
          {isRecording ? "⏹" : "🎤"}
        </span>
        <span className="button-text">
          {isRecording ? "Stop Recording" : "Start Recording"}
        </span>
      </button>
      <p className="recording-hint">
        {isRecording
          ? "Recording... Release to stop"
          : "Click to start or hold Spacebar"}
      </p>
      {isRecording && (
        <div className="recording-indicator">
          <span className="pulse-dot"></span>
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;

