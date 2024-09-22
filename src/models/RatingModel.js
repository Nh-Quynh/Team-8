const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema(
  {
    customer: {
      type: Schema.Type.ObjectId,
      ref: "Customer",
      required: true,
    },
    product: {
      type: Schema.Type.ObjectId,
      ref: "Product",
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
