// import express from "express";
// import authController from "../controllers/authController.js";
// import productController from "../controllers/productController.js";
const express = require("express");
const authController = require("../controllers/authController.js");
const productController = require("../controllers/productController.js");


const router = express.Router();

// getAll only design for mosiac will update
router.get("/", authController.protect, productController.getAll);
router.get("/:productType", authController.protect, productController.get);
router.post(
  "/add-product/:productType",
  authController.protect,
  productController.addProduct
);
router.delete(
  "/:productType/:id",
  authController.protect,
  productController.deleteProduct
);
router.patch(
  "/:productType/:id",
  authController.protect,
  productController.update
);

// export { router };

module.exports = router;
