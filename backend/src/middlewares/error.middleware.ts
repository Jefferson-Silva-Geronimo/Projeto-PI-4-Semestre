import { ErrorRequestHandler } from "express";
import { AppError } from "../shared/errors/AppError";
export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) return res.status(error.statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
  console.error(error);
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Erro interno do servidor." } });
};
