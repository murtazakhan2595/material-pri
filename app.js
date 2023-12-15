// import express from "express";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import cors from "cors"
// import { router as employeeRouter } from "./routes/employeeRoutes.js";
// import { router as customerRouter } from "./routes/customerRoutes.js";
// import { router as productRouter } from "./routes/productRoutes.js";
// import { router as quoteRouter } from "./routes/quoteRoutes.js";
// import globalErrorHandler from "./controllers/errorController.js";
// import AppError from "./utils/appError.js";
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const employeeRouter  = require("./routes/employeeRoutes.js");
const customerRouter  = require("./routes/customerRoutes.js");
const productRouter  = require("./routes/productRoutes.js");
const quoteRouter  = require("./routes/quoteRoutes.js");
const globalErrorHandler = require("./controllers/errorController.js");
const AppError = require("./utils/appError.js");


const app = express();

// 1) GLOBAL MIDDLEWARES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb" }));
app.use("/storage", express.static("storage"));
app.use(express.json());
app.use(morgan("dev"));

// 3) ROUTES
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/quotes", quoteRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// export default app;
module.exports = app;



  // "type": "module",