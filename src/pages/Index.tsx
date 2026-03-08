import { useState, useEffect } from 'react';
import { getProfile } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelect from '@/pages/LanguageSelect';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';

const Index = () => {
  const { hasLanguage } = useLanguage();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [languageSelected, setLanguageSelected] = useState(hasLanguage);

  useEffect(() => {
    setHasProfile(!!getProfile());
  }, []);

  if (hasProfile === null) return null;

  if (!languageSelected) {
    return <LanguageSelect onComplete={() => setLanguageSelected(true)} />;
  }

  if (!hasProfile) {
    return <Onboarding onComplete={() => setHasProfile(true)} />;
  }

  return <Dashboard />;
};

export default Index;
