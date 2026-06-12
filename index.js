
const Hamburger = document.querySelector(".Hamburger");
const nav = document.querySelector(".nav");
const navList = document.querySelector("#nav-list");

function setMenuOpen(open) {
  nav.classList.toggle("active", open);
  Hamburger.setAttribute("aria-expanded", String(open));
  Hamburger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

Hamburger.addEventListener("click", () => setMenuOpen(!nav.classList.contains("active")));

// Close on link click (mobile)
navList?.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.tagName === "A") setMenuOpen(false);
});

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenuOpen(false);
});

// Close when clicking outside the menu panel
document.addEventListener("click", (e) => {
  if (!nav.classList.contains("active")) return;
  const target = e.target;
  if (!target) return;
  if (Hamburger.contains(target)) return;
  if (navList && navList.contains(target)) return;
  setMenuOpen(false);
});

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

function setupPromoCarousel() {
  const root = document.querySelector("[data-promo-carousel]");
  if (!root) return;

  const track = root.querySelector(".promo-track");
  const slides = Array.from(root.querySelectorAll(".promo-slide"));
  const btnPrev = root.querySelector('[data-action="prev"]');
  const btnNext = root.querySelector('[data-action="next"]');
  const dots = Array.from(root.querySelectorAll(".promo-dot"));

  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;
  let touchStartX = null;

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;

    for (let i = 0; i < slides.length; i++) {
      slides[i].setAttribute("aria-hidden", String(i !== index));
    }

    for (let i = 0; i < dots.length; i++) {
      const isCurrent = i === index;
      if (isCurrent) dots[i].setAttribute("aria-current", "true");
      else dots[i].removeAttribute("aria-current");
    }
  }

  function goTo(nextIndex) {
    const len = slides.length;
    index = ((nextIndex % len) + len) % len;
    render();
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    timer = setInterval(() => goTo(index + 1), 6500);
  }

  btnPrev?.addEventListener("click", () => goTo(index - 1));
  btnNext?.addEventListener("click", () => goTo(index + 1));

  for (const dot of dots) {
    dot.addEventListener("click", () => {
      const i = Number(dot.getAttribute("data-index"));
      if (Number.isFinite(i)) goTo(i);
    });
  }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  root.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    stop();
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
    if (touchEndX == null) {
      touchStartX = null;
      start();
      return;
    }

    const dx = touchEndX - touchStartX;
    touchStartX = null;

    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }

    start();
  }, { passive: true });

  render();
  start();
}

setupPromoCarousel();

function setupGamesTabs() {
  const pages = Array.from(document.querySelectorAll("[data-games-page]"));
  const btnPrev = document.querySelector("[data-games-prev]");
  const btnNext = document.querySelector("[data-games-next]");
  if (pages.length === 0) return;

  let index = 0;

  function render() {
    for (let i = 0; i < pages.length; i++) {
      const isActive = i === index;
      pages[i].hidden = !isActive;
      pages[i].classList.toggle("is-active", isActive);
      pages[i].setAttribute("aria-hidden", String(!isActive));
    }
  }

  function goTo(nextIndex) {
    const len = pages.length;
    index = ((nextIndex % len) + len) % len;
    render();
  }

  btnPrev?.addEventListener("click", () => goTo(index - 1));
  btnNext?.addEventListener("click", () => goTo(index + 1));

  render();
}

setupGamesTabs();

function setupHomeGameSearch() {
  const search = document.getElementById("homeGameSearchInput");
  const result = document.getElementById("homeGameSearchResult");
  const pages = Array.from(document.querySelectorAll("#produtos [data-games-page]"));
  const arrows = Array.from(document.querySelectorAll("[data-games-prev], [data-games-next]"));
  if (!search || pages.length === 0) return;

  let lastActiveIndex = Math.max(
    0,
    pages.findIndex((page) => page.classList.contains("is-active"))
  );
  let wasSearching = false;

  function restoreTabs() {
    for (let i = 0; i < pages.length; i++) {
      const isActive = i === lastActiveIndex;
      pages[i].hidden = !isActive;
      pages[i].classList.toggle("is-active", isActive);
      pages[i].setAttribute("aria-hidden", String(!isActive));
    }
  }

  function apply() {
    const term = normalizeSearchText(search.value);
    const isSearching = Boolean(term);
    let visible = 0;

    if (isSearching && !wasSearching) {
      lastActiveIndex = Math.max(
        0,
        pages.findIndex((page) => page.classList.contains("is-active") && !page.hidden)
      );
    }

    for (const arrow of arrows) {
      arrow.hidden = isSearching;
    }

    if (!isSearching) {
      for (const card of document.querySelectorAll("#produtos .produto")) {
        card.hidden = false;
        visible++;
      }
      restoreTabs();
      if (result) result.textContent = `Mostrando todos (${visible} jogos)`;
      wasSearching = false;
      return;
    }

    for (const page of pages) {
      let pageVisible = 0;
      for (const card of page.querySelectorAll(".produto")) {
        const matches = normalizeSearchText(getGameCardSearchText(card)).includes(term);
        card.hidden = !matches;
        if (matches) {
          pageVisible++;
          visible++;
        }
      }

      page.hidden = pageVisible === 0;
      page.classList.toggle("is-active", pageVisible > 0);
      page.setAttribute("aria-hidden", String(pageVisible === 0));
    }

    if (result) {
      const label = visible === 1 ? "jogo encontrado" : "jogos encontrados";
      result.textContent = `Mostrando ${visible} ${label}`;
    }
    wasSearching = true;
  }

  search.addEventListener("input", apply);
  apply();
}

