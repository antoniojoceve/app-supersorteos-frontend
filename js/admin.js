import { apiFetch } from "./api.js";
import { getUser, logout } from "./authService.js";

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "🕒 Pendiente";
    case "approved":
      return "✅ Aprobada";
    case "rejected":
      return "❌ Rechazada";
    case "expired":
      return "⌛ Expirada";
    default:
      return status;
  }
}

const user = getUser();

if (!user || user.role !== "admin") {
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
      <strong>${r.title}</strong>
      <p>Precio: $${r.price_per_ticket}</p>
      <p>Números: ${r.total_numbers}</p>
      <p>Estado: ${getStatusLabel(r.status)}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById("raffleForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const total = document.getElementById("total").value;

  const res = await apiFetch("/api/raffles", {
  method: "POST",
  body: JSON.stringify({
    title,
    price_per_ticket: price,
    total_numbers: total,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Error al crear sorteo");
    return;
  }

  alert("Sorteo creado 🎉");
  e.target.reset();
  loadRaffles();
});

async function loadOrders() {
  const res = await apiFetch("/api/orders");
  let orders;

  try {
    orders = await res.json();
  } catch {
    console.error("Respuesta inválida del backend");
    return;
  }

  if (!Array.isArray(orders)) {
    console.error("Orders no es un array:", orders);
    return;
  }

  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  orders.forEach((o) => {
    const tr = document.createElement("tr");
    const isPending = o.payment_status === "pending";

    tr.innerHTML = `
      <td>${o.raffle_title}</td>
      <td>${o.user_email}</td>
      <td>$${o.total_amount}</td>
      <td>${getStatusLabel(o.payment_status)}</td>
      <td>${new Date(o.created_at).toLocaleString()}</td>
    `;
    
    if (!isPending) {
      tr.classList.add("order-disabled");
    }

    tbody.appendChild(tr);
  });
}

window.logout = logout;

loadRaffles();
loadOrders();