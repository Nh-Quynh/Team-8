const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Schema.Types.ObjectId,
          ref: "Quantity",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
