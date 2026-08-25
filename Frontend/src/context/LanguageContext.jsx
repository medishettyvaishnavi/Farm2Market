import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("farm2market_lang") || "te"; // Default to Telugu as primary local language, or saved
  });

  useEffect(() => {
    localStorage.setItem("farm2market_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    if (!translations[language]) return translations.en[key] || key;
    return translations[language][key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
