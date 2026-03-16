

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ativa Premium se URL tiver ?premium=true
const params = new URLSearchParams(window.location.search);
if (params.get("premium") === "true") {
  localStorage.setItem("premium_user", "true");
  window.history.replaceState({}, document.title, "/"); // remove ?premium=true da URL
}

createRoot(document.getElementById("root")!).render(<App />);
