const sortSelect = document.getElementById("sort");
const applyBtn = document.getElementById("applyFilters");
const checkboxes = document.querySelectorAll(
  ".checkboxes input[type='checkbox']"
);

applyBtn.addEventListener("click", () => {
  const selectedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value); //берем значение из атрибута value

  const sort = sortSelect.value;

  let filtered = jewelryDataset.filter((item) => {
    return selectedCategories.length === 0
      ? true
      : selectedCategories.includes(item.category);
  });

  if (sort === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const container = document.getElementById("jewelry-items");
  container.innerHTML = "";
  allJewelry = [...filtered];
  currentPage = 1;
  loadMoreJewelry();
});
