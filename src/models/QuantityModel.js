const mongoose = require("mongoose");
const quantitySchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Quantity = mongoose.model("Quantity", quantitySchema);
module.exports = Quantity;
