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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    initAdMob();

    AsyncStorage.getItem("premium_user").then(val => {
      if (val === "true") setIsPremium(true);
    });

    AsyncStorage.getItem("theme").then(val => {
      if (val === "dark") setTheme("dark");
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const ativarPremium = async () => {
    setIsPremium(true);
    await AsyncStorage.setItem("premium_user", "true");
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index">
          {props => <Index {...props} isPremium={isPremium} />}
        </Stack.Screen>
        <Stack.Screen name="Premium">
          {props => <Premium {...props} toggleTheme={toggleTheme} ativarPremium={ativarPremium} />}
        </Stack.Screen>
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
