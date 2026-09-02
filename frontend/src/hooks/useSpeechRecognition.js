import { useEffect, useRef, useState, useCallback } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      setInterimTranscript("");
    };

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) {
        setTranscript(final.trim());
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim.trim());
      }
    };

    recognition.onerror = (event) => {
      // Don't treat no-speech as fatal hard error
      if (event.error === "no-speech") {
        setError("No speech detected. Please speak into your microphone.");
      } else if (event.error === "not-allowed") {
        setError("Microphone access denied. Please enable microphone permissions in browser.");
      } else {
        setError(`Speech recognition: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError(
        isSupported
          ? "Speech recognition is initializing..."
          : "Speech recognition is not supported in this browser (Web Speech API required)."
      );
      return;
    }

    setTranscript("");
    setInterimTranscript("");
    setError("");
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn("Speech recognition start warning:", err);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Speech recognition stop warning:", err);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError("");
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;
