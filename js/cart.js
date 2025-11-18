// cart.js - Логика корзины
const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Рендер корзины
function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p>В корзине нет товаров</p>";
    if (totalPrice) totalPrice.textContent = "0 Р";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-price">${item.price.toLocaleString()} Р</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${
          item.id
        })">Удалить</button>
        `;
    cartList.appendChild(div);
  });
  updateTotal();
}

// Добавление в корзину
function addToCart(id) {
  const product = jewelryDataset.find((item) => item.id === id);
  if (!product) {
    console.error("Товар не найден:", id);
    return;
  }

  const exists = cart.find((item) => item.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`${product.title} добавлен в корзину`);

  // Обновляем корзину только если мы на странице корзины
  if (cartList) {
    renderCart();
  }
}

function removeFromCart(id) {
  // находим индекс первого элемента с таким id
  const index = cart.findIndex((item) => item.id === id);

  // если элемент найден — удаляем ровно один (splice)
  if (index !== -1) {
    cart.splice(index, 1); // убираем один элемент из массива
    localStorage.setItem("cart", JSON.stringify(cart)); // сохраняем
    renderCart(); // обновляем UI корзины
  }
}

// Обновление общей суммы
function updateTotal() {
  if (!totalPrice) return;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPrice.textContent = `${total.toLocaleString()} Р`;
}

// Toast уведомления
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Инициализация корзины при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  if (cartList) {
    renderCart();
  }
});
