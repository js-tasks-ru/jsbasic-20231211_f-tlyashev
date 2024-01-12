import createElement from "../../assets/lib/create-element.js";

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
  }

  render() {
    this.elem = createElement(`
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">
      </nav>
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>
    `);

    this.leftBtn = this.elem.querySelector(".ribbon__arrow_left");
    this.rightBtn = this.elem.querySelector(".ribbon__arrow_right");
    this.ribonInner = this.elem.querySelector(".ribbon__inner");
    this.activeLink = null;

    this.ribbonLinks = this.categories.map((link) =>
      createElement(
        `<a href="#" class="ribbon__item" data-id="${link.id}">${link.name}</a>`
      )
    );
    this.ribonInner.append(...this.ribbonLinks);

    this.elem.addEventListener("click", (event) => {
      this.ribbonMove(event);
      this.selectCategory(event);
    });
  }

  ribbonMove = (event) => {
    if (!event.target.closest(".ribbon__arrow")) return;

    if (event.target.closest(".ribbon__arrow_right")) {
      this.ribonInner.scrollBy(350, 0);
    }

    if (event.target.closest(".ribbon__arrow_left")) {
      this.ribonInner.scrollBy(-350, 0);
    }

    this.hideArrow();
  };

  hideArrow = () => {
    let scrollLeft = this.ribonInner.scrollLeft;
    let scrollRigth =
      this.ribonInner.scrollWidth - scrollLeft - this.ribonInner.clientWidth;

    scrollLeft === 0
      ? this.leftBtn.classList.remove("ribbon__arrow_visible")
      : this.leftBtn.classList.add("ribbon__arrow_visible");

    scrollRigth < 1
      ? this.rightBtn.classList.remove("ribbon__arrow_visible")
      : this.rightBtn.classList.add("ribbon__arrow_visible");
  };

  selectCategory = (event) => {
    const selectedLink = event.target.closest(".ribbon__item");

    if (selectedLink) {
      event.preventDefault();

      if (selectedLink !== this.activeLink && this.activeLink !== null) {
        this.activeLink.classList.remove("ribbon__item_active");
        this.activeLink = selectedLink;
        selectedLink.classList.add("ribbon__item_active");
      } else {
        this.activeLink = selectedLink;
        selectedLink.classList.add("ribbon__item_active");
      }

      let addingEvent = new CustomEvent("ribbon-select", {
        detail: selectedLink.dataset.id,
        bubbles: true,
      });

      this.elem.dispatchEvent(addingEvent);
    }
  };
}
