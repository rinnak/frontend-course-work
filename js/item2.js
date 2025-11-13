document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const origFrames = Array.from(document.querySelectorAll(".carousel-frame"));
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const viewport = document.querySelector(".carousel-viewport");

  const FRAME_WIDTH = 350;
  const GAP = 30;
  const VIEWPORT_WIDTH = 1160;
  const TRANSITION_MS = 500;

  if (!origFrames.length) return;
  const N = origFrames.length;

  // === КЛОНИРУЕМ ФРЕЙМЫ ===
  const prependFragment = document.createDocumentFragment();
  const appendFragment = document.createDocumentFragment();

  origFrames.forEach((node) => {
    prependFragment.appendChild(node.cloneNode(true));
    appendFragment.appendChild(node.cloneNode(true));
  });

  carousel.insertBefore(prependFragment, carousel.firstChild);
  carousel.appendChild(appendFragment);

  const allFrames = Array.from(document.querySelectorAll(".carousel-frame"));
  let currentIndex = N + 2;
  if (N < 3) currentIndex = N;

  let isAnimating = false;

  function calculatePosition(index) {
    const pos = index * (FRAME_WIDTH + GAP);
    const viewportCenter = VIEWPORT_WIDTH / 2;
    const frameCenterOffset = FRAME_WIDTH / 2;
    return pos - viewportCenter + frameCenterOffset;
  }

  // 🔧 Функция временного отключения анимации карточек
  function disableCardTransitions() {
    allFrames.forEach((f) => (f.style.transition = "none"));
  }

  function enableCardTransitions() {
    allFrames.forEach((f) => (f.style.transition = ""));
  }

  function applyTransform(index, instant = false) {
    if (instant) {
      carousel.style.transition = "none";
      disableCardTransitions(); // 🔹 Отключаем transitions у карточек
    } else {
      carousel.style.transition = `transform ${TRANSITION_MS}ms ease`;
      enableCardTransitions();
    }

    const target = calculatePosition(index);
    carousel.style.transform = `translateX(-${target}px)`;

    allFrames.forEach((f) => f.classList.remove("carousel-frame-center"));
    if (instant) {
      // Отложенно применяем класс без анимации
      requestAnimationFrame(() => {
        allFrames[index].classList.add("carousel-frame-center");
      });
    } else {
      allFrames[index].classList.add("carousel-frame-center");
    }
  }

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    applyTransform(index, false);

    setTimeout(() => {
      // === Проверка выхода за границы ===
      if (index >= 2 * N) {
        index = index - N;
        applyTransform(index, true);
      } else if (index < N) {
        index = index + N;
        applyTransform(index, true);
      }

      currentIndex = index;
      setTimeout(() => {
        enableCardTransitions(); // 🔹 Возвращаем плавность
        isAnimating = false;
      }, 50);
    }, TRANSITION_MS + 10);
  }

  function nextSlide() {
    goTo(currentIndex + 1);
  }

  function prevSlide() {
    goTo(currentIndex - 1);
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // === Автопрокрутка ===
  let autoSlideInterval = setInterval(nextSlide, 3000);
  viewport.addEventListener("mouseenter", () =>
    clearInterval(autoSlideInterval)
  );
  viewport.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(nextSlide, 3000);
  });

  // === Инициализация ===
  applyTransform(currentIndex, true);

  window.addEventListener("resize", () => applyTransform(currentIndex, true));
});