setupHomeGameSearch();

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

  // Keep only digits and separators, then normalize:
  // - If there's a comma, treat it as decimal separator.
  // - Otherwise, dots are considered thousands separators and removed.
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

function normalizeSearchText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getGameCardSearchText(card) {
  const paragraphs = Array.from(card.querySelectorAll("p"));
  const title = paragraphs.find((p) => !String(p.textContent || "").includes("R$"))?.textContent || "";
  const alt = card.querySelector("img")?.getAttribute("alt") || "";
  return `${title} ${alt}`;
}

function setupCatalogPriceFilter({ selectId, searchId, resultId, cardSelector, getPrice, getSearchText, onAfterFilter }) {
  const select = document.getElementById(selectId);
  const search = searchId ? document.getElementById(searchId) : null;
  const result = document.getElementById(resultId);
  if (!select && !search) return;

  function apply() {
    const range = parseRangeValue(select?.value);
    const term = normalizeSearchText(search?.value);
    const cards = Array.from(document.querySelectorAll(cardSelector));
    let visible = 0;

    for (const card of cards) {
      const price = getPrice(card);
      const searchText = normalizeSearchText(
        getSearchText ? getSearchText(card) : card.textContent
      );
      const inRange =
        !range ||
        (Number.isFinite(price) && price >= range.min && price <= range.max);
      const matchesSearch = !term || searchText.includes(term);
      const isVisible = inRange && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visible++;
      else {
        const compareCheck = card.querySelector?.(".console-compare-check");
        if (compareCheck && compareCheck.checked) compareCheck.checked = false;
      }
    }

    if (result) {
      const label = visible === 1 ? "item" : "itens";
      if (term && range) {
        result.textContent = `Mostrando ${visible} ${label} para a pesquisa e faixa selecionadas`;
      } else if (term) {
        result.textContent = `Mostrando ${visible} ${label} encontrados`;
      } else if (range) {
        result.textContent = `Mostrando ${visible} ${label} na faixa selecionada`;
      } else {
        result.textContent = `Mostrando todos (${visible} ${label})`;
      }
    }

    try {
      onAfterFilter?.();
    } catch {
      // ignore
    }
  }

  select?.addEventListener("change", apply);
  search?.addEventListener("input", apply);
  apply();
}

function setupGameCatalogFilter() {
  setupCatalogPriceFilter({
    selectId: "gamePriceFilter",
    searchId: "gameSearchInput",
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
    getSearchText: getGameCardSearchText,
  });
}

setupGameCatalogFilter();

function setupConsoleCatalogFilter() {
  setupCatalogPriceFilter({
    selectId: "consolePriceFilter",
    resultId: "consoleFilterResult",
    cardSelector: '.consoles [data-console-card], .consoles .card[data-console-card]',
    getPrice: (card) => {
      const explicit = Number(card.getAttribute("data-price"));
      if (Number.isFinite(explicit) && explicit > 0) return explicit;

      const priceText = card.querySelector?.(".card-text")?.textContent;
      return parseBRLLikeNumber(priceText);
    },
    onAfterFilter: () => {
      window.dispatchEvent(new Event("consoleCompare:update"));
    },
  });
}

setupConsoleCatalogFilter();

function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null) continue;
    if (k === "class") el.className = String(v);
    else if (k === "text") el.textContent = String(v);
    else el.setAttribute(k, String(v));
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  }
  return el;
}

