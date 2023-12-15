// import express from "express";
// import authController from "../controllers/authController.js";
// import employeeController from "../controllers/employeeController.js";
const express = require("express");
const authController = require("../controllers/authController.js");
const employeeController = require("../controllers/employeeController.js");


const router = express.Router();

router.get("/", authController.protect, employeeController.getAll);
router.get("/:id", authController.protect, employeeController.get);

router.post("/login", authController.login);
router.post("/signup", authController.signup);

// Protect all routes after this middlewares
router.use(authController.protect);
router.get("/logout", authController.logout);

router.post(
  "/create-employee",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  employeeController.createEmployee
);
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  employeeController.deleteEmployee
);

router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  employeeController.update
);
// export { router };

module.exports = router
