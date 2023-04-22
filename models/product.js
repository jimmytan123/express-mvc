const products = [];

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  // Static method - It is directly called from the class itself, not the instances
  static fetchAll() {
    return products;
  }
};
