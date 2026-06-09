(function () {
  const hamburger = document.querySelector(".Hamburger");
  const nav = document.querySelector(".nav");
  const navList = document.querySelector("#nav-list");

  function setMenuOpen(open) {
    if (!hamburger || !nav) return;
    nav.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => setMenuOpen(!nav.classList.contains("active")));

    if (navList) {
      navList.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.tagName === "A") setMenuOpen(false);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("active")) return;
      const target = e.target;
      if (!target) return;
      if (hamburger.contains(target)) return;
      if (navList && navList.contains(target)) return;
      setMenuOpen(false);
    });
  }

  function setupCategoriesDropdown() {
    const root = document.querySelector(".nav-dropdown");
    const trigger = root?.querySelector(".nav-dd-trigger");
    const menu = root?.querySelector(".nav-dd");
    if (!root || !trigger || !menu) return;

    function setOpen(open) {
      root.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!root.classList.contains("is-open"));
    });

    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") setOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!root.classList.contains("is-open")) return;
      const target = e.target;
      if (!target) return;
      if (root.contains(target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  setupCategoriesDropdown();

  function setupCartBadge() {
    const badge = document.getElementById("cartCount");
    if (!badge || !window.Cart) return;

    function update() {
      const items = window.Cart.load();
      const count = window.Cart.getCount(items);
      if (count > 0) {
        badge.textContent = String(count);
        badge.classList.add("is-visible");
      } else {
        badge.textContent = "";
        badge.classList.remove("is-visible");
      }
    }

    update();
    window.addEventListener("cart:updated", update);
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.includes("gamestore_cart")) update();
    });
  }

  setupCartBadge();

  function parseBRLLikeNumber(text) {
    const raw = String(text || "").trim();
    if (!raw) return NaN;

    let cleaned = raw.replace(/[^\d.,]/g, "");
    if (!cleaned) return NaN;

    const hasComma = cleaned.includes(",");
    if (hasComma) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      cleaned = cleaned.replace(/\./g, "");
    }

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }

  function parseRangeValue(value) {
    const raw = String(value || "").trim();
    if (!raw || raw === "all") return null;

    const parts = raw.split("-").map((x) => Number(x));
    if (parts.length !== 2) return null;

    const [min, max] = parts;
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
    return { min, max };
  }

  function setupCatalogPriceFilter({ selectId, resultId, cardSelector, getPrice }) {
    const select = document.getElementById(selectId);
    const result = document.getElementById(resultId);
    if (!select) return;

    function apply() {
      const range = parseRangeValue(select.value);
      const cards = Array.from(document.querySelectorAll(cardSelector));
      let visible = 0;

      for (const card of cards) {
        const price = getPrice(card);
        const inRange =
          !range ||
          (Number.isFinite(price) && price >= range.min && price <= range.max);

        card.hidden = !inRange;
        if (inRange) visible++;
      }

      if (result) {
        const label = visible === 1 ? "item" : "itens";
        result.textContent = range
          ? `Mostrando ${visible} ${label} na faixa selecionada`
          : `Mostrando todos (${visible} ${label})`;
      }
    }

    select.addEventListener("change", apply);
    apply();
  }

  function setupGameCatalogFilter() {
    setupCatalogPriceFilter({
      selectId: "gamePriceFilter",
      resultId: "gameFilterResult",
      cardSelector: ".produtos .produto",
      getPrice: (card) => {
        const explicit = Number(card.getAttribute("data-price"));
        if (Number.isFinite(explicit) && explicit > 0) return explicit;

        const priceEl = Array.from(card.querySelectorAll("p")).find((p) =>
          String(p.textContent || "").includes("R$")
        );
        return parseBRLLikeNumber(priceEl?.textContent);
      },
    });
  }

  setupGameCatalogFilter();
})();
