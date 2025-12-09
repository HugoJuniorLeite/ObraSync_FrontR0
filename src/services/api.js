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

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;



