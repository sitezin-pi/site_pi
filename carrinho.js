function renderCart() {
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("total");
  const emptyEl = document.getElementById("empty");

  if (!lista || !totalEl) return;

  const items = window.Cart?.load?.() ?? [];

  lista.innerHTML = "";

  if (!items.length) {
    if (emptyEl) emptyEl.style.display = "block";
    totalEl.textContent = `Total: ${window.Cart?.formatBRL?.(0) ?? "R$ 0,00"}`;
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "cart-item";

    const left = document.createElement("div");
    left.className = "cart-item-left";

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    const subtotal = Number(item.price) * Number(item.qty);
    meta.textContent = `${item.qty}x ${window.Cart.formatBRL(item.price)} = ${window.Cart.formatBRL(subtotal)}`;

    left.appendChild(title);
    left.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const btnRemove = document.createElement("button");
    btnRemove.className = "btn btn-danger";
    btnRemove.type = "button";
    btnRemove.textContent = "Remover";
    btnRemove.addEventListener("click", () => {
      window.Cart.removeItem(item.id);
      renderCart();
    });

    actions.appendChild(btnRemove);

    li.appendChild(left);
    li.appendChild(actions);
    lista.appendChild(li);
  }

  const total = window.Cart.getTotal(items);
  totalEl.textContent = `Total: ${window.Cart.formatBRL(total)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnClear = document.getElementById("btnLimpar");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      window.Cart?.clear?.();
      renderCart();
    });
  }

  renderCart();
});

