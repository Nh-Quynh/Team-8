const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
