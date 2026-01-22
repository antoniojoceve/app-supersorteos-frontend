import { getToken, logout } from "./authService.js";

export const API_URL = "https://app-supersorteos.onrender.com";

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Si el backend dice "no autorizado", cerramos sesión
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return res;
}
