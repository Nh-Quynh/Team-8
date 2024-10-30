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
        quantityId: {
          type: Schema.Types.ObjectId,
          ref: "Quantity",
          required: true,
        },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
