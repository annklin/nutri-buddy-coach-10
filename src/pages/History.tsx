import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEntriesForWeek, getProfile, isPremium, getEntries } from '@/lib/storage';
import { FoodEntry } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const History = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const profile = getProfile();
  const premium = isPremium();

  const groupedEntries = useMemo(() => {
    const entries = premium
      ? getEntries().filter(e => {
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return new Date(e.date) >= monthAgo;
        })
      : getEntriesForWeek();

    const groups: Record<string, FoodEntry[]> = {};
    entries.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a));
  }, [premium]);

  const localeMap: Record<string, string> = {
    'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR',
    de: 'de-DE', it: 'it-IT', ru: 'ru-RU', zh: 'zh-CN',
    ja: 'ja-JP', ko: 'ko-KR', ar: 'ar-SA', hi: 'hi-IN',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return t('hist_today');
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === yesterday) return t('hist_yesterday');
    return date.toLocaleDateString(localeMap[language] || 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background px-5 pt-6 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-accent-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t('hist_title')}</h1>
        {!premium && (
          <span className="ml-auto text-xs bg-accent px-2.5 py-1 rounded-full font-semibold text-muted-foreground">
            {t('hist_days7')}
          </span>
        )}
        {premium && (
          <span className="ml-auto text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
            {t('hist_days30')}
          </span>
        )}
      </div>

      {!premium && (
        <button
          onClick={() => navigate('/premium')}
          className="w-full mb-4 p-3 bg-accent rounded-xl text-center"
        >
          <p className="text-sm font-bold text-foreground">{t('hist_bePremium')}</p>
          <p className="text-xs text-muted-foreground">{t('hist_fullHistory')}</p>
        </button>
      )}

      {groupedEntries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🥕</p>
          <p className="text-muted-foreground font-semibold">{t('hist_noRecords')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedEntries.map(([date, entries]) => {
            const dayCalories = entries.reduce((s, e) => s + e.nutrients.calories, 0);
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-foreground">{formatDate(date)}</h3>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {dayCalories} / {profile?.dailyCalorieGoal} kcal
                  </span>
                </div>
                <div className="space-y-2">
                  {entries.map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-card rounded-xl shadow-card border border-border"
                    >
                      <div>
                        <p className="text-sm font-bold text-foreground capitalize">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{entry.nutrients.calories} kcal</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
