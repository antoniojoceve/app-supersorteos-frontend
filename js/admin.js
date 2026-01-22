import { API_URL, getAuthHeaders } from "./api.js";
import { getUser, logout } from "./authService.js";

const user = getUser();

if (!user || user.role !== "admin") {
  logout();
}

async function loadRaffles() {
  const res = await fetch(`${API_URL}/api/raffles`, {
    headers: {
      ...getAuthHeaders(),
    },
  });


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
      <p>Estado: ${r.status}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById("raffleForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const total = document.getElementById("total").value;

  const res = await fetch(`${API_URL}/api/raffles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
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

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function loadOrders() {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const orders = await res.json();

  if (!Array.isArray(orders)) {
    console.error("Orders no es un array:", orders);
    return;
  }

  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  orders.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.raffle_title}</td>
      <td>${o.user_email}</td>
      <td>$${o.total_amount}</td>
      <td>${o.payment_status}</td>
      <td>${new Date(o.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.logout = function () {
  localStorage.clear();
  window.location.href = "login.html";
};

loadRaffles();
loadOrders();