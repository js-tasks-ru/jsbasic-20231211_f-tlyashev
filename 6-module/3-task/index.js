import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;

    this.elem = createElement(`
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner"></div>
    </div>
    `);

    this.leftBtn = this.elem.querySelector(".carousel__arrow_left");
    this.rightBtn = this.elem.querySelector(".carousel__arrow_right");
    this.carouselInner = this.elem.querySelector(".carousel__inner");

    let slidesElems = this.slides.map((slide) =>
      createElement(`
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${slide.image}" 
          class="carousel__img" 
          alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `)
    );
    this.carouselInner.append(...slidesElems);

    this.carouselLength = this.carouselInner.children.length;
    this.leftBtn.style.display = "none";
    this.currentSlide = 1;
    this.position = 0;

    this.elem.addEventListener("click", (event) => {
      this.carouselWidth = this.carouselInner.offsetWidth;
      this.handleCaruselScroll(event);

      let btn = event.target.closest(".carousel__button");
      if (btn) {
        let addingEvent = new CustomEvent("product-add", {
          detail: btn.closest(".carousel__slide").dataset.id,
          bubbles: true,
        });

        this.elem.dispatchEvent(addingEvent);
      }
    });
  }

  handleCaruselScroll = (event) => {
    if (!event.target.closest(".carousel__arrow")) return;

    if (event.target.closest(".carousel__arrow_right")) {
      this.position += this.carouselWidth;
      this.currentSlide++;
      this.carouselInner.style.transform = `translateX(-${this.position}px)`;
    }

    if (event.target.closest(".carousel__arrow_left")) {
      this.position -= this.carouselWidth;
      this.currentSlide--;
      this.carouselInner.style.transform = `translateX(-${this.position}px)`;
    }

    this.currentSlide !== this.carouselLength
      ? (this.rightBtn.style.display = "")
      : (this.rightBtn.style.display = "none");

    this.currentSlide !== 1
      ? (this.leftBtn.style.display = "")
      : (this.leftBtn.style.display = "none");
  };
}
