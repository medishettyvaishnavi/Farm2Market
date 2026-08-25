import { useState, useContext } from "react";
import { FaMicrophone, FaVolumeUp, FaStop } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import {
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
} from "../../services/voiceService";
import { FarmerDataContext } from "../../context/FarmerDataContext";

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

  // Safely consume context if available
  const farmerDataContext = useContext(FarmerDataContext);

  const handleVoiceAssistant = (text) => {
    const q = text.toLowerCase();
    const lang = language; // 'en', 'te', 'hi'
    const orders = farmerDataContext ? farmerDataContext.orders || [] : [];

    const activeOrders = orders.filter(
      (o) => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled"
    );
    const latestActive = activeOrders[0];
    const latestOrder = orders[0];

    const getCleanCropName = (name) => (name ? name.split(" (")[0] : "");

    // 1. Where is my order?
    if (
      (q.includes("where") && q.includes("order")) ||
      q.includes("ఆర్డర్ ఎక్కడ") ||
      q.includes("ऑर्डर कहां")
    ) {
      if (latestActive) {
        const crop = getCleanCropName(latestActive.cropName);
        const date = latestActive.expectedDeliveryDate || "3 days";
        if (lang === "te") {
          speakText(
            `మీ ${crop} ఆర్డర్ ప్రస్తుతం ప్రయాణంలో ఉంది మరియు ${date} లోపు డెలివరీ చేయబడుతుంది.`,
            "te"
          );
        } else if (lang === "hi") {
          speakText(
            `आपका ${crop} का ऑर्डर अभी रास्ते में है और ${date} तक डिलीवर हो जाएगा.`,
            "hi"
          );
        } else {
          speakText(
            `Your order for ${crop} is currently in transit and will be delivered by ${date}.`,
            "en"
          );
        }
      } else {
        if (lang === "te") speakText("ప్రస్తుతం మీకు ఎలాంటి క్రియాశీల ఆర్డర్‌లు లేవు.", "te");
        else if (lang === "hi") speakText("अभी आपके पास कोई सक्रिय ऑर्डर नहीं है.", "hi");
        else speakText("You do not have any active orders right now.", "en");
      }
      return true;
    }

    // 2. Has my buyer paid?
    if (
      q.includes("paid") ||
      q.includes("pay") ||
      q.includes("చెల్లించారా") ||
      q.includes("భాగస్వామి చెల్లించారా") ||
      q.includes("भुगतान")
    ) {
      if (latestOrder) {
        const isPaid = latestOrder.status === "paid" || latestOrder.status === "completed";
        if (isPaid) {
          if (lang === "te")
            speakText(
              "అవును, మీ కొనుగోలుదారు చెల్లించారు. నగదు బ్యాంక్ ఖాతాలో జమ చేయబడింది.",
              "te"
            );
          else if (lang === "hi")
            speakText("हाँ, आपके खरीदार ने भुगतान कर दिया है. भुगतान सफल रहा.", "hi");
          else speakText("Yes, your buyer has paid. Payout has been settled.", "en");
        } else {
          if (lang === "te") speakText("లేదు, మీ ఆర్డర్ కోసం చెల్లింపు పెండింగ్‌లో ఉంది.", "te");
          else if (lang === "hi") speakText("नहीं, आपके ऑर्डर के लिए भुगतान अभी लंबित है.", "hi");
          else speakText("No, payment is pending for your order.", "en");
        }
      } else {
        if (lang === "te") speakText("ప్రస్తుతం ఎలాంటి ఆర్డర్‌లు లేవు.", "te");
        else if (lang === "hi") speakText("कोई ऑर्डर नहीं मिला.", "hi");
        else speakText("No orders found.", "en");
      }
      return true;
    }

    // 3. How much did I earn?
    if (
      q.includes("earn") ||
      q.includes("money") ||
      q.includes("నేను ఎంత సంపాదించాను") ||
      q.includes("ఎంత సంపాదన") ||
      q.includes("कितना कमाया") ||
      q.includes("कमाई")
    ) {
      const completedOrders = orders.filter((o) => o.status === "paid" || o.status === "completed");
      const actual = completedOrders.reduce(
        (acc, curr) => acc + (curr.estimatedNetEarnings || curr.totalAmount),
        0
      );
      const estimated = orders
        .filter((o) => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled")
        .reduce((acc, curr) => acc + (curr.estimatedNetEarnings || curr.totalAmount), 0);

      if (lang === "te") {
        speakText(
          `మీరు ఇప్పటివరకు ₹${actual.toLocaleString()} సంపాదించారు, మరియు ₹${estimated.toLocaleString()} పెండింగ్‌లో ఉంది.`,
          "te"
        );
      } else if (lang === "hi") {
        speakText(
          `आपने कुल ₹${actual.toLocaleString()} कमाए हैं, और ₹${estimated.toLocaleString()} आना बाकी है.`,
          "hi"
        );
      } else {
        speakText(
          `You have earned a total payout of ${actual} rupees, and have ${estimated} rupees estimated pending payout.`,
          "en"
        );
      }
      return true;
    }

    // 4. When will my crop be delivered?
    if (
      q.includes("delivery") ||
      q.includes("delivered") ||
      q.includes("డెలివరీ") ||
      q.includes("ఫసల్ కబ్") ||
      q.includes("పంట ఎప్పుడు డెలివరీ")
    ) {
      if (latestActive) {
        const crop = getCleanCropName(latestActive.cropName);
        const date = latestActive.expectedDeliveryDate || "3 days";
        if (lang === "te") {
          speakText(`మీ ${crop} పంట ${date} న డెలివరీ చేయబడుతుందని భావిస్తున్నారు.`, "te");
        } else if (lang === "hi") {
          speakText(`आपकी ${crop} फसल ${date} को डिलीवर होने की उम्मीद है.`, "hi");
        } else {
          speakText(`Your ${crop} crop is expected to be delivered on ${date}.`, "en");
        }
      } else {
        if (lang === "te") speakText("క్రియాశీల పంట డెలివరీ కనుగొనబడలేదు.", "te");
        else if (lang === "hi") speakText("कोई सक्रिय फसल डिलीवरी नहीं मिली.", "hi");
        else speakText("No active delivery tracking found.", "en");
      }
      return true;
    }

    return false;
  };

  const handleListen = () => {
    if (isListening) return;

    const recognizer = createSpeechRecognizer({
      lang: language,
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setIsListening(false);
        const handled = handleVoiceAssistant(text);
        if (!handled && onTranscript) {
          onTranscript(text);
        }
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
