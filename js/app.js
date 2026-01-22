import { apiFetch } from "./api.js";

apiFetch("/api/raffles")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("raffles");

    data.forEach(r => {
      const div = document.createElement("div");
      div.className = "raffle";
      div.innerHTML = `
        <h2>${r.title}</h2>
        <p>Precio: $${r.price_per_ticket}</p>
        <p>Números: ${r.total_numbers}</p>
        <button>Comprar</button>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error cargando sorteos", err);
  });
