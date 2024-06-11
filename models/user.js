const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
  resetToken: String, // optional for reset pw
  resetTokenExpiration: Date, // optional for reset pw
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

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
