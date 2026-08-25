// Voice Service: Speech-to-Text & Text-to-Speech integration for Telugu, Hindi, English

const langCodeMap = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-IN",
};

// Check if Speech Recognition is supported
export const isSpeechRecognitionSupported = () => {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
};

// Check if Speech Synthesis (TTS) is supported
export const isSpeechSynthesisSupported = () => {
  return "speechSynthesis" in window;
};

// Speak text out loud in chosen language
export const speakText = (text, lang = "te") => {
  if (!isSpeechSynthesisSupported()) {
    console.warn("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCodeMap[lang] || "en-IN";
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Attempt to select a regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase() === (langCodeMap[lang] || "en-in").toLowerCase()
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Stop TTS speech
export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Listen for speech input (Speech-to-Text)
export const createSpeechRecognizer = ({
  lang = "te",
  onResult,
  onError,
  onStart,
  onEnd,
}) => {
  if (!isSpeechRecognitionSupported()) {
    onError && onError("Speech Recognition not supported in this browser.");
    return null;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = langCodeMap[lang] || "en-IN";

  recognition.onstart = () => {
    onStart && onStart();
  };

  recognition.onresult = (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      onResult && onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition error:", event.error);
    onError && onError(event.error);
  };

  recognition.onend = () => {
    onEnd && onEnd();
  };

  return recognition;
};
