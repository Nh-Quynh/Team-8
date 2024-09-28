const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new mongoose.Schema({
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
    ref: "Category",
    required: true,
  },
  material: {
    type: Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
