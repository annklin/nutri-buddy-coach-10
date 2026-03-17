import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Index from "./pages/Index";
import Premium from "./pages/Premium";
import PaymentSuccess from "./pages/PaymentSuccess";
import { initAdMob } from "./lib/admob";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    initAdMob();

    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const premium = await AsyncStorage.getItem("premium_user");
      if (premium === "true") setIsPremium(true);

      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme === "dark") setTheme("dark");
    } catch (err) {
      console.log("Erro carregando preferências", err);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (err) {
      console.log("Erro salvando tema");
    }
  };

  const ativarPremium = async () => {
    try {
      setIsPremium(true);
      await AsyncStorage.setItem("premium_user", "true");
    } catch (err) {
      console.log("Erro ativando premium");
    }
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index">
          {(props) => <Index {...props} isPremium={isPremium} />}
        </Stack.Screen>

        <Stack.Screen name="Premium">
          {(props) => (
            <Premium
              {...props}
              toggleTheme={toggleTheme}
              ativarPremium={ativarPremium}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
