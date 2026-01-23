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
      <button class="buy-btn" data-id="${r.id}">Comprar</button>
    `;

    container.appendChild(div);
    
    const btn = div.querySelector(".buy-btn");

    btn.addEventListener("click", () => {
      buy(r.id);
    });

  });
}

async function buy(raffleId) {

  const ticketCount = parseInt(prompt("¿Cuántos números quieres?"), 10);
  if (!ticketCount || ticketCount <= 0) {
    alert("Cantidad inválida");
    return;
  }

  const res = await apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      raffle_id: raffleId,
      ticket_count: ticketCount,
      payment_method: "manual",
      payment_reference: "test",
      receipt_url: "test"
    })
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
