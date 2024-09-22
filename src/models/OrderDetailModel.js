const mongoose = require("mongoose");
const orderDetailSchema = new mongoose.Schema({
  productQuantity: {
    type: Schema.Typé.ObjectId,
    ref: "Quantity",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
module.exports = OrderDetail;
