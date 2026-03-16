import React, { useEffect, useState } from "react";
import { showRewardedAd } from "@/lib/admob";

interface IndexProps {
  isPremium: boolean;
}

interface Alimento {
  id: number;
  nome: string;
  macronutrientes: string;
}

const alimentos: Alimento[] = [
  { id: 1, nome: "Maçã", macronutrientes: "Carbs: 14g, Proteína: 0.3g, Gordura: 0.2g" },
  { id: 2, nome: "Ovo", macronutrientes: "Carbs: 1g, Proteína: 6g, Gordura: 5g" },
  { id: 3, nome: "Banana", macronutrientes: "Carbs: 23g, Proteína: 1g, Gordura: 0.3g" },
  { id: 4, nome: "Peito de Frango", macronutrientes: "Carbs: 0g, Proteína: 31g, Gordura: 3.6g" },
  { id: 5, nome: "Aveia", macronutrientes: "Carbs: 12g, Proteína: 2.5g, Gordura: 1.5g" },
];

const Index: React.FC<IndexProps> = ({ isPremium }) => {
  const [alimentosLiberados, setAlimentosLiberados] = useState<number[]>([]);
  const MAX_ANUNCIOS = 5;
  const [anunciosAssistidos, setAnunciosAssistidos] = useState(0);

  // Função para liberar alimento após anúncio
  const liberarAlimento = async (id: number) => {
    if (isPremium) {
      if (!alimentosLiberados.includes(id)) {
        setAlimentosLiberados(prev => [...prev, id]);
      }
      return;
    }

    if (anunciosAssistidos >= MAX_ANUNCIOS) {
      alert("Máximo de anúncios atingido. Aguarde.");
      return;
    }

    const sucesso = await showRewardedAd();
    if (sucesso) {
      setAnunciosAssistidos(prev => prev + 1);
      setAlimentosLiberados(prev => [...prev, id]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Alimentos</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {alimentos.map(al => (
          <div key={al.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <strong>{al.nome}</strong>
            <div>
              {isPremium || alimentosLiberados.includes(al.id) ? (
                <p>{al.macronutrientes}</p>
              ) : (
                <button onClick={() => liberarAlimento(al.id)}>
                  Assistir anúncio para liberar macronutrientes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
