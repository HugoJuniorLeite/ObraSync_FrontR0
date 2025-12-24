import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { registerSW } from "./registerSW";


registerSW();


// 🔹 escuta mensagens do Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "PROCESS_QUEUE") {
      import("./services/processOfflineQueue").then((m) =>
        m.processOfflineQueue()
      );
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
