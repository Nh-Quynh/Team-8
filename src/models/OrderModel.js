const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new mongoose.Schema({
  orderDetail: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderDetail",
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
