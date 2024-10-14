const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Tránh trùng lặp trạng thái
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
