import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface PremiumProps {
  toggleTheme: () => void;
  ativarPremium: () => void;
}

export default function Premium({ toggleTheme, ativarPremium }: PremiumProps) {
  const comprarPremium = async () => {
    await ativarPremium();
    alert("Premium ativado! Reinicie o app.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium</Text>
      <Button title="Ativar Premium (Remove anúncios)" onPress={comprarPremium} />
      <Button title="Trocar tema" onPress={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
});
