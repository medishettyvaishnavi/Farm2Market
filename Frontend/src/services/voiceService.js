// Voice Service: Speech-to-Text & Text-to-Speech integration for Telugu, Hindi, English

const langCodeMap = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-IN",
};

const getVoiceLanguage = (language) => langCodeMap[language] || "en-IN";

const numberWords = {
  te: [
    "సున్నా", "ఒకటి", "రెండు", "మూడు", "నాలుగు", "ఐదు", "ఆరు", "ఏడు", "ఎనిమిది", "తొమ్మిది",
    "పది", "పదకొండు", "పన్నెండు", "పదమూడు", "పద్నాలుగు", "పదిహేను", "పదహారు", "పదిహేడు", "పద్దెనిమిది", "పంతొమ్మిది",
  ],
  hi: [
    "शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ",
    "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस",
  ],
  en: [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ],
};

const tensWords = {
  te: ["", "", "ఇరవై", "ముప్పై", "నలభై", "యాభై", "అరవై", "డెబ్బై", "ఎనభై", "తొంభై"],
  hi: ["", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"],
  en: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
};

const numberToWordsUnder100 = (value, language) => {
  if (value < 20) return numberWords[language][value];
  const tens = tensWords[language][Math.floor(value / 10)];
  return value % 10 ? `${tens} ${numberWords[language][value % 10]}` : tens;
};

const numberToWords = (value, language) => {
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) return String(value);
  if (value < 100) return numberToWordsUnder100(value, language);

  const hundreds = language === "te" ? "వంద" : language === "hi" ? "सौ" : "hundred";
  const thousand = language === "te" ? "వెయ్యి" : language === "hi" ? "हजार" : "thousand";
  const lakh = language === "te" ? "లక్ష" : language === "hi" ? "लाख" : "lakh";

  if (value < 1000) {
    const prefix = numberToWordsUnder100(Math.floor(value / 100), language);
    return `${prefix} ${hundreds}${value % 100 ? ` ${numberToWordsUnder100(value % 100, language)}` : ""}`;
  }
  if (value < 100000) {
    const prefix = numberToWordsUnder100(Math.floor(value / 1000), language);
    return `${prefix} ${thousand}${value % 1000 ? ` ${numberToWords(value % 1000, language)}` : ""}`;
  }
  if (value < 10000000) {
    const prefix = numberToWords(value / 100000 | 0, language);
    return `${prefix} ${lakh}${value % 100000 ? ` ${numberToWords(value % 100000, language)}` : ""}`;
  }
  return String(value);
};

export const formatNumberForSpeech = (value, language = "te") => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "";
  return language === "en" ? numericValue.toLocaleString("en-IN") : numberToWords(numericValue, language);
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
  const voiceLanguage = getVoiceLanguage(lang);
  utterance.lang = voiceLanguage;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Attempt to select a regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase() === voiceLanguage.toLowerCase()
  ) || voices.find(
    (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase())
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
  recognition.lang = getVoiceLanguage(lang);

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
