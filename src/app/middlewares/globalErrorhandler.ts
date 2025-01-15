/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../errors/AppError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import { TErrorSources } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Initialize default error response
  let statusCode = 500;
  let message = "Got an Error!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  // Handle specific error types
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    ({ statusCode, message, errorSources } = simplifiedError);
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    ({ statusCode, message, errorSources } = simplifiedError);
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    ({ statusCode, message, errorSources } = simplifiedError);
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    ({ statusCode, message, errorSources } = simplifiedError);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  // Construct and send the error response
  const errorResponse = {
    success: false,
    message,
    errorSources,
    err: config.node_env === "development" ? err : undefined,
    stack: config.node_env === "development" ? err?.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
