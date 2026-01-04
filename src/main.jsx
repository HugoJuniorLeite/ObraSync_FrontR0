import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { registerSW } from "./registerSW";
import { forceResetSW } from "./utils/forceResetSW";


// ==============================
// 🔎 VERIFICA RESET VIA URL
// ==============================
const params = new URLSearchParams(window.location.search);

if (params.has("reset-sw")) {
  // 🚨 RESET TOTAL DE CACHE + SW
  forceResetSW();
} else {
  // ✅ REGISTRO NORMAL DO SERVICE WORKER
  registerSW();
}

// ==============================
// 🔹 ESCUTA EVENTOS DO SW (offline-first)
// ==============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "PROCESS_QUEUE") {
      import("./services/processOfflineQueue").then((m) =>
        m.processOfflineQueue()
      );
    }
  });
}


// ==============================
// 🚀 BOOTSTRAP REACT
// ==============================
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
