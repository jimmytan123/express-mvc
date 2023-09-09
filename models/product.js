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

  /**
   * Save product with MySQL
   * SQL command, don't need to pass id as will automatically added when inserting into the DB
   * Returns a Promise
   */
  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  /**
   * Delete product by Id, also delete from the cart if it has the product we need to delete
   * Static method - It is directly called from the class itself.
   * @param {function} id  The product id
   */
  static deleteById(id) {}

  /**
   * Fetching all products with MySQL
   * Static method - It is directly called from the class itself.
   * Returns a Promise
   */
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  /**
   * Finding the product by Id with MySQL (it will find and replace id with '?')
   * @param {string} id  The id of the product
   */
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
