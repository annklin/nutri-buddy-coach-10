import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { initAdMob, showInterstitialAd } from '@/lib/admob';
import { Settings, Camera, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import CircleProgress from '@/components/CircleProgress';
import FoodEntryDialog from '@/components/FoodEntryDialog';
import FoodDetailSheet from '@/components/FoodDetailSheet';
import SettingsDialog from '@/components/SettingsDialog';
import AdDialog from '@/components/AdDialog';
import InfoBalloon from '@/components/InfoBalloon';
import { SteakIcon, OilDropIcon, SugarCubesIcon } from '@/components/MacroIcons';
import { getProfile, getTodayTotals, getTodayEntries, deleteEntry } from '@/lib/storage';
import { calculateDailyMacroGoals } from '@/lib/calories';
import { useNavigate } from 'react-router-dom';
import { MASCOT_LOGO } from '@/lib/mascot';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {

  const navigate = useNavigate();
  const { t } = useLanguage();

  const profile = getProfile()!;
  const [, setRefresh] = useState(0);
  const refresh = useCallback(() => setRefresh(r => r + 1), []);

  const [showFoodEntry, setShowFoodEntry] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const [balloon, setBalloon] = useState<string | null>(null);
  const [entryMode, setEntryMode] = useState<'text' | 'photo'>('text');

  useEffect(() => {
    initAdMob();
  }, []);

  const handleShowAd = useCallback(async () => {

    const shown = await showInterstitialAd();

    if (!shown) {
      setShowAd(true);
    }

  }, []);

  const totals = getTodayTotals();
  const goals = calculateDailyMacroGoals(profile.dailyCalorieGoal);
  const todayEntries = getTodayEntries();

  const remaining = profile.dailyCalorieGoal - totals.calories;

  const percentage = Math.min(
    Math.round((totals.calories / profile.dailyCalorieGoal) * 100),
    100
  );

  const balloonData: Record<string, { title: string; description: string; color: string }> = {

    protein: {
      title: t('dash_protein'),
      description: t('dash_proteinDesc'),
      color: 'hsl(var(--protein))'
    },

    fat: {
      title: t('dash_fat'),
      description: t('dash_fatDesc'),
      color: 'hsl(var(--fat))'
    },

    sugar: {
      title: t('dash_sugar'),
      description: t('dash_sugarDesc'),
      color: 'hsl(var(--sugar))'
    }

  };

  return (

    <div className="min-h-[100dvh] bg-background pb-20">

      <div className="hero-header px-5 pt-8 pb-28 relative overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative z-10">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">

              <img
                src={MASCOT_LOGO}
                alt="Logo"
                className="w-10 h-10 rounded-xl"
              />

              <div>

                <p className="text-xs text-white/70 font-semibold">
                  {t('dash_hello')}
                </p>

                <h1 className="text-lg font-extrabold text-white">
                  {profile.name}
                </h1>

              </div>

            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors"
            >

              <Settings className="w-5 h-5 text-white" />

            </button>

          </div>

          <div className="text-center">

            <p className="text-sm text-white/70 font-semibold">
              {t('dash_todayCalories')}
            </p>

            <p className="text-5xl font-extrabold text-white mt-1">
              {totals.calories}
            </p>

            <p className="text-sm text-white/70 font-semibold mt-1">
              {t('dash_of', { goal: profile.dailyCalorieGoal })}
            </p>

          </div>

        </div>

      </div>

      <div className="px-5 -mt-16 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[1.75rem] shadow-elevated border border-border p-8"
        >

          <div className="flex justify-center">

            <CircleProgress
              value={percentage}
              max={100}
              size={180}
              strokeWidth={14}
              color="hsl(var(--primary))"
              trackColor="hsl(var(--muted))"
              label=""
              unit={t('dash_ofGoal')}
              displayText={`${percentage}%`}
            />

          </div>

          <p className="text-center text-muted-foreground text-sm font-bold mt-3">

            {remaining <= 0
              ? t('dash_goalReached')
              : t('dash_remaining', { remaining })
            }

          </p>

        </motion.div>

      </div>

      <div className="px-5 mt-4">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[1.75rem] shadow-elevated border border-border p-5"
        >

          <button
            onClick={() => setShowDetail(true)}
            className="flex items-center justify-between w-full mb-4"
          >

            <h2 className="text-base font-bold text-muted-foreground">
              {t('dash_macros')}
            </h2>

            <ChevronRight className="w-4 h-4 text-muted-foreground" />

          </button>

          <div className="flex justify-around">

            <CircleProgress
              value={totals.protein}
              max={goals.protein}
              size={90}
              strokeWidth={8}
              color="hsl(var(--protein))"
              icon={<SteakIcon size={22} className="text-protein" />}
              macroLabel={`${Math.round(totals.protein)}g`}
              macroGoal={t('dash_of_g', { goal: goals.protein })}
            />

            <CircleProgress
              value={totals.fat}
              max={goals.fat}
              size={90}
              strokeWidth={8}
              color="hsl(var(--fat))"
              icon={<OilDropIcon size={22} className="text-fat" />}
              macroLabel={`${Math.round(totals.fat)}g`}
              macroGoal={t('dash_of_g', { goal: goals.fat })}
            />

            <CircleProgress
              value={totals.sugar}
              max={goals.sugar}
              size={90}
              strokeWidth={8}
              color="hsl(var(--sugar))"
              icon={<SugarCubesIcon size={22} className="text-sugar" />}
              macroLabel={`${Math.round(totals.sugar)}g`}
              macroGoal={t('dash_of_g', { goal: goals.sugar })}
            />

          </div>

        </motion.div>

      </div>

      {/* restante do código permanece igual */}

      <FoodEntryDialog
        open={showFoodEntry}
        onClose={() => setShowFoodEntry(false)}
        onAdded={refresh}
        dailyGoal={profile.dailyCalorieGoal}
        onShowAd={handleShowAd}
      />

      <FoodDetailSheet
        open={showDetail}
        onClose={() => setShowDetail(false)}
        dailyGoal={profile.dailyCalorieGoal}
        onUpdate={refresh}
      />

      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdate={refresh}
      />

      <AdDialog
        open={showAd}
        onClose={() => setShowAd(false)}
        onPremium={() => {
          setShowAd(false);
          navigate('/premium');
        }}
      />

    </div>

  );

};

export default Dashboard;
