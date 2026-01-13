export const API_URL = "https://app-supersorteos.onrender.com";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
