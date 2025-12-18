import "./TranscriptionDisplay.css";

interface TranscriptionDisplayProps {
  transcription: string;
  isRecording: boolean;
  error: string | null;
  onClear: () => void;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  isRecording,
  error,
  onClear,
}) => {
  const handleCopy = async () => {
    if (transcription.trim()) {
      try {
        await navigator.clipboard.writeText(transcription);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  return (
    <div className="transcription-display">
      <div className="transcription-header">
        <h2>Transcription</h2>
        <div className="transcription-actions">
          {transcription && (
            <>
              <button
                className="action-button copy-button"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
              <button
                className="action-button clear-button"
                onClick={onClear}
                title="Clear transcription"
              >
                🗑️ Clear
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="transcription-content">
        {transcription ? (
          <p className="transcription-text">{transcription}</p>
        ) : (
          <p className="transcription-placeholder">
            {isRecording
              ? "Listening for speech..."
              : "Your transcribed text will appear here"}
          </p>
        )}
      </div>

      {transcription && (
        <div className="transcription-footer">
          <span className="word-count">
            {transcription.trim().split(/\s+/).length} words
          </span>
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;

