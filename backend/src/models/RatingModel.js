const mongoose = require("mongoose");
const Customer = require("./CustomerModel");
const Product = require("./ProductModel");
const Schema = mongoose.Schema;

const ratingSchema = new mongoose.Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);
const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
