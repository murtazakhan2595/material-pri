// import AppError from "../utils/appError.js";
// import catchAsync from "../utils/catchAsync.js";
// // import Employee from "../models/EmployeeModel.js";
// const Employee = require("../models/employeeModel.js");
// import Jimp from "jimp";
// import sharp from "sharp";
// import path from "path";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
// const Employee = require("../models/EmployeeModel.js");
const Employee = require("../models/employeeModel.js");
const Jimp = require("jimp");
const sharp = require("sharp");
const path = require("path");
const { dirname } = require("path");
const { fileURLToPath } = require("url");



const getAll = catchAsync(async (req, res, next) => {
  // Empty `filter` means "match all documents"
  const filter = {};
  const employee = await Employee.find(filter);
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: employee.length,
    data: {
      employee,
    },
  });
});

const get = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      employee,
    },
  });
});

const createEmployee = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  let { name, email, password, status, role, location, image } = req.body;
  role = role?.toLowerCase();

  const user = req.user;
  // console.log("next thing is user", user);
  if (user.role === "admin" && role === "super-admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  let imgPath;
  let jimpRes;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  if (image?.length > 0) {
    console.log("reaching here", name, email, role, location, image);
    // preprocess the image
    const buffer = Buffer.from(
      image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    imgPath = `${Date.now()}-${Math.round(Math.random() * 100000)}.png`;
    jimpRes = await Jimp.read(buffer);
    jimpRes
      //   .resize(200, Jimp.AUTO) i want to keep original res intact
      .write(path.resolve(__dirname, `../storage/${imgPath}`));

    await sharp(buffer)
      // Resize or apply other operations if needed
      // .resize(200, 200)
      .toFile(path.resolve(__dirname, `../storage/${imgPath}`));
  }

  const newEmployee = await Employee.create({
    name,
    email,
    password,
    status,
    role,
    location,
    image,
  });

  console.log("New employe created ->", newEmployee);

  res.status(200).json({
    status: "success",
    data: {
      newEmployee,
    },
  });
});

const update = catchAsync(async (req, res, next) => {
  const user = req.user;
  // check if the user exists
  if (!user) {
    return next(new AppError("User doesnt exist ", 401));
  }
  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }

  const { name, status, role, location } = req.body;
  console.log();
  if (user.role === "admin" && role === "super-admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  const updateEmployee = await Employee.findOneAndUpdate(
    { _id: employee },
    {
      $set: {
        name,
        status,
        role,
        location,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: updateEmployee,
  });
});

const deleteEmployee = catchAsync(async (req, res, next) => {
  const user = req.user;
  // check if the user exists
  if (!user) {
    return next(new AppError("User doesnt exist ", 401));
  }
  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }

  if (user.role === "admin" && employee.role === "super-admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// export default {
//   createEmployee,
//   deleteEmployee,
//   getAll,
//   get,
//   update,
// };
module.exports ={
  createEmployee,
  deleteEmployee,
  getAll,
  get,
  update,
};
