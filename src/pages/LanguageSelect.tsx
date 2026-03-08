import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LANGUAGES, Language, detectDeviceLanguage } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectProps {
  onComplete: () => void;
}

const LanguageSelect = ({ onComplete }: LanguageSelectProps) => {
  const { setLanguage, t } = useLanguage();
  const detected = detectDeviceLanguage();
  const [selected, setSelected] = useState<Language>(detected);

  const handleContinue = () => {
    setLanguage(selected);
    onComplete();
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center px-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mt-8 mb-4"
      >
        <Globe className="w-8 h-8 text-primary-foreground" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-black text-foreground mb-1 text-center"
      >
        {t('langSelect_title')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6 text-center"
      >
        {t('langSelect_subtitle')}
      </motion.p>

      <div className="w-full max-w-sm flex-1 overflow-y-auto space-y-2 pb-24">
        {LANGUAGES.map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
              selected === lang.code
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-foreground">{lang.nativeName}</p>
              <p className="text-xs text-muted-foreground">{lang.name}</p>
            </div>
            {lang.code === detected && (
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {t('langSelect_detected')}
              </span>
            )}
            {selected === lang.code && (
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={handleContinue}
          className="w-full max-w-sm mx-auto h-12 gradient-primary text-primary-foreground font-bold text-base block"
        >
          {t('langSelect_continue')}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelect;
