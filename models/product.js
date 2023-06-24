const fs = require('fs');
const path = require('path');

/* 
    Helper variable for the path to the data/products.json
*/
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

/* 
    Helper Function for reading file - products.json
    If the file not exist, pass the empty array
    cb - callback Function
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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Save the product to the product.json file
  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  /* 
   * Static method - It is directly called from the class itself, not the instances
   * Getting products from the file
  */
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
