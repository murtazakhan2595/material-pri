// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin", "super-admin"],
      default: "employee",
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      default: "12345678",
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    location: {
      type: String,
    },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
employeeSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports=Employee;
