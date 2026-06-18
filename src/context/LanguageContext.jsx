import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en';
import fr from '../locales/fr';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check local storage or default to 'en'
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    // Optionally update document lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = language === 'fr' ? fr : en;
    
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    
    // Fallback to English if translation is missing
    if (value === undefined && language !== 'en') {
      let fallbackValue = en;
      for (const k of keys) {
        if (fallbackValue === undefined) break;
        fallbackValue = fallbackValue[k];
      }
      return fallbackValue || key;
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
