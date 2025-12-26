// src/services/api.js - versão anterior
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:4000',
//   // baseURL: 'https://obra-sync-backend.onrender.com',

// });

// api.interceptors.request.use(config => {
//   // Define Content-Type: application/json APENAS se não for FormData
//   if (!(config.data instanceof FormData)) {
//     config.headers['Content-Type'] = 'application/json';
//   }
//   // Se for FormData, deixa o axios definir automaticamente
//   return config;
// });

// export default api;


// src/services/api.js - versão na nuvem
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://obra-sync-backend.onrender.com",
// });

// // 🔒 Intercepta todas as requisições e adiciona o token JWT
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


// versão proposta 

// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;



import axios from "axios";

// --------------------------------------------------
// 🔹 ENVIRONMENT
// --------------------------------------------------
const baseURL = import.meta.env.VITE_API_BASE_URL;
const env = import.meta.env.VITE_ENVIRONMENT || "development";
const isProd = env === "production";

// --------------------------------------------------
// 🔴 VALIDAÇÃO CRÍTICA
// --------------------------------------------------
if (!baseURL) {
  console.error("❌ VITE_API_BASE_URL não definida");
}

// --------------------------------------------------
// 🔹 AXIOS INSTANCE
// --------------------------------------------------
const api = axios.create({
  baseURL,
  timeout: 15000, // 15s → evita travamento em campo
});

// --------------------------------------------------
// 🔐 REQUEST INTERCEPTOR (AUTH)
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY;
    const token = tokenKey
      ? localStorage.getItem(tokenKey)
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// ⚠️ RESPONSE INTERCEPTOR (ERROS GLOBAIS)
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔌 Offline / timeout / DNS
    if (!error.response) {
      console.warn("🔌 Sem conexão com backend");
    }
    // 🔐 Token inválido / expirado
    else if (error.response.status === 401) {
      console.warn("🔐 Token inválido ou expirado");

      // 👉 aqui você pode:
      // - limpar token
      // - redirecionar para login
      // - ou apenas logar (piloto)
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// 🧪 DEBUG CONTROLADO
// --------------------------------------------------
if (!isProd) {
  console.log("🌐 API BASE:", baseURL);
  console.log("🧪 ENVIRONMENT:", env);
}

export default api;

