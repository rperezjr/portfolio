// PROJECT DATA - LIVE SITES
const galleryItems = [
  {
    id: 1,
    title: "RPhotography Web Gallery",
    category: "media",
    desc: "A responsive, dark-mode sports photography platform featuring automated match indexing, responsive card layouts, and 3D preview lightboxes.",
    url: "https://rperezjr.github.io/RPhotography/index.html",
    buttonText: "Launch Live Gallery"
  },
  {
    id: 2,
    title: "Dulce Capricho Bakery",
    category: "web",
    desc: "A multi-page responsive storefront and digital catalog built with semantic HTML5, CSS transitions, and an optimized mobile layout.",
    url: "https://rperezjr.github.io/Dulce_Capricho/",
    buttonText: "Launch Live Site"
  },
  {
    id: 3,
    title: "CustomsByDM",
    category: "web",
    desc: "A custom tailored business website and digital storefront featuring custom layout design and interactive product showcases.",
    url: "https://rperezjr.github.io/CustomsByDM/",
    buttonText: "Launch Live Site"
  }
];

let currentCategory = "all";
let searchQuery = "";

const galleryGrid = document.getElementById("gallery-grid");
const searchInput = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");
const itemCount = document.getElementById("item-count");

const modal = document.getElementById("preview-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalIframe = document.getElementById("modal-iframe");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCategory = document.getElementById("modal-category");
const modalLink = document.getElementById("modal-link");

function updateCardIframeScaling() {
  const viewports = document.querySelectorAll(".card-preview-viewport");
  viewports.forEach((viewport) => {
    const iframe = viewport.querySelector("iframe");
    if (!iframe) return;

    const internalCanvasWidth = 1280;
    const currentContainerWidth = viewport.clientWidth;
    const scale = currentContainerWidth / internalCanvasWidth;
    iframe.style.transform = `scale(${scale})`;
  });
}

const resizeObserver = new ResizeObserver(() => {
  updateCardIframeScaling();
});

function applyFilters() {
  const filtered = galleryItems.filter((item) => {
    const matchesCategory =
      currentCategory === "all" || item.category === currentCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesQuery;
  });

  renderGallery(filtered);
}

function renderGallery(items) {
  galleryGrid.innerHTML = "";
  itemCount.textContent = `${items.length} ${items.length === 1 ? "Work" : "Works"}`;

  if (items.length === 0) {
    galleryGrid.innerHTML = `<div class="empty-state">No matching projects found.</div>`;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open interactive preview for ${item.title}`);
    
    card.innerHTML = `
      <div class="card-preview-viewport">
        <iframe src="${item.url}" title="${item.title} Preview" loading="lazy"></iframe>
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="card-footer-link">Open Interactive Preview &rarr;</div>
      </div>
    `;

    card.addEventListener("click", () => openModal(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(item);
      }
    });

    galleryGrid.appendChild(card);
  });

  document.querySelectorAll(".card-preview-viewport").forEach((el) => {
    resizeObserver.observe(el);
  });

  updateCardIframeScaling();
}

function openModal(item) {
  modalIframe.src = item.url;
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.desc;
  modalCategory.textContent = `Category: ${item.category.toUpperCase()}`;
  modalLink.href = item.url;
  modalLink.innerHTML = `${item.buttonText} &rarr;`;
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("active");
  modalIframe.src = "";
  document.body.classList.remove("modal-open");
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  applyFilters();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-filter");
    applyFilters();
  });
});

applyFilters();
window.addEventListener("resize", updateCardIframeScaling);