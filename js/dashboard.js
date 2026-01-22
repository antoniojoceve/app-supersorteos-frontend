import { apiFetch } from "./api.js";
import { getUser, logout } from "./authService.js";

const user = getUser();
if (!user) {
  logout();
}

async function loadRaffles() {
  const res = await apiFetch("/api/raffles");

  const raffles = await res.json();
  const container = document.getElementById("raffles");
  container.innerHTML = "";

  raffles.forEach((r) => {
    const div = document.createElement("div");
    div.className = "raffle";

    div.innerHTML = `
      <h3>${r.title}</h3>
      <p>Precio: $${r.price_per_ticket}</p>
      <p>Números: ${r.total_numbers}</p>
      <button onclick="buy('${r.id}')">Comprar</button>
    `;

    container.appendChild(div);
  });
}

async function buy(raffleId) {
  const number = prompt("¿Qué número quieres?");
  if (!number) return;

  const res = await apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      raffle_id: raffleId,
      number,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Error al comprar");
    return;
  }

  alert("Número reservado correctamente 🎉");
}

window.logout = logout;

loadRaffles();
