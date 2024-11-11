const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const image = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
const Image = mongoose.model("Image", image );
module.exports = Image;
