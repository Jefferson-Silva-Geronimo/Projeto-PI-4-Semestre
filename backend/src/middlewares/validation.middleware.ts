import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ZodType,
} from "zod";

import {
  AppError,
} from "../shared/errors/AppError";

type ValidationSource =
  | "body"
  | "params"
  | "query";

export function validate(
  schema: ZodType,
  source: ValidationSource = "body",
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const valueToValidate =
      source === "body"
        ? req.body
        : source === "params"
          ? req.params
          : req.query;

    const result =
      schema.safeParse(
        valueToValidate,
      );

    if (!result.success) {
      return next(
        new AppError(
          "Dados inválidos.",
          400,
          "VALIDATION_ERROR",
          result.error.issues,
        ),
      );
    }

    if (source === "query") {
      res.locals.validatedQuery =
        result.data;
    } else if (source === "params") {
      res.locals.validatedParams =
        result.data;
    } else {
      req.body = result.data;
    }

    return next();
  };
}