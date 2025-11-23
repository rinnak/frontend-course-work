const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || []; //преобразует сохраненные в браузере объекты корзины в JS объект если они есть

function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart)); //преобразуем массив корзины в JSON и сохраняем в память браузера
}

function addToCart(id) {
  const product = jewelryDataset.find((item) => item.id === id); //ищем в бд товар с таким айдишником
  if (!product) return;

  let existing = findCartItem(id); //проверяем есть ли этот товар в корзине

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product, //копируем все свойства товара
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  updateCatalogButtons();
}

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

function increaseQuantity(id) {
  let item = findCartItem(id);
  if (!item) return;

  item.quantity++;
  saveCart();
  renderCart();
  updateCatalogButtons();
}

function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = ""; //удаляем старые товары из корзины

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

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  updateCatalogButtons();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); //сворачиваем массив в одно значение
  totalPrice.textContent = `${total.toLocaleString()} Р`;
}

function updateCatalogButtons() {
  document.querySelectorAll(".jewelry-item-wrapper").forEach((wrapper) => {
    //ищем все карточки товаров
    const addBtn = wrapper.querySelector(".add-to-cart-btn");
    const counter = wrapper.querySelector(".catalog-counter");

    // получаем id товара из dataset кнопки (если кнопки нет — пробуем из counter)
    const id = addBtn
      ? Number(addBtn.dataset.id)
      : counter
      ? Number(counter.dataset.id)
      : null;

    if (id === null) return;

    const item = findCartItem(id);

    if (!item) {
      // товара нет в корзине — нужно показать кнопку "В корзину"
      // если сейчас в карточке есть counter — заменяем его на кнопку
      if (counter) {
        counter.outerHTML = `<button class="add-to-cart-btn" data-id="${id}">В корзину</button>`; //заменяем счетчик на кнопку
        // навешиваем обработчик на вновь созданную кнопку
        const newBtn = wrapper.querySelector(".add-to-cart-btn");
        if (newBtn) newBtn.onclick = () => addToCart(id);
      } else if (addBtn) {
        addBtn.onclick = () => addToCart(id);
      }
    } else {
      // товар есть в корзине — показываем / обновляем счётчик
      if (counter) {
        // если счётчик уже есть — обновляем число внутри
        const span = counter.querySelector(".cat-count");
        if (span) span.textContent = item.quantity;
        // обновляем обработчики на случай, если они потерялись
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

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCatalogButtons();
});
