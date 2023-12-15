// import mongoose from "mongoose";
const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, "Please tell us your customer!"],
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "archive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Employee",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Customer = mongoose.model("Customer", customerSchema);
// export default Customer;
module.exports = Customer;