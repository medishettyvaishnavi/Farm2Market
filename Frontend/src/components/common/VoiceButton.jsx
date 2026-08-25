import { useState } from "react";
import { FaMicrophone, FaVolumeUp, FaStop } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import {
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
} from "../../services/voiceService";

export default function VoiceButton({
  onTranscript,
  textToSpeak,
  mode = "listen", // 'listen' | 'speak'
  label,
  className = "",
}) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = () => {
    if (isListening) return;

    const recognizer = createSpeechRecognizer({
      lang: language,
      onStart: () => setIsListening(true),
      onResult: (text) => {
        onTranscript && onTranscript(text);
        setIsListening(false);
      },
      onError: (err) => {
        console.warn("Speech error:", err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false),
    });

    if (recognizer) {
      try {
        recognizer.start();
      } catch (e) {
        console.error("Recognizer start error:", e);
        setIsListening(false);
      }
    } else {
      alert("Voice input is not supported in this browser. Please use Chrome/Edge.");
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (textToSpeak) {
      setIsSpeaking(true);
      speakText(textToSpeak, language);
      // reset state after speech estimate
      setTimeout(() => setIsSpeaking(false), 6000);
    }
  };

  if (mode === "speak") {
    return (
      <button
        type="button"
        className={`btn btn-outline-success btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill shadow-sm ${className}`}
        onClick={handleSpeak}
        title={t("speakSummary")}
      >
        {isSpeaking ? (
          <>
            <FaStop className="text-danger animate-pulse" />
            <span className="text-danger">Stop Audio</span>
          </>
        ) : (
          <>
            <FaVolumeUp className="text-success" />
            <span>{label || t("speakSummary")}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn ${
        isListening ? "btn-danger" : "btn-success"
      } btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-bold rounded-pill shadow-sm ${className}`}
      onClick={handleListen}
      title={isListening ? t("listening") : t("voiceSearch")}
    >
      <FaMicrophone className={isListening ? "animate-bounce" : ""} />
      <span>{isListening ? t("listening") : label || t("voiceSearch")}</span>
    </button>
  );
}
