import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Premium from "./pages/Premium";
import PaymentSuccess from "./pages/PaymentSuccess";

import { initAdMob } from "./lib/admob";

export default function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    initAdMob();
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const premium = localStorage.getItem("premium_user");
      if (premium === "true") setIsPremium(true);

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light") setTheme("light");
    } catch (err) {
      console.log("Erro carregando preferências", err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    try {
      localStorage.setItem("theme", newTheme);
    } catch (err) {
      console.log("Erro salvando tema");
    }
  };

  const ativarPremium = () => {
    try {
      setIsPremium(true);
      localStorage.setItem("premium_user", "true");
    } catch (err) {
      console.log("Erro ativando premium");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Index isPremium={isPremium} />}
        />

        <Route
          path="/premium"
          element={
            <Premium
              toggleTheme={toggleTheme}
              ativarPremium={ativarPremium}
            />
          }
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />
      </Routes>
    </BrowserRouter>
  );
}
