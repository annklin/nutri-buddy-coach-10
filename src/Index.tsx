import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { showRewardedAd } from "../lib/admob";

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
  const [liberados, setLiberados] = useState<number[]>([]);
  const [anunciosAssistidos, setAnunciosAssistidos] = useState(0);
  const MAX_ANUNCIOS = 5;

  const handleLiberar = async (id: number) => {
    if (isPremium || liberados.includes(id)) return;
    if (anunciosAssistidos >= MAX_ANUNCIOS) return;

    const sucesso = await showRewardedAd();
    if (sucesso) {
      setLiberados(prev => [...prev, id]);
      setAnunciosAssistidos(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {alimentos.map(a => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.nome}>{a.nome}</Text>
          {isPremium || liberados.includes(a.id) ? (
            <Text>{a.macronutrientes}</Text>
          ) : (
            <Button title="Assistir anúncio para liberar" onPress={() => handleLiberar(a.id)} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10 },
  nome: { fontWeight: "bold", fontSize: 16 },
});

export default Index;
