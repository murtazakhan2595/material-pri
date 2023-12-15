// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import app from "./app.js";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.js");


// handles uncaughtExecption
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!💥 Shutting down...");
  console.log(err.name, err.message, err);
});

// configure .env file
dotenv.config();

// configure and connect to DB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// configure port and connect to server
const port = process.env.PORT || 5544;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION!💥 Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
