import api from "./api";


export async function putToken(token) {
  const response = await api.put('/super-access', token);
  return response.data;
}


export async function validateToken(data) {
  const response = await api.post("/verify-token", data);
  return response.data;
}


export async function login(data) {
  const response = await api.post("/login", data);
  return response.data;
}

export async function firstLogin(data) {
  const response = await api.post("/verify-access", data);
  return response.data;
}

export async function changePassword(data) {
  const response = await api.put("/change-password", data);
  return response.data;
}

