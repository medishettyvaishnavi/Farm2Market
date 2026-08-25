import { useLanguage } from "../../context/LanguageContext";
import { FaGlobe, FaCheck } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "te", label: "తెలుగు", subtitle: "Telugu" },
  { code: "hi", label: "हिन्दी", subtitle: "Hindi" },
  { code: "en", label: "English", subtitle: "English" },
];

export default function LanguageSelector({ variant = "dropdown" }) {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  if (variant === "pills") {
    return (
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <span className="small text-muted fw-semibold me-1 d-flex align-items-center gap-1">
          <FaGlobe className="text-success" /> భాష / Language:
        </span>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`btn btn-sm px-3 py-1 fw-bold ${
              language === l.code
                ? "btn-success shadow-sm"
                : "btn-outline-secondary bg-white"
            }`}
            style={{ borderRadius: "20px" }}
            onClick={() => changeLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm bg-white"
        style={{ borderRadius: "25px", border: "1.5px solid #198754" }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
      >
        <FaGlobe className="text-success fs-6" />
        <span>{currentLangObj.label}</span>
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 card shadow-lg p-2 border-0"
          style={{
            zIndex: 1050,
            width: "180px",
            borderRadius: "14px",
            background: "#ffffff",
          }}
        >
          <div className="small text-muted px-2 py-1 fw-semibold border-bottom mb-1">
            భాష ఎంచుకోండి / Select
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`dropdown-item d-flex align-items-center justify-content-between px-2 py-2 rounded ${
                language === l.code ? "bg-success text-white fw-bold" : "text-dark"
              }`}
              onClick={() => {
                changeLanguage(l.code);
                setIsOpen(false);
              }}
            >
              <div>
                <div>{l.label}</div>
                <div
                  className={`small ${
                    language === l.code ? "text-light" : "text-muted"
                  }`}
                  style={{ fontSize: "0.75rem" }}
                >
                  {l.subtitle}
                </div>
              </div>
              {language === l.code && <FaCheck className="ms-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
