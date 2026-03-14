import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Zap, Loader2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Premium = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);

  const comprarPlano = async (plan: 'mensal' | 'anual') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout error');
      }
    } catch (err: any) {
      toast({
        title: t('prem_paymentError'),
        description: err.message || t('prem_tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    t('prem_noAds'),
    t('prem_noInterstitials'),
    t('prem_instantMacros'),
  ];

  const plans = {
    monthly: {
      label: t('prem_monthly'),
      price: 'R$ 19,90',
      period: t('prem_perMonth'),
      totalYear: 'R$ 238,80/ano',
    },
    annual: {
      label: t('prem_annual'),
      price: 'R$ 2,49',
      period: t('prem_perMonth'),
      subtitle: t('prem_annualSubtitle'),
      totalYear: 'R$ 29,90/ano',
      savings: t('prem_annualSavings'),
    },
  };

  return (
    <div className="min-h-screen bg-background px-5 pt-6 pb-8 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-accent-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t('prem_title')}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg"
        >
          <Crown className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-sm"
        >
          <div className="bg-card rounded-2xl p-6 shadow-card border border-primary/20 mb-4">
            <h2 className="text-2xl font-black text-foreground mb-1">{t('prem_name')}</h2>
            <p className="text-muted-foreground text-sm mb-5">{t('prem_adFreeDesc')}</p>
            <div className="space-y-3 text-left">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <p className="text-xs font-bold text-muted-foreground mb-1">{plans.monthly.label}</p>
              <p className="text-xl font-black text-foreground">{plans.monthly.price}</p>
              <p className="text-xs text-muted-foreground">{plans.monthly.period}</p>
            </button>

            <button
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === 'annual'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <Badge className="absolute -top-2.5 right-2 bg-destructive text-destructive-foreground text-[10px] font-black px-2 py-0.5">
                90% OFF
              </Badge>
              <p className="text-xs font-bold text-muted-foreground mb-1">{plans.annual.label}</p>
              <p className="text-xl font-black text-foreground">{plans.annual.price}</p>
              <p className="text-xs text-muted-foreground">{plans.annual.period}</p>
            </button>
          </div>

          <motion.div
            key={selectedPlan}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-4 shadow-card border border-border mb-4"
          >
            {selectedPlan === 'annual' ? (
              <div className="space-y-1.5 text-center">
                <p className="text-sm font-bold text-foreground">{plans.annual.subtitle}</p>
                <p className="text-xs text-muted-foreground line-through">{t('prem_monthly')}: {plans.monthly.totalYear}</p>
                <p className="text-xs font-bold text-primary flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {plans.annual.savings}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">{t('prem_monthlyBilled', { price: plans.monthly.price })}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('prem_total', { total: plans.monthly.totalYear })}</p>
              </div>
            )}
          </motion.div>

          <Button
            onClick={() => comprarPlano(selectedPlan === 'annual' ? 'anual' : 'mensal')}
            disabled={loading}
            className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('prem_subscribe')}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">{t('prem_securePayment')}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;
