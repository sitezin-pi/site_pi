// Simple cart persistence using localStorage (no backend).
// Stored shape: [{ id, name, price, qty }]

(function () {
  const CART_KEY = "gamestore_cart_v1";

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function load() {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? safeParse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  }

  function save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { items } }));
    } catch {
      // ignore
    }
  }

  function makeId(name, price) {
    // Stable enough for this project (same name+price counts as same product)
    return `${String(name).trim()}__${Number(price).toFixed(2)}`;
  }

  function addItem(name, price, qty = 1) {
    const p = Number(price);
    const q = Number(qty);
    if (!name || !Number.isFinite(p) || !Number.isFinite(q) || q <= 0) return;

    const items = load();
    const id = makeId(name, p);
    const existing = items.find((x) => x && x.id === id);
    if (existing) {
      existing.qty = Number(existing.qty || 0) + q;
    } else {
      items.push({ id, name: String(name), price: p, qty: q });
    }
    save(items);
  }

  function removeItem(id) {
    const items = load().filter((x) => x && x.id !== id);
    save(items);
  }

  function clear() {
    save([]);
  }

  function getTotal(items) {
    return items.reduce((sum, x) => {
      const price = Number(x?.price);
      const qty = Number(x?.qty);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) return sum;
      return sum + price * qty;
    }, 0);
  }

  function getCount(items) {
    return (items || []).reduce((sum, x) => {
      const qty = Number(x?.qty);
      if (!Number.isFinite(qty)) return sum;
      return sum + qty;
    }, 0);
  }

  function formatBRL(value) {
    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    } catch {
      // fallback
      return `R$ ${Number(value).toFixed(2)}`;
    }
  }

  function addAndGo(name, price) {
    addItem(name, price, 1);
    window.location.href = "carrinho.html";
  }

  // Expose a tiny API for inline onclick handlers and the cart page.
  window.Cart = {
    load,
    save,
    addItem,
    removeItem,
    clear,
    getTotal,
    getCount,
    formatBRL,
    addAndGo,
  };
})();
