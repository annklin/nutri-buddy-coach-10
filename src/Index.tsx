import React, { useState } from "react";

interface IndexProps {
  isPremium: boolean;
  liberarAlimento: (id: number) => Promise<boolean>;
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

const Index: React.FC<IndexProps> = ({ isPremium, liberarAlimento }) => {
  const [alimentosLiberados, setAlimentosLiberados] = useState<number[]>([]);

  const handleLiberar = async (id: number) => {
    const sucesso = await liberarAlimento(id);
    if (sucesso && !alimentosLiberados.includes(id)) {
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
                <button onClick={() => handleLiberar(al.id)}>
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
