document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const origFrames = Array.from(document.querySelectorAll(".carousel-frame"));
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const viewport = document.querySelector(".carousel-viewport");

  function getVisibleCount() {
    if (window.innerWidth < 650) return 1;
    if (window.innerWidth < 835) return 2;
    return 3;
  }

  function getCarouselSettings() {
    const frame = document.querySelector(".carousel-frame");
    const computedStyle = window.getComputedStyle(frame);

    const frameWidth = parseFloat(computedStyle.width);

    // ТЕКУЩИЙ gap ИЗ CSS
    const carouselComputed = window.getComputedStyle(carousel);
    const gap = parseFloat(
      carouselComputed.columnGap || carouselComputed.gap || 0
    );

    const viewportWidth = viewport.offsetWidth;

    return {
      FRAME_WIDTH: frameWidth,
      GAP: gap,
      VIEWPORT_WIDTH: viewportWidth,
    };
  }
  if (!origFrames.length) return;
  const N = origFrames.length;

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
  let isAnimating = false;

  function calculatePosition(index) {
    const settings = getCarouselSettings();
    const V = getVisibleCount();

    const offset = index * (settings.FRAME_WIDTH + settings.GAP);

    // центрируем НЕ одну карточку, а группу из 2 или 3
    const visibleWidth = V * settings.FRAME_WIDTH + (V - 1) * settings.GAP;

    const viewportCenter = settings.VIEWPORT_WIDTH / 2;
    const centerOffset = visibleWidth / 2;

    return offset - viewportCenter + centerOffset;
  }

  function applyTransform(index, instant = false) {
    carousel.style.transition = instant ? "none" : "transform 500ms ease";

    const target = calculatePosition(index);
    carousel.style.transform = `translateX(-${target}px)`;
  }

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    applyTransform(index);

    setTimeout(() => {
      if (index >= 2 * N) {
        index -= N;
        applyTransform(index, true);
      } else if (index < N) {
        index += N;
        applyTransform(index, true);
      }

      currentIndex = index;
      isAnimating = false;
    }, 520);
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  let autoSlideInterval = setInterval(() => goTo(currentIndex + 1), 3000);

  viewport.addEventListener("mouseenter", () =>
    clearInterval(autoSlideInterval)
  );

  viewport.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(() => goTo(currentIndex + 1), 3000);
  });

  applyTransform(currentIndex, true);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      applyTransform(currentIndex, true);
    }, 100);
  });
});
