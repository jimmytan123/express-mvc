const fs = require('fs');
const path = require('path');

const Cart = require('./cart');
/* 
    Helper variable for the path to the data/products.json
*/
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

/**
 * Helper Function for reading file - products.json
 * If the file not exist, pass the empty array
 * @param {function} cb  The callback function
 */
const getProductsFromFile = (cb) => {
  const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
  );

  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Save the product to the product.json file
  save() {
    getProductsFromFile((products) => {
      // If the product has id, then update the product
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );

        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        // Add product mode
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  /**
   * Delete product by Id, also delete from the cart if it has the product we need to delete
   * Static method - It is directly called from the class itself.
   * @param {function} id  The product id
   */
  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);

      const updatedProducts = products.filter((prod) => prod.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  /**
   * Fetching all products
   * Static method - It is directly called from the class itself.
   * @param {function} cb  The callback function
   */
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  /**
   * Finding the product by Id
   * @param {string} id  The id of the product
   * @param {function} cb  The callback function
   */
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }
};
