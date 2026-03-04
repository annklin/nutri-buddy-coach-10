import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { setPremium } from '@/lib/storage';
import RabbitMascot from '@/components/RabbitMascot';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setPremium(true);
  }, []);

  return (
    <div className="min-h-screen bg-background px-5 pt-6 pb-8 flex flex-col items-center justify-center text-center">
      <RabbitMascot message="Parabéns! 🎉" size={90} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">Premium Ativado!</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Seu pagamento foi confirmado. Aproveite todos os benefícios Premium sem anúncios!
        </p>
        <Button
          onClick={() => navigate('/')}
          className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base"
        >
          Ir para o início
        </Button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
