import { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en';
import fr from '../locales/fr';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const urlLanguage = new URLSearchParams(window.location.search).get('lang');
    if (urlLanguage === 'fr' || urlLanguage === 'en') return urlLanguage;
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const chooseLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLanguage);
    window.history.replaceState(window.history.state, '', url);
  };

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
    <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// The provider and its hook intentionally share the context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
