import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "@/contexts/LanguageContext";

import Index from "./pages/Index";
import History from "./pages/History";
import Premium from "./pages/Premium";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

import { useEffect, useState } from "react";
import { initAdMob, showRewardedAd } from "@/lib/admob";

const queryClient = new QueryClient();

function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [anunciosAssistidos, setAnunciosAssistidos] = useState(0);
  const MAX_ANUNCIOS = 5;

  useEffect(() => {
    initAdMob();

    // Detecta Premium via URL ou localStorage
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "true") {
      localStorage.setItem("premium_user", "true");
      setIsPremium(true);
      window.history.replaceState({}, document.title, "/"); // remove ?premium=true
    } else if (localStorage.getItem("premium_user") === "true") {
      setIsPremium(true);
    }

    // Aplica tema escuro persistente
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Função para liberar alimento após anúncio (usada em Index.tsx)
  async function liberarAlimento(alimentoId: number) {
    if (isPremium) {
      console.log(`Alimento ${alimentoId} liberado automaticamente (Premium)!`);
      return true;
    }

    if (anunciosAssistidos >= MAX_ANUNCIOS) {
      console.log(`Máximo de anúncios atingido, alimento ${alimentoId} não pode ser liberado agora.`);
      return false;
    }

    const sucesso = await showRewardedAd();
    if (sucesso) {
      setAnunciosAssistidos(prev => prev + 1);
      console.log(`Alimento ${alimentoId} liberado após anúncio!`);
      return true;
    }

    return false;
  }

  // Alterna tema escuro
  function toggleTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index isPremium={isPremium} liberarAlimento={liberarAlimento} />} />
              <Route path="/history" element={<History />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
