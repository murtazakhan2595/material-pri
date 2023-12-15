// import AppError from "../utils/appError.js";
// import catchAsync from "../utils/catchAsync.js";
// // import Employee from "../models/EmployeeModel.js";
// const Employee = require('../models/employeeModel.js')
// import jwt from "jsonwebtoken";
// import { promisify } from "util";
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
// const Employee = require("../models/EmployeeModel.js");
const Employee = require("../models/employeeModel.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (employee, statusCode, res) => {
  const token = signToken(employee._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  employee.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      employee,
    },
  });
};
const login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;
  console.log("From backend, ",req.body)

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if employee exists && password is correct
  const employee = await Employee.findOne({ email }).select("+password");
  if (
    !employee ||
    !(await employee.correctPassword(password, employee.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(employee, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, status } = req.body;
  console.log(req.body);
  const newEmployee = await Employee.create({
    name,
    email,
    password,
    status,
  });

  createSendToken(newEmployee, 201, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentEmployee = await Employee.findById(decoded.id);
  if (!currentEmployee) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentEmployee.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentEmployee;
  res.locals.user = currentEmployee;
  next();
});

const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// export default {
//   login,
//   protect,
//   signup,
//   logout,
//   restrictTo,
// };
module.exports = {
  login,
  protect,
  signup,
  logout,
  restrictTo,
};