function setupConsoleCompare() {
  const grid = document.getElementById("consoleCompareGrid");
  if (!grid) return;

  const clearBtn = document.getElementById("clearConsoleCompare");
  const checks = Array.from(document.querySelectorAll(".console-compare-check"));

  function getSelectedCards() {
    return checks
      .filter((c) => c && c.checked)
      .map((c) => c.closest?.("[data-console-card]"))
      .filter(Boolean);
  }

  function enforceLimit(lastChanged = null) {
    const selected = checks.filter((c) => c && c.checked);
    if (selected.length <= 2) return;

    // Prefer unchecking the last changed box, otherwise uncheck extras.
    if (lastChanged && lastChanged.checked) {
      lastChanged.checked = false;
      return;
    }

    for (let i = 2; i < selected.length; i++) selected[i].checked = false;
  }

  function renderPlaceholders() {
    grid.replaceChildren(
      createEl("article", { class: "compare-placeholder", text: "Selecione um console para comparar." }),
      createEl("article", { class: "compare-placeholder", text: "Selecione um segundo console." })
    );
  }

  function render() {
    enforceLimit();
    const selected = getSelectedCards();

    if (selected.length === 0) {
      renderPlaceholders();
      return;
    }

    const cards = selected.slice(0, 2).map((card) => {
      const name = card.querySelector?.(".card-title")?.textContent?.trim() || "Console";
      const imgSrc = card.querySelector?.("img")?.getAttribute?.("src") || "";
      const imgAlt = card.querySelector?.("img")?.getAttribute?.("alt") || name;
      const priceText = card.querySelector?.(".card-text")?.textContent?.trim() || "";
      const performance = card.getAttribute("data-performance") || "-";
      const storage = card.getAttribute("data-storage") || "-";
      const mode = card.getAttribute("data-mode") || "-";
      const audience = card.getAttribute("data-audience") || "-";

      const specs = createEl("ul", { class: "compare-specs" }, [
        createEl("li", {}, [createEl("strong", { text: "Preço: " }), priceText || "-"]),
        createEl("li", {}, [createEl("strong", { text: "Desempenho: " }), performance]),
        createEl("li", {}, [createEl("strong", { text: "Armazenamento: " }), storage]),
        createEl("li", {}, [createEl("strong", { text: "Modo: " }), mode]),
        createEl("li", {}, [createEl("strong", { text: "Perfil: " }), audience]),
      ]);

      return createEl("article", { class: "compare-card" }, [
        imgSrc ? createEl("img", { src: imgSrc, alt: imgAlt, loading: "lazy" }) : null,
        createEl("h3", { text: name }),
        specs,
      ]);
    });

    if (cards.length === 1) cards.push(createEl("article", { class: "compare-placeholder", text: "Selecione um segundo console." }));
    grid.replaceChildren(...cards);
  }

  for (const check of checks) {
    check.addEventListener("change", (e) => {
      enforceLimit(e.target);
      render();
    });
  }

  clearBtn?.addEventListener("click", () => {
    for (const check of checks) check.checked = false;
    render();
  });

  window.addEventListener("consoleCompare:update", render);
  render();
}

setupConsoleCompare();

function setupConsoleBuy() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;

    const link = target.closest?.(".console-buy");
    if (!link) return;

    e.preventDefault();

    const card = link.closest?.(".consoles .card");
    if (!card || !window.Cart) return;

    const name = card.querySelector?.(".card-title")?.textContent?.trim();
    const priceText = card.querySelector?.(".card-text")?.textContent?.trim();
    const price = parseBRLLikeNumber(priceText);

    if (!name || !Number.isFinite(price)) return;
    window.Cart.addItem(name, price);
  });
}

setupConsoleBuy();
 
 
 
 
 // Dados dos produtos (extraídos do HTML original)
const productsData = [
  { name: 'GTA V', price: 150, image: 'https://th.bing.com/th/id/OPHS.RJTm7oN3v298Fw474C474?w=172&h=220&c=17&pid=21.1' },
  { name: 'FIFA 26', price: 300, image: 'https://th.bing.com/th/id/OPHS.1DvQjWfv28puPw474C474?w=170&h=220&c=17&pid=21.1' },
  { name: 'WWE 25', price: 237.40, image: 'https://www.bing.com/th?id=OPHS.lLi7DupbcouinA474C474' },
  { name: 'Red Dead Redemption 2', price: 297, image: 'https://www.bing.com/th?id=OPHS.H4OpGzPu4g7gfQ474C474' }
];

// Mock do objeto Cart para evitar erros
const Cart = {
  addItem: (name, price) => {
    console.log(`Adicionado ao carrinho: ${name} - R$ ${price}`);
    alert(`${name} adicionado ao carrinho!`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('input[type="search"]');
  const productsContainer = document.querySelector('.produtos');
  const originalProductsHTML = productsContainer.innerHTML;

  // Função para renderizar produtos filtrados
  const renderFilteredProducts = (query) => {
    if (!query) {
      productsContainer.innerHTML = originalProductsHTML;
      return;
    }

    const filtered = productsData.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      productsContainer.innerHTML = '<p class="no-results">Nenhum jogo encontrado.</p>';
      return;
    }

    productsContainer.innerHTML = filtered.map(p => `
      <div class="produto">
        <img src="${p.image}" alt="${p.name}">
        <br> <br>
        <p>${p.name}</p>
        <p>Preço: R$ ${p.price.toFixed(2).replace('.', ',')}</p>
        <br> 
        <button onclick="Cart.addItem('${p.name}', ${p.price})">Adicionar</button>
      </div>
    `).join('');
  };

  // Evento de busca em tempo real com destaque visual
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    renderFilteredProducts(query);
    
    // Rolar para a seção de produtos se houver uma busca ativa
    if (query.length > 0) {
      const productsSection = document.getElementById('produtos');
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Prevenir envio do formulário
  const searchForm = document.querySelector('form[role="search"]');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    renderFilteredProducts(searchInput.value);
  });
});


