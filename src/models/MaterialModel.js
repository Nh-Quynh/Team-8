const mongoose = require("mongoose");
const materialSchema = new mongoose.Schema(
  {
    id_material: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const Material = mongoose.model("Material", materialSchema);
module.exports = Material;
