const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// Define method addToCart to the user schema
userSchema.methods.addToCart = function (product) {
  // Return the cart product index in the current cart
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items]; // create a new array with all items of the cart

  /* If product exists in the current cart, update quantity;
   * else, add a new object
   */
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    // Update the cart array with a new quantity
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // Add a new cart item
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  // Add product info object to the cart
  const updatedCart = {
    items: updatedCartItems,
  };

  // Update the user to have the updated cart to the DB (save() is an utility function)
  this.cart = updatedCart;
  return this.save();
};

// Define custom method removeFromCart to the user schem
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;

  // update cart items array and save
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };

  return this.save()
};

module.exports = mongoose.model('User', userSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db.collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     // Return the cart product index in the current cart
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items]; // create a new array with all items of the cart

//     /* If product exists in the current cart, update quantity;
//      * else, add a new object
//      */
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       // Update the cart array with a new quantity
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // Add a new cart item
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     // Add product info object to the cart
//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     // Update the user to have the updated cart to the DB
//     const db = getDb();

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   // Returns an array of cart items
//   getCart() {
//     const db = getDb();

//     // Construct an array of product id from the cart
//     const productIds = this.cart.items.map((item) => item.productId);

//     // Tell DB to return all elements when the id is included by the productIds array
//     // Then reconstruct the array with the quantity
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();

//     // Update db with the filtered cart
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     // Get the cart with enriched info about products, then construct the order obj
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };

//         //Create/reach out collection orders, insert the cart info, empty the cart afterwards
//         return db.collection('orders').insertOne(order);
//       })
//       .then((result) => {
//         // Empty cart in the user object
//         this.cart = { items: [] };

//         // Empty cart in the DB
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();

//     // Find all orders associated with the current user
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }
// module.exports = User;
