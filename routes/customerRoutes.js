import express from "express";
import authController from "../controllers/authController.js";
import customerController from "../controllers/customerController.js";

const router = express.Router();

router.get("/", authController.protect, customerController.getAll);
router.get("/:id", authController.protect, customerController.get);
router.post(
  "/create-customer",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  customerController.create
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  customerController.deleteCustomer
);
router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("admin", "super-admin"),
  customerController.update
);

export { router };
