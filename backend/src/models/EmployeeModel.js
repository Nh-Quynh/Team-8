const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fullName: { type: String },
    image: { type: String },
    email: { type: String, required: true },
    birthday: { type: Date },
    gender: { type: Boolean },
    phone: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
