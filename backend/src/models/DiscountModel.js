const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const discountSchema = new mongoose.Schema(
  {
    discountId: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    startDate: { type: Date, default: Date.now, required: true },
    endDate: { type: Date, default: Date.now, required: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
