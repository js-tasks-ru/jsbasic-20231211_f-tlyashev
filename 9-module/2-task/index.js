import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductsGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  renderCarusel() {
    this.caruselHolder = document.querySelector("[data-carousel-holder]");
    this.carusel = new Carousel(slides);
    this.caruselHolder.append(this.carusel.elem);
  }

  renderRibbon() {
    this.ribbonHolder = document.querySelector("[data-ribbon-holder]");
    this.ribbonMenu = new RibbonMenu(categories);
    this.ribbonHolder.append(this.ribbonMenu.elem);
  }

  renderSlider() {
    this.sliderHolder = document.querySelector("[data-slider-holder]");
    this.slider = new StepSlider({
      steps: 5,
      value: 3,
    });
    this.sliderHolder.append(this.slider.elem);
  }

  renderCartIcon() {
    this.cartIconHolder = document.querySelector("[data-cart-icon-holder]");
    this.cartIcon = new CartIcon();
    this.cartIconHolder.append(this.cartIcon.elem);
    this.cart = new Cart(this.cartIcon);
  }

  renderProductsGrid(products) {
    this.productsGridHolder = document.querySelector(
      "[data-products-grid-holder]"
    );
    this.noNuts = document.querySelector("#nuts-checkbox");
    this.vegeterian = document.querySelector("#vegeterian-checkbox");

    this.productsGrid = new ProductsGrid(products);
    this.productsGridHolder.innerHTML = "";
    this.productsGridHolder.append(this.productsGrid.elem);

    this.productsGrid.updateFilter({
      noNuts: this.noNuts.checked,
      vegeterianOnly: this.vegeterian.checked,
      maxSpiciness: this.slider.value,
      category: this.ribbonMenu.value,
    });
  }

  async render() {
    this.renderCarusel();
    this.renderRibbon();
    this.renderSlider();
    this.renderCartIcon();

    this.response = await fetch("products.json");
    this.products = await this.response.json();

    this.renderProductsGrid(this.products);
    this.addEvents();
  }

  addEvents = () => {
    this.body = document.querySelector("body");

    this.body.addEventListener("product-add", (event) => {
      for (let item of this.products) {
        if (item.id == event.detail) {
          this.cart.addProduct(item);
        }
      }
    });

    this.body.addEventListener("slider-change", (event) => {
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail,
      });
    });

    this.body.addEventListener("ribbon-select", (event) => {
      this.productsGrid.updateFilter({
        category: event.detail,
      });
    });

    this.body.addEventListener("change", (event) => {
      if (event.target.closest("#nuts-checkbox")) {
        this.productsGrid.updateFilter({
          noNuts: event.target.checked,
        });
      }
      if (event.target.closest("#vegeterian-checkbox")) {
        this.productsGrid.updateFilter({
          vegeterianOnly: event.target.checked,
        });
      }
    });
  };
}
