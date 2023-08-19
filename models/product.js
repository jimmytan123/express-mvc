const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {}

  /**
   * Delete product by Id, also delete from the cart if it has the product we need to delete
   * Static method - It is directly called from the class itself.
   * @param {function} id  The product id
   */
  static deleteById(id) {}

  /**
   * Fetching all products
   * Static method - It is directly called from the class itself.
   */
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  /**
   * Finding the product by Id
   * @param {string} id  The id of the product
   */
  static findById(id) {}
};
