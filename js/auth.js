import { API_URL } from "./api.js";
import { saveSession } from "./authService.js";

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Error al iniciar sesión";
      return;
    }

    saveSession(data.token, data.user);

    window.location.href =
      data.user.role === "admin" ? "admin.html" : "dashboard.html";

  } catch {
    errorEl.textContent = "Servidor no disponible";
  }
});