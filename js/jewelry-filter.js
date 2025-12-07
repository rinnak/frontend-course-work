const sortSelect = document.getElementById("sort");
const applyBtn = document.getElementById("applyFilters");
const checkboxes = document.querySelectorAll(
  ".checkboxes input[type='checkbox']"
); //все чекбоксы категорий

applyBtn.addEventListener("click", () => {
  const selectedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked) //только отмеченные чекбоксы
    .map((checkbox) => checkbox.value); //извлекаем названия категорий
  //получаем массив строк с названиями выбранных категорий

  const sort = sortSelect.value;
  //получаем параметр сортировки
  let filtered = jewelryDataset.filter((item) => {
    return selectedCategories.length === 0
      ? true //все товары
      : selectedCategories.includes(item.category); 
      //проверка вхождения категории
  });

  if (sort === "asc") { //сортировка по возрастанию цены
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") { //по убыванию
    filtered.sort((a, b) => b.price - a.price);
  }

  const container = document.getElementById("jewelry-items");
  container.innerHTML = ""; //очищаем текущее содержимое
  allJewelry = [...filtered]; //сохраняем отфильтрованные данные
  currentPage = 1; //сброс на первую страницу
  loadMoreJewelry(); //загрузка товаров
});
