

import { iniciarAds } from "./src/services/admob";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTheme } from "./lib/theme";

// Aplicar tema
applyTheme();

// Iniciar anúncios
iniciarAds();

// ✅ Ativar Premium automaticamente se vier de Stripe
const params = new URLSearchParams(window.location.search);
if (params.get("premium") === "true") {
  localStorage.setItem("premium_user", "true");
  window.history.replaceState({}, document.title, "/"); // remove ?premium=true da URL
}

// Criar root do React
createRoot(document.getElementById("root")!).render(<App />);
