import { useState, useCallback } from "react";
import VoiceRecorder from "./components/VoiceRecorder";
import TranscriptionDisplay from "./components/TranscriptionDisplay";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscriptionUpdate = useCallback((text: string) => {
    setTranscription((prev) => prev + text);
  }, []);

  const handleRecordingStateChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
    if (!recording) {
      setError(null);
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsRecording(false);
  }, []);

  const handleClear = useCallback(() => {
    setTranscription("");
    setError(null);
  }, []);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Your Voice</h1>
          <p className="subtitle">Voice-to-Text with Deepgram</p>
        </header>

        <main className="app-main">
          <VoiceRecorder
            onTranscriptionUpdate={handleTranscriptionUpdate}
            onRecordingStateChange={handleRecordingStateChange}
            onError={handleError}
          />

          <TranscriptionDisplay
            transcription={transcription}
            isRecording={isRecording}
            error={error}
            onClear={handleClear}
          />
        </main>
      </div>
    </div>
  );
}

export default App;