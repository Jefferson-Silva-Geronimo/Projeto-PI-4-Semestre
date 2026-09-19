import { RequestHandler } from "express";
import { ZodType } from "zod";
import { AppError } from "../shared/errors/AppError";
export const validate = (schema: ZodType, source: "body" | "params" | "query" = "body"): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError("Dados inválidos.", 422, "VALIDATION_ERROR", result.error.issues));
  (req as any)[source] = result.data;
  next();
};
