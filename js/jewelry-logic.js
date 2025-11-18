let currentPage = 1;
const itemsPerPage = 4;
let allJewelry = [...jewelryDataset];

function loadMoreJewelry() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const template = document.getElementById("jewelry-template");
  const container = document.getElementById("jewelry-items");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = allJewelry.slice(startIndex, endIndex);
  itemsToShow.forEach((item) => {
    const div = document.createElement("div");
    div.className = "jewelry-item-wrapper";

    let itemHTML = template.innerHTML;

    itemHTML = itemHTML.replace(/{{image}}/g, item.image);
    itemHTML = itemHTML.replace(/{{title}}/g, item.title);
    itemHTML = itemHTML.replace(/{{price}}/g, item.price.toLocaleString());
    itemHTML = itemHTML.replace(/{{category}}/g, item.category);
    itemHTML = itemHTML.replace(/{{id}}/g, item.id);

    div.innerHTML = itemHTML;
    container.appendChild(div);
  });

  const shownItems = currentPage * itemsPerPage;
  if (shownItems >= allJewelry.length) {
    loadMoreBtn.textContent = "Скрыть";
    loadMoreBtn.onclick = hideAll;
  }
  currentPage++;
}

function hideAll() {
  const container = document.getElementById("jewelry-items");
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (!cart || !loadMoreBtn) return;
  container.innerHTML = "";
  currentPage = 1;

  loadMoreBtn.textContent = "Показать еще";
  loadMoreBtn.onclick = loadMoreJewelry;
  loadMoreJewelry();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const id = Number(e.target.dataset.id);
    addToCart(id);
  }
});
function checkIfAllLoaded() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const showItems = currentPage * itemsPerPage;

  if (showItems >= allJewelry.length) {
    loadMoreBtn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadMoreJewelry();
});
