const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Product Schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // add relation to User model
});

// Creating a Model, Mongoose will automatically create a collection named 'products'
module.exports = mongoose.model('Product', productSchema);