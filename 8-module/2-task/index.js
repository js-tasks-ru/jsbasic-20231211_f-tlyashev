import createElement from "../../assets/lib/create-element.js";
import ProductCard from "../../6-module/2-task/index.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {
      noNuts: false,
      vegeterianOnly: false,
      maxSpiciness: 4,
      category: "",
    };
    this.render();
  }

  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    this.productGridInner = this.elem.querySelector(".products-grid__inner");
    this.productCards = this.products.map((product) =>
      Object.assign(new ProductCard(product), {
        nuts: product.nuts,
        vegeterian: product.vegeterian,
        spiciness: product.spiciness,
        category: product.category,
      })
    );

    this.renderCards(this.productCards);
  }

  renderCards(cards) {
    for (let card of cards) {
      this.productGridInner.append(card.elem);
    }
  }

  updateFilter(newFilter) {
    Object.assign(this.filters, newFilter);

    let filteredCards = this.productCards.filter(
      (card) => card.spiciness <= this.filters.maxSpiciness
    );

    if (this.filters.noNuts) {
      filteredCards = filteredCards.filter((card) => !card.nuts);
    }
    if (this.filters.vegeterianOnly) {
      filteredCards = filteredCards.filter((card) => card.vegeterian);
    }
    if (this.filters.category) {
      filteredCards = filteredCards.filter(
        (card) => card.category === this.filters.category
      );
    }

    this.productGridInner.innerHTML = "";
    this.renderCards(filteredCards);
  }
}
