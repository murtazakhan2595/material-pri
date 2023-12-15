// import AppError from "../utils/appError.js";
// import catchAsync from "../utils/catchAsync.js";
// import Customer from "./../models/customerModel.js";
// // import Employee from "../models/EmployeeModel.js";
// const Employee = require("../models/employeeModel.js");

const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const Customer = require("./../models/customerModel.js");
// const Employee = require("../models/EmployeeModel.js");
const Employee = require("../models/employeeModel.js");


const getAll = catchAsync(async (req, res, next) => {
  // Empty `filter` means "match all documents"
  const filter = {};

  const customers = await Customer.find(filter)
    .populate({
      path: "createdBy",
      select: "name",
    })
    .exec();

  // Map the customers to include the employee name
  const customersWithEmployeeNames = customers.map((customer) => {
    return {
      _id: customer._id,
      customer: customer.customer,
      status: customer.status,
      createdBy: customer.createdBy?.name,
      description: customer.description,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  });

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: customers.length,
    data: {
      customers: customersWithEmployeeNames,
    },
  });
});

const create = catchAsync(async (req, res, next) => {
  console.log(req);
  const id = req.user.id;
  // check if the user exists
  const user = await Employee.exists({ _id: id });
  if (!user) {
    return next(new AppError("User doesnt exist ", 401));
  }
  const { customer, status } = req.body;
  console.log(req.body, "\nid ->", id);
  const newCustomer = await Customer.create({
    customer,
    status,
    createdBy: id,
  });
  res.status(200).json({
    status: "success",
    data: {
      newCustomer,
    },
  });
});

const deleteCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return next(new AppError("No customer found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const get = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
const update = catchAsync(async (req, res, next) => {
  const customer_id = req.params.id;

  const { customer, status } = req.body;
  const updateCusomer = await Customer.findOneAndUpdate(
    { _id: customer_id },
    {
      $set: {
        customer,
        status,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: updateCusomer,
  });
});

// export default {
//   create,
//   getAll,
//   deleteCustomer,
//   update,
//   get,
// };

module.exports = {
  create,
  getAll,
  deleteCustomer,
  update,
  get,
};