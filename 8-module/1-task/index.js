import createElement from "../../assets/lib/create-element.js";

export default class CartIcon {
  constructor() {
    this.render();
    this.initialTopCoord = null;
    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add("cart-icon_visible");

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
            .getTotalPrice()
            .toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add("shake");
      this.elem.addEventListener(
        "transitionend",
        () => {
          this.elem.classList.remove("shake");
        },
        { once: true }
      );
    } else {
      this.elem.classList.remove("cart-icon_visible");
    }
  }

  addEventListeners() {
    document.addEventListener("scroll", () => this.updatePosition());
    window.addEventListener("resize", () => this.updatePosition());
  }

  updatePosition() {
    if (!this.initialTopCoord) {
      this.updateTopCoord();
    }

    let isMobile = document.documentElement.clientWidth <= 767;
    if (isMobile) {
      Object.assign(this.elem.style, {
        position: "",
        top: "",
        left: "",
        zIndex: "",
      });
      return;
    }

    if (window.pageYOffset > this.initialTopCoord) {
      let containerRigth = document
        .querySelector(".container")
        .getBoundingClientRect().right;
      let clientRigthDistance =
        document.documentElement.clientWidth - this.elem.offsetWidth - 10;
      let leftIndent =
        Math.min(containerRigth + 20, clientRigthDistance) + "px";

      const elemProps = {
        position: "fixed",
        top: "50px",
        zIndex: 1e3,
        right: "10px",
        left: leftIndent,
      };

      Object.assign(this.elem.style, elemProps);
    } else {
      Object.assign(this.elem.style, {
        position: "",
        top: "",
        zIndex: "",
        left: "",
      });
    }
  }

  updateTopCoord() {
    this.initialTopCoord =
      this.elem.getBoundingClientRect().top + window.pageYOffset;
  }
}
