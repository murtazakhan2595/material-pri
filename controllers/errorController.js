// import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  console.log(req.originalUrl);
  if (req.originalUrl.startsWith("/api")) {
    const error={
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    };
    console.log(error)
    return res.status(err.statusCode).json(error);
  }
  console.log("errorrrrrrrrrrrrrrrrr")

  // B) RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err.message)
  // let error = { ...err };
  // error.message = err.message;
  // if (error.name === "CastError") error = handleCastErrorDB(error);
  // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  // if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  // if (error.name === "JsonWebTokenError") error = handleJWTError();
  // if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
  sendErrorDev(err, req, res);
};

export default globalErrorHandler;
