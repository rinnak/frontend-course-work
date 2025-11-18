// cart.js
const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Найти товар в корзине
function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

// Сохранение корзины
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Добавление в корзину
function addToCart(id) {
  const product = jewelryDataset.find((item) => item.id === id);
  if (!product) return;

  let existing = findCartItem(id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  updateCatalogButtons();
  showToast(`${product.title} добавлен в корзину`);
}

// Уменьшение количества
function decreaseQuantity(id) {
  let item = findCartItem(id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter((p) => p.id !== id);
  }

  saveCart();
  renderCart();
  updateCatalogButtons();
}

// Увеличение количества
function increaseQuantity(id) {
  let item = findCartItem(id);
  if (!item) return;

  item.quantity++;
  saveCart();
  renderCart();
  updateCatalogButtons();
}

// Рендер корзины
function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<p>В корзине нет товаров</p>";
    totalPrice.textContent = "0 Р";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <p>${item.price.toLocaleString()} Р</p>
        </div>

        <div class="quantity-box">
            <button class="qty-btn" onclick="decreaseQuantity(${
              item.id
            })">−</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQuantity(${
              item.id
            })">+</button>
        </div>

        <button class="cart-item-remove" onclick="removeItem(${
          item.id
        })">Удалить</button>
    `;

    cartList.appendChild(div);
  });

  updateTotal();
}

// Удалить товар целиком
function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  updateCatalogButtons();
}

// Общая сумма
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = `${total.toLocaleString()} Р`;
}

// ----------------------------------------------------------
// 🎯 ЛОГИКА КНОПКИ В КАТАЛОГЕ — заменяем кнопку на счетчик
// ----------------------------------------------------------

function updateCatalogButtons() {
  // Перебираем все обёртки карточек, которые у тебя создаются: .jewelry-item-wrapper
  document.querySelectorAll(".jewelry-item-wrapper").forEach((wrapper) => {
    // пытаемся найти кнопку в карточке (если ещё не заменена)
    const addBtn = wrapper.querySelector(".add-to-cart-btn");
    // пытаемся найти уже существующий счётчик в карточке
    const counter = wrapper.querySelector(".catalog-counter");

    // получаем id товара из dataset кнопки (если кнопки нет — пробуем из counter)
    const id = addBtn
      ? Number(addBtn.dataset.id)
      : counter
      ? Number(counter.dataset.id)
      : null;

    if (id === null) return; // если не нашли id — пропускаем

    const item = findCartItem(id); // ищем товар в cart (модель)

    if (!item) {
      // товара нет в корзине — нужно показать кнопку "В корзину"
      // если сейчас в карточке есть counter — заменяем его на кнопку
      if (counter) {
        counter.outerHTML = `<button class="add-to-cart-btn" data-id="${id}">В корзину</button>`;
        // навешиваем обработчик на вновь созданную кнопку
        const newBtn = wrapper.querySelector(".add-to-cart-btn");
        if (newBtn) newBtn.onclick = () => addToCart(id);
      } else if (addBtn) {
        // кнопка уже есть — просто убедимся, что обработчик назначен
        addBtn.onclick = () => addToCart(id);
      }
    } else {
      // товар есть в корзине — показываем / обновляем счётчик
      if (counter) {
        // если счётчик уже есть — обновляем число внутри
        const span = counter.querySelector(".cat-count");
        if (span) span.textContent = item.quantity;
        // (обновляем обработчики на случай, если они потерялись)
        const plus = counter.querySelector(".cat-plus");
        const minus = counter.querySelector(".cat-minus");
        if (plus) plus.onclick = () => increaseQuantity(id);
        if (minus) minus.onclick = () => decreaseQuantity(id);
      } else {
        // счётчика нет — заменяем кнопку на счётчик
        if (addBtn) {
          addBtn.outerHTML = `
            <div class="catalog-counter" data-id="${id}">
              <button class="cat-minus">−</button>
              <span class="cat-count">${item.quantity}</span>
              <button class="cat-plus">+</button>
            </div>
          `;
          const newCounter = wrapper.querySelector(".catalog-counter");
          if (newCounter) {
            newCounter.querySelector(".cat-plus").onclick = () =>
              increaseQuantity(id);
            newCounter.querySelector(".cat-minus").onclick = () =>
              decreaseQuantity(id);
          }
        }
      }
    }
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCatalogButtons();
});
