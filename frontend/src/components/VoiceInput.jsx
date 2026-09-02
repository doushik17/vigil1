import React, { useEffect } from "react";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export function VoiceInput({
  onTranscript,
  isProcessing = false,
  compact = false,
  buttonLabel = "Voice Command",
  className = "",
}) {
  const {
    transcript,
    interimTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // When speech transcript arrives, forward it to the parent handler
  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Determine current component state
  const currentState = isProcessing
    ? "PROCESSING"
    : isListening
    ? "LISTENING"
    : error
    ? "ERROR"
    : "READY";

  if (compact) {
    return (
      <div className={`voice-input-compact-wrapper ${className}`}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!isSupported || isProcessing}
          className={`btn-mic-compact ${isListening ? "listening active" : ""} ${
            isProcessing ? "processing" : ""
          } ${error ? "has-error" : ""}`}
          title={
            !isSupported
              ? "Speech recognition not supported in this browser"
              : isListening
              ? "Listening... Click to stop"
              : "Click to speak voice command"
          }
        >
          {isProcessing ? (
            <Loader2 size={16} className="spin-animation text-cyan" />
          ) : isListening ? (
            <div className="mic-pulse-container">
              <span className="pulse-ring pulse-ring-1" />
              <span className="pulse-ring pulse-ring-2" />
              <Mic size={16} className="mic-active-icon" />
            </div>
          ) : (
            <Mic size={16} />
          )}
        </button>

        {isListening && (interimTranscript || "Listening...") && (
          <div className="voice-interim-floating">
            <span className="live-dot" />
            <span>{interimTranscript || "Listening..."}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`voice-input-container ${isListening ? "state-listening" : ""} ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!isSupported || isProcessing}
        className={`voice-command-button ${
          isListening ? "btn-voice-listening" : isProcessing ? "btn-voice-processing" : "btn-voice-ready"
        }`}
      >
        <div className="voice-icon-wrapper">
          {isProcessing ? (
            <Loader2 size={18} className="spin-animation" />
          ) : isListening ? (
            <div className="mic-radar">
              <span className="radar-wave wave-1" />
              <span className="radar-wave wave-2" />
              <span className="radar-wave wave-3" />
              <Mic size={18} className="mic-live" />
            </div>
          ) : (
            <Mic size={18} />
          )}
        </div>

        <div className="voice-btn-text">
          <span className="voice-btn-title">{buttonLabel}</span>
          <span className="voice-btn-state">
            {currentState === "LISTENING" && (
              <span className="state-text state-listening-text">
                <span className="live-pulse-dot" /> LISTENING...
              </span>
            )}
            {currentState === "PROCESSING" && (
              <span className="state-text state-proc-text">ANALYZING...</span>
            )}
            {currentState === "READY" && (
              <span className="state-text state-ready-text">READY</span>
            )}
            {currentState === "ERROR" && (
              <span className="state-text state-error-text">ERROR</span>
            )}
          </span>
        </div>
      </button>

      {/* Live speech feedback display */}
      {isListening && (
        <div className="speech-live-card">
          <div className="speech-live-header">
            <span className="recording-indicator" />
            <span className="speech-header-title">VOICE CAPTURE ACTIVE</span>
          </div>
          <p className="speech-live-text">
            {interimTranscript || transcript || "Speak surgical query (e.g., 'Show me the MRI report for patient P001')..."}
          </p>
        </div>
      )}

      {error && !isListening && (
        <div className="speech-error-card">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
