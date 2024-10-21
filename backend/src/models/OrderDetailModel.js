const mongoose = require("mongoose");
const Quantity = require("./QuantityModel");

const Schema = mongoose.Schema;

const orderDetailSchema = new mongoose.Schema({
  productQuantity: {
    type: Schema.Types.ObjectId,
    ref: Quantity,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
module.exports = OrderDetail;
