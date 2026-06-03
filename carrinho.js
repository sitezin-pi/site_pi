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
    updateCheckout(0);
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "cart-item";

    const media = document.createElement("div");
    media.className = "cart-item-media";

    const image = document.createElement("img");
    image.className = "cart-item-image";
    image.src = item.image || "logo2.jpeg";
    image.alt = item.name;
    media.appendChild(image);

    const content = document.createElement("div");
    content.className = "cart-item-content";

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    meta.textContent = `${window.Cart.formatBRL(item.price)} cada`;

    const subtotal = document.createElement("div");
    subtotal.className = "cart-item-subtotal";
    subtotal.textContent = `Subtotal: ${window.Cart.formatBRL(Number(item.price) * Number(item.qty))}`;

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(subtotal);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const qtyBox = document.createElement("div");
    qtyBox.className = "cart-qty";

    const btnMinus = document.createElement("button");
    btnMinus.className = "btn qty-btn";
    btnMinus.type = "button";
    btnMinus.textContent = "-";
    btnMinus.addEventListener("click", () => {
      window.Cart.setQty(item.id, Number(item.qty) - 1);
      renderCart();
    });

    const qtyValue = document.createElement("span");
    qtyValue.className = "cart-qty-value";
    qtyValue.textContent = `${item.qty}`;

    const btnPlus = document.createElement("button");
    btnPlus.className = "btn qty-btn";
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    btnPlus.addEventListener("click", () => {
      window.Cart.setQty(item.id, Number(item.qty) + 1);
      renderCart();
    });

    const btnRemove = document.createElement("button");
    btnRemove.className = "btn btn-danger";
    btnRemove.type = "button";
    btnRemove.textContent = "Remover";
    btnRemove.addEventListener("click", () => {
      window.Cart.removeItem(item.id);
      renderCart();
    });

    qtyBox.appendChild(btnMinus);
    qtyBox.appendChild(qtyValue);
    qtyBox.appendChild(btnPlus);

    actions.appendChild(qtyBox);
    actions.appendChild(btnRemove);

    li.appendChild(media);
    li.appendChild(content);
    li.appendChild(actions);
    lista.appendChild(li);
  }

  const total = window.Cart.getTotal(items);
  totalEl.textContent = `Total: ${window.Cart.formatBRL(total)}`;
  updateCheckout(total);
}

function updateCheckout(productsTotal) {
  const shippingSelect = document.getElementById("shippingOption");
  const paymentSelect = document.getElementById("paymentMethod");
  const productsEl = document.getElementById("checkoutProducts");
  const shippingEl = document.getElementById("checkoutShipping");
  const discountEl = document.getElementById("checkoutDiscount");
  const finalEl = document.getElementById("checkoutFinal");

  if (!shippingSelect || !paymentSelect || !productsEl || !shippingEl || !discountEl || !finalEl) return;

  const hasItems = (window.Cart?.load?.() ?? []).length > 0;
  const shipping = hasItems ? Number(shippingSelect.value || 0) : 0;
  const payment = paymentSelect.value;

  let discountRate = 0;
  if (hasItems && payment === "pix") discountRate = 0.05;
  if (hasItems && payment === "boleto") discountRate = 0.02;

  const discount = productsTotal * discountRate;
  const final = productsTotal + shipping - discount;

  productsEl.textContent = window.Cart.formatBRL(productsTotal);
  shippingEl.textContent = window.Cart.formatBRL(shipping);
  discountEl.textContent = `-${window.Cart.formatBRL(discount)}`;
  finalEl.textContent = window.Cart.formatBRL(final);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnClear = document.getElementById("btnLimpar");
  const shippingSelect = document.getElementById("shippingOption");
  const paymentSelect = document.getElementById("paymentMethod");
  const finishOrder = document.getElementById("finishOrder");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      window.Cart?.clear?.();
      renderCart();
    });
  }

  shippingSelect?.addEventListener("change", () => {
    const items = window.Cart?.load?.() ?? [];
    updateCheckout(window.Cart.getTotal(items));
  });

  paymentSelect?.addEventListener("change", () => {
    const items = window.Cart?.load?.() ?? [];
    updateCheckout(window.Cart.getTotal(items));
  });

  finishOrder?.addEventListener("click", () => {
    const items = window.Cart?.load?.() ?? [];
    if (!items.length) {
      alert("Adicione produtos ao carrinho antes de finalizar a compra.");
      return;
    }
    window.Cart?.clear?.();
    renderCart();
    alert("Compra finalizada com sucesso.");
  });

  renderCart();
});
