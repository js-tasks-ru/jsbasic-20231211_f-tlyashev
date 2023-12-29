function initCarousel() {
  const carousel = document.querySelector(".carousel");
  const leftBtn = carousel.querySelector(".carousel__arrow_left");
  const rightBtn = carousel.querySelector(".carousel__arrow_right");
  const carouselInner = carousel.querySelector(".carousel__inner");
  const carouselLength = carouselInner.children.length;
  let carouselWidth = carouselInner.offsetWidth;

  let currentImg = 1;
  let position = 0;

  leftBtn.style.display = "none";

  carousel.addEventListener("click", (event) => {
    if (!event.target.closest(".carousel__arrow")) return;

    if (event.target.closest(".carousel__arrow_right")) {
      position += carouselWidth;
      currentImg++;
      carouselInner.style.transform = `translateX(-${position}px)`;
    }

    if (event.target.closest(".carousel__arrow_left")) {
      position -= carouselWidth;
      currentImg--;
      carouselInner.style.transform = `translateX(-${position}px)`;
    }

    currentImg !== carouselLength
      ? (rightBtn.style.display = "")
      : (rightBtn.style.display = "none");

    currentImg !== 1
      ? (leftBtn.style.display = "")
      : (leftBtn.style.display = "none");
  });
}
