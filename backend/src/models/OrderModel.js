const PaymentMethod = require("./PaymentMethodModel");
const OrderDetail = require("./OrderDetailModel");
const Status = require("./Status.Model");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  orderDetail: [
    {
      type: Schema.Types.ObjectId,
      ref: OrderDetail,
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryMethod: {
    type: String,
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
    ref: PaymentMethod,
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: Status,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
