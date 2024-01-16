export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}
