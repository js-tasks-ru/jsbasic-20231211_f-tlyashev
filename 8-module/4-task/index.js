import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;

    for (let item of this.cartItems) {
      if (item.product.id === product.id) {
        item.count++;
        this.onProductUpdate(item);
        return;
      }
    }

    this.cartItems.push({ product, count: 1 });
    this.onProductUpdate(this.cartItems.at(-1));
  }

  updateProductCount(productId, amount) {
    for (let item of this.cartItems) {
      if (item.product.id === productId) {
        item.count += amount;

        if (item.count < 1) {
          let itemIndex = this.cartItems.indexOf(item);
          this.cartItems.splice(itemIndex, 1);
        }
        this.onProductUpdate(item);
      }
    }
  }

  isEmpty() {
    return this.cartItems.length < 1;
  }

  getTotalCount() {
    let totalCount = 0;

    for (let item of this.cartItems) {
      totalCount += item.count;
    }
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;

    for (let item of this.cartItems) {
      totalPrice += item.count * item.product.price;
    }
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");
    this.modal.setBody(this.renderModalBody());
    this.modal.open();
  }

  modalBodyEventListeners = (modalBody) => {
    modalBody.addEventListener("click", (event) => {
      if (event.target.closest(".cart-counter__button")) {
        let productID = event.target.closest(".cart-product").dataset.productId;

        if (event.target.closest(".cart-counter__button_minus")) {
          this.updateProductCount(productID, -1);
        }
        if (event.target.closest(".cart-counter__button_plus")) {
          this.updateProductCount(productID, 1);
        }
      }
    });

    this.cartForm = modalBody.querySelector(".cart-form");
    this.cartForm.addEventListener("submit", (event) => {
      this.onSubmit(event);
    });
  };

  renderModalBody = () => {
    let modalBody = document.createElement("DIV");

    for (let item of this.cartItems) {
      modalBody.append(this.renderProduct(item.product, item.count));
    }

    modalBody.append(this.renderOrderForm());
    this.modalBodyEventListeners(modalBody);
    return modalBody;
  };

  onProductUpdate = (cartItem) => {
    this.cartIcon.update(this);

    let bodyOpen = document.querySelector(".is-modal-open");
    if (bodyOpen) {
      if (this.isEmpty()) {
        this.modal.close();
        return;
      }

      let productID = cartItem.product.id;

      let productCount = this.modal.elem.querySelector(
        `[data-product-id="${productID}"] .cart-counter__count`
      );
      productCount.innerHTML = cartItem.count;

      let productPrice = this.modal.elem.querySelector(
        `[data-product-id="${productID}"] .cart-product__price`
      );
      productPrice.innerHTML = `€${(
        cartItem.product.price * cartItem.count
      ).toFixed(2)}`;

      let infoPrice = this.modal.elem.querySelector(
        `.cart-buttons__info-price`
      );
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (cartItem.count === 0) {
        this.modal.elem
          .querySelector(`[data-product-id="${productID}"]`)
          .remove();
      }
    }
  };

  onSubmit(event) {
    event.preventDefault();
    this.modal.elem.querySelector(".button").classList.add("is-loading");

    let formData = new FormData(this.cartForm);

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        this.modal.setTitle("Success!");
        this.cartItems = [];
        this.cartIcon.update(this);
        this.modal.setBody(
          createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
        `)
        );
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
