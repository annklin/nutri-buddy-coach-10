import React, { useEffect, useState } from "react";

const Index: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const premiumStatus = localStorage.getItem("premium_user") === "true";
    setIsPremium(premiumStatus);
  }, []);

  return (
    <div className="container">
      <h1>Bem-vindo ao NutriBuddy!</h1>

      {!isPremium && (
        <div className="ad-container">
          <p>Assistir anúncio para ver macronutrientes</p>
        </div>
      )}

      {isPremium && (
        <div className="premium-content">
          <p>Conteúdo Premium liberado</p>
        </div>
      )}

      <section>
        <h2>Suas estatísticas</h2>
        <p>Aqui você vê calorias e macronutrientes detalhados.</p>
      </section>
    </div>
  );
};

export default Index;
