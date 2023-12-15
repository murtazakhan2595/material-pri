// import express from "express";
// import authController from "../controllers/authController.js";
// import quoteController from "../controllers/quoteController.js";
const express = require("express");
const authController = require("../controllers/authController.js");
const quoteController = require("../controllers/quoteController.js");


const router = express.Router();

router.get("/", authController.protect, quoteController.getAll);
router.post("/add-quote", authController.protect, quoteController.addQuote);
router.patch("/:id", authController.protect, quoteController.update);
router.delete("/:id", authController.protect, quoteController.deleteQuote);

// export { router };
module.exports =router
