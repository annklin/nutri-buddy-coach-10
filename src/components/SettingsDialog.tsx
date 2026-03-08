import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Crown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getProfile, saveProfile } from '@/lib/storage';
import { getTheme, setTheme } from '@/lib/theme';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES, Language } from '@/lib/i18n';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const SettingsDialog = ({ open, onClose, onUpdate }: SettingsDialogProps) => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const profile = getProfile();
  const [calorieGoal, setCalorieGoal] = useState(profile?.dailyCalorieGoal.toString() || '2000');
  const [name, setName] = useState(profile?.name || '');
  const [dark, setDark] = useState(getTheme() === 'dark');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === language);

  const handleToggleDark = () => {
    const next = !dark;
    setDark(next);
    setTheme(next ? 'dark' : 'light');
  };

  const handleSave = () => {
    if (!profile) return;
    const goal = parseInt(calorieGoal);
    if (goal > 500 && goal < 10000 && name.trim().length > 0) {
      saveProfile({ ...profile, dailyCalorieGoal: goal, name: name.trim() });
      onUpdate();
      onClose();
    }
  };

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setShowLangPicker(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-soft max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">{t('set_title')}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Language */}
            {!showLangPicker ? (
              <button
                onClick={() => setShowLangPicker(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
              >
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('set_language')}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentLang?.flag} {currentLang?.nativeName}
                </span>
              </button>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-accent/30 rounded-xl">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                      lang.code === language ? 'bg-primary/10 border border-primary/30' : 'hover:bg-accent'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-semibold text-foreground">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Dark mode */}
            <button
              onClick={handleToggleDark}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
            >
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {t('set_darkMode')}
              </span>
              <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${dark ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full bg-primary-foreground transition-transform ${dark ? 'translate-x-4' : ''}`} />
              </div>
            </button>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold">{t('set_name')}</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-11"
                maxLength={30}
              />
            </div>

            {/* Calorie goal */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold">{t('set_calorieGoal')}</Label>
              <Input
                type="number"
                value={calorieGoal}
                onChange={e => setCalorieGoal(e.target.value)}
                className="h-11"
                min={500}
                max={10000}
              />
            </div>

            {/* Premium */}
            <button
              onClick={() => { onClose(); navigate('/premium'); }}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{t('set_premium')}</span>
            </button>
          </div>

          <Button onClick={handleSave} className="w-full h-11 gradient-primary text-primary-foreground font-bold mt-5">
            {t('set_save')}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsDialog;
