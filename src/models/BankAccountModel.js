const mongoose = require("mongoose");
const bankAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
module.exports = BankAccount;
