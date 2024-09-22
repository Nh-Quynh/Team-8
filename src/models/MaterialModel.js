const mongoose = require("mongoose");
const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Material = mongoose.model("Material", materialSchema);
module.exports = Material;
