const mongoose = require("mongoose");
const Product = require("./ProductModel");
const Color = require("./ColorModel");

const Schema = mongoose.Schema;

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
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
        // required: true,
      },
    ],
    // image: {
    //   type:String,
    //   // ref: "Image",
    //   // required: true,
    // },
  },
  {
    timestamps: true,
  }
);
const Quantity = mongoose.model("Quantity", quantitySchema);
module.exports = Quantity;
