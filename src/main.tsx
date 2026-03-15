import { iniciarAds } from "./src/services/admob"
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTheme } from "./lib/theme";

applyTheme();
iniciarAds();

createRoot(document.getElementById("root")!).render(<App />);
