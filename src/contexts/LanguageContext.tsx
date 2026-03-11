import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, getSavedLanguage, saveLanguage, getDefaultLanguage, t as translate } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  hasLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const saved = getSavedLanguage();
  const [language, setLang] = useState<Language>(saved || getDefaultLanguage());
  const hasLanguage = !!saved;

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    saveLanguage(lang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translate(key, language, params);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, hasLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
