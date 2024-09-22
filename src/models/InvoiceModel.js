const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    seriesNumber: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      required: true,
    },
    repeatDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
