const mongoose = require("mongoose");
const Category = require("./CategoryModel");
const Material = require("./MaterialModel");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
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
  urlImage: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  material: {
    type: Schema.Types.ObjectId,
    ref: Material,
    required: true,
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
