document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const gridItems = document.querySelectorAll(".item1-grid-item");

  // Функция для смены категории
  function switchCategory(category) {
    // Скрываем все карточки
    gridItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Показываем карточки выбранной категории
    const activeItems = document.querySelectorAll(`.category-${category}`);
    activeItems.forEach((item) => {
      item.classList.add("active");
    });

    // Обновляем активную кнопку
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-category="${category}"]`)
      .classList.add("active");
  }

  // Обработчики кликов на кнопки
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      switchCategory(category);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const detailButtons = document.querySelectorAll(".exclusive-btn");

  detailButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const item = this.closest(".exclusive-item");

      item.classList.toggle("show-details");

      if (item.classList.contains("show-details")) {
        this.textContent = "Скрыть";
        this.classList.add("active");
      } else {
        this.textContent = "Подробнее";
        this.classList.remove("active");
      }
    });
  });
});